import { useState } from "react";
import axios from "axios";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

interface UploadFormProps {
  onSummaryGenerated: (summary: Summary) => void;
}

function UploadForm({ onSummaryGenerated }: UploadFormProps) {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !filename.trim()) {
      setError("Please fill in both filename and text fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/summary/upload", {
        text: text.trim(),
        filename: filename.trim(),
        customPrompt: customPrompt.trim() || undefined,
      });

      if (response.data.success) {
        onSummaryGenerated(response.data.summary);
        setText("");
        setFilename("");
        setCustomPrompt("");
        setError("");
      } else {
        setError(response.data.message || "Failed to generate summary");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📝 Generate AI Summary
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filename
          </label>
          <input
            type="text"
            placeholder="e.g., Meeting_2024_01_15"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Summarize in bullet points for executives"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use default summarization
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Transcript / Notes
          </label>
          <textarea
            placeholder="Paste your meeting transcript, notes, or any text you want to summarize..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim() || !filename.trim()}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isLoading || !text.trim() || !filename.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Summary...
            </span>
          ) : (
            "🚀 Generate Summary"
          )}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
