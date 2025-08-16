import { useState } from "react";
import axios from "axios";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  createdAt: string;
}

interface ShareFormProps {
  summaries: Summary[];
}

function ShareForm({ summaries }: ShareFormProps) {
  const [email, setEmail] = useState("");
  const [summaryId, setSummaryId] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !summaryId) {
      setError("Please fill in both email and summary fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/summary/share", {
        email: email.trim(),
        summaryId,
        customMessage: customMessage.trim() || undefined,
      });

      if (response.data.success) {
        setSuccess("Summary shared successfully!");
        setEmail("");
        setSummaryId("");
        setCustomMessage("");
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(response.data.message || "Failed to share summary");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSummary = summaries.find(s => s._id === summaryId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📧 Share Summary via Email
      </h2>
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Summary to Share
          </label>
          <select
            value={summaryId}
            onChange={(e) => setSummaryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Choose a summary...</option>
            {summaries.map((summary) => (
              <option key={summary._id} value={summary._id}>
                {summary.filename} - {new Date(summary.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {selectedSummary && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Selected Summary:</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Filename:</strong> {selectedSummary.filename}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Created:</strong> {new Date(selectedSummary.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Preview:</strong> {selectedSummary.summary.substring(0, 100)}...
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            placeholder="Add a personal message to accompany the summary..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !summaryId}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isLoading || !email.trim() || !summaryId
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Email...
            </span>
          ) : (
            "📧 Share Summary"
          )}
        </button>
      </form>
    </div>
  );
}

export default ShareForm;
