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

// Routes
app.use("/api/summary", summaryRoutes);

// Connect DB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
