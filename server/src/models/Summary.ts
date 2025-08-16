import mongoose, { Document, Schema } from "mongoose";

export interface ISummary extends Document {
  filename: string;
  summary: string;
  originalText?: string;
  customPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const summarySchema = new Schema<ISummary>(
  {
    filename: { type: String, required: true },
    summary: { type: String, required: true },
    originalText: { type: String },
    customPrompt: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISummary>("Summary", summarySchema);
