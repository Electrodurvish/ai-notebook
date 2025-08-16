import { Request, Response } from "express";
import Summary from "../models/Summary";
import { sendEmail } from "../services/emailService";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "AIzaSyDXH_uGkISObI-1UZE2hKBV3sWlC94RFC0");

// Retry function with exponential backoff
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

// Enhanced AI Summary Function using Google's Generative AI
const generateSummary = async (text: string, customPrompt?: string): Promise<string> => {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Google AI API key not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    const defaultPrompt = "Please provide a clear, structured summary of the following text. Focus on key points, main ideas, and important details.";
    const prompt = customPrompt || defaultPrompt;
    
    const fullPrompt = `${prompt}\n\nText to summarize:\n${text}`;
    
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(fullPrompt);
    });
    
    const response = await result.response;
    const summary = response.text();
    
    return summary || "Unable to generate summary at this time.";
  } catch (error: any) {
    console.error("AI Summary generation error:", error);
    
    // Handle specific quota errors
    if (error.status === 429) {
      return "⚠️ AI service is currently busy. Please try again in a few minutes, or use the fallback summary below.\n\n" + 
             text.split(" ").slice(0, 100).join(" ") + "...";
    }
    
    // Fallback to basic summary if AI fails
    return text.split(" ").slice(0, 100).join(" ") + "...";
  }
};

// 📌 Upload and summarize text
export const uploadSummary = async (req: Request, res: Response) => {
  try {
    const { text, filename, customPrompt } = req.body;

    if (!text || !filename) {
      return res.status(400).json({ message: "Text and filename are required" });
    }

    const summary = await generateSummary(text, customPrompt);

    const newSummary = new Summary({ 
      filename, 
      summary,
      originalText: text,
      customPrompt: customPrompt || null
    });
    await newSummary.save();

    res.status(201).json({
      success: true,
      summary: newSummary,
      message: "Summary generated successfully!"
    });
  } catch (error) {
    console.error("Upload summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error uploading summary", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 📌 Get all summaries
export const getSummaries = async (_req: Request, res: Response) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      summaries,
      count: summaries.length
    });
  } catch (error) {
    console.error("Get summaries error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching summaries", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 📌 Share summary via Email
export const shareSummary = async (req: Request, res: Response) => {
  try {
    const { email, summaryId, customMessage } = req.body;

    if (!email || !summaryId) {
      return res.status(400).json({ 
        success: false,
        message: "Email and summary ID are required" 
      });
    }

    const summary = await Summary.findById(summaryId);
    if (!summary) {
      return res.status(404).json({ 
        success: false,
        message: "Summary not found" 
      });
    }

    const emailSubject = `AI Meeting Notes Summary: ${summary.filename}`;
    const emailBody = customMessage 
      ? `${customMessage}\n\n${summary.summary}`
      : summary.summary;

    await sendEmail(email, emailSubject, emailBody);

    res.json({ 
      success: true,
      message: "Summary shared via email successfully!" 
    });
  } catch (error) {
    console.error("Share summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error sharing summary", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 📌 Update summary
export const updateSummary = async (req: Request, res: Response) => {
  try {
    const { summaryId, updatedSummary } = req.body;

    if (!summaryId || !updatedSummary) {
      return res.status(400).json({ 
        success: false,
        message: "Summary ID and updated summary are required" 
      });
    }

    const summary = await Summary.findByIdAndUpdate(
      summaryId,
      { summary: updatedSummary },
      { new: true }
    );

    if (!summary) {
      return res.status(404).json({ 
        success: false,
        message: "Summary not found" 
      });
    }

    res.json({
      success: true,
      summary,
      message: "Summary updated successfully!"
    });
  } catch (error) {
    console.error("Update summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating summary", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 📌 Delete summary
export const deleteSummary = async (req: Request, res: Response) => {
  try {
    const { summaryId } = req.params;

    if (!summaryId) {
      return res.status(400).json({ 
        success: false,
        message: "Summary ID is required" 
      });
    }

    const summary = await Summary.findByIdAndDelete(summaryId);

    if (!summary) {
      return res.status(404).json({ 
        success: false,
        message: "Summary not found" 
      });
    }

    res.json({
      success: true,
      message: "Summary deleted successfully!"
    });
  } catch (error) {
    console.error("Delete summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting summary", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};