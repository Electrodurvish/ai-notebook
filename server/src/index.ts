import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import summaryRoutes from "./routes/routes";
import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`📝 Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📝 Body:`, { 
      ...req.body, 
      text: req.body.text ? `${req.body.text.substring(0, 100)}...` : undefined 
    });
  }
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  console.log(`🏠 [ROOT] Root endpoint accessed`);
  res.json({ 
    message: "AI Notes Summarizer API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api: "/api/summary"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log(`💓 [HEALTH] Health check requested`);
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Server is running" 
  });
});

// Routes
app.use("/api/summary", summaryRoutes);

// Catch-all route for debugging unmatched requests
app.use("*", (req, res) => {
  console.log(`❓ [404] Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Route not found", 
    method: req.method, 
    path: req.originalUrl 
  });
});

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
