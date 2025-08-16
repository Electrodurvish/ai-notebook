import { useState, useEffect } from "react";
import axios from "axios";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

interface SummaryEditorProps {
  summary?: Summary;
  onSummaryUpdated?: (summary: Summary) => void;
}

function SummaryEditor({ summary, onSummaryUpdated }: SummaryEditorProps) {
  const [editedSummary, setEditedSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (summary) {
      setEditedSummary(summary.summary);
    }
  }, [summary]);

  const handleSave = async () => {
    if (!summary) {
      setError("No summary to save");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put("http://localhost:5000/api/summary/update", {
        summaryId: summary._id,
        updatedSummary: editedSummary,
      });

      if (response.data.success) {
        setSuccess("Summary updated successfully!");
        onSummaryUpdated?.(response.data.summary);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to update summary");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (summary) {
      setEditedSummary(summary.summary);
      setError("");
      setSuccess("");
    }
  };

  const handleDelete = async () => {
    if (!summary) {
      setError("No summary to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this summary? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete(`http://localhost:5000/api/summary/delete/${summary._id}`);

      if (response.data.success) {
        setSuccess("Summary deleted successfully!");
        // Redirect to home page after deletion
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setError(response.data.message || "Failed to delete summary");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  if (!summary) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No Summary Selected
        </h3>
        <p className="text-gray-500">
          Generate a summary first, then come back to edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📝 Edit Summary: {summary.filename}
        </h3>
        <div className="text-sm text-gray-600">
          <p><strong>Created:</strong> {new Date(summary.createdAt).toLocaleString()}</p>
          {summary.customPrompt && (
            <p><strong>Custom Prompt:</strong> {summary.customPrompt}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary Content
        </label>
        <textarea
          value={editedSummary}
          onChange={(e) => setEditedSummary(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={12}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading || editedSummary === summary.summary}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isLoading || editedSummary === summary.summary
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? "Saving..." : "💾 Save Changes"}
        </button>

        <button
          onClick={handleReset}
          disabled={isLoading || editedSummary === summary.summary}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isLoading || editedSummary === summary.summary
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          }`}
        >
          🔄 Reset to Original
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          }`}
        >
          🗑️ Delete Summary
        </button>
      </div>

      {editedSummary !== summary.summary && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 You have unsaved changes. Click "Save Changes" to update the summary.
          </p>
        </div>
      )}
    </div>
  );
}

export default SummaryEditor;
