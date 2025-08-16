import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

interface SummaryListProps {
  onSummarySelected: (summary: Summary) => void;
  refreshTrigger: number;
}

function SummaryList({ onSummarySelected, refreshTrigger }: SummaryListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSummaries = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(API_ENDPOINTS.SUMMARY.GET_ALL);
      
      if (response.data.success) {
        setSummaries(response.data.summaries);
      } else {
        setError(response.data.message || "Failed to fetch summaries");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, [refreshTrigger]);

  const handleEdit = (summary: Summary) => {
    onSummarySelected(summary);
    navigate("/editor", { state: { summary } });
  };

  const handleView = (summary: Summary) => {
    onSummarySelected(summary);
    navigate("/editor", { state: { summary } });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-gray-600">Loading summaries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={fetchSummaries}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Summaries Yet
          </h3>
          <p className="text-gray-500">
            Generate your first AI summary to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          📚 Your Summaries ({summaries.length})
        </h2>
        <button
          onClick={fetchSummaries}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-4">
        {summaries.map((summary) => (
          <div
            key={summary._id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-2">
                  {summary.filename}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="mr-4">
                    📅 {new Date(summary.createdAt).toLocaleString()}
                  </span>
                  {summary.customPrompt && (
                    <span className="mr-4">
                      💡 Custom prompt used
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {summary.summary.length > 200
                    ? `${summary.summary.substring(0, 200)}...`
                    : summary.summary}
                </p>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleView(summary)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEdit(summary)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummaryList;

