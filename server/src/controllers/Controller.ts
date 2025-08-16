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
  console.log(`🧠 [AI] Starting generateSummary - textLength: ${text.length}, hasCustomPrompt: ${!!customPrompt}`);
  
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.log(`❌ [AI] Google AI API key not configured`);
      throw new Error("Google AI API key not configured");
    }

    console.log(`🔧 [AI] Initializing Gemini model...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const defaultPrompt = "Please provide a clear, structured summary of the following text. Focus on key points, main ideas, and important details.";
    const prompt = customPrompt || defaultPrompt;
    
    const fullPrompt = `${prompt}\n\nText to summarize:\n${text}`;
    console.log(`📝 [AI] Prompt prepared, total length: ${fullPrompt.length}`);
    
    console.log(`🚀 [AI] Sending request to Google AI...`);
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(fullPrompt);
    });
    
    console.log(`📥 [AI] Received response from Google AI`);
    const response = await result.response;
    const summary = response.text();
    
    console.log(`✅ [AI] Summary generated successfully, length: ${summary.length}`);
    return summary || "Unable to generate summary at this time.";
  } catch (error: any) {
    console.error("❌ [AI] AI Summary generation error:", error);
    
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
  console.log(`🚀 [UPLOAD] Starting summary generation for file: ${req.body.filename}`);
  
  try {
    const { text, filename, customPrompt } = req.body;

    console.log(`📊 [UPLOAD] Request data - filename: ${filename}, textLength: ${text?.length || 0}, customPrompt: ${customPrompt || 'none'}`);

    if (!text || !filename) {
      console.log(`❌ [UPLOAD] Validation failed - text: ${!!text}, filename: ${!!filename}`);
      return res.status(400).json({ message: "Text and filename are required" });
    }

    console.log(`🤖 [UPLOAD] Starting AI summary generation...`);
    const summary = await generateSummary(text, customPrompt);
    console.log(`✅ [UPLOAD] AI summary generated successfully, length: ${summary.length}`);

    console.log(`💾 [UPLOAD] Saving summary to database...`);
    const newSummary = new Summary({ 
      filename, 
      summary,
      originalText: text,
      customPrompt: customPrompt || null
    });
    await newSummary.save();
    console.log(`✅ [UPLOAD] Summary saved to database with ID: ${newSummary._id}`);

    console.log(`📤 [UPLOAD] Sending success response`);
    res.status(201).json({
      success: true,
      summary: newSummary,
      message: "Summary generated successfully!"
    });
  } catch (error) {
    console.error("❌ [UPLOAD] Upload summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error uploading summary", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// 📌 Get all summaries
export const getSummaries = async (_req: Request, res: Response) => {
  console.log(`📋 [GET] Fetching all summaries from database...`);
  
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    console.log(`✅ [GET] Found ${summaries.length} summaries in database`);
    
    res.json({
      success: true,
      summaries,
      count: summaries.length
    });
  } catch (error) {
    console.error("❌ [GET] Get summaries error:", error);
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