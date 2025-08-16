import mongoose from "mongoose";

// MongoDB connection with fallback to cloud database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://2022kuec2015:durvish%402003@cluster0.ijwxylq.mongodb.net/ai-notes-app");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
