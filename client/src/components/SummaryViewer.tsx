import { useNavigate, useLocation } from "react-router-dom";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

interface SummaryViewerProps {
  summary?: Summary;
}

function SummaryViewer({ summary }: SummaryViewerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryFromState = location.state?.summary as Summary | null;
  const finalSummary = summary || summaryFromState;

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleEdit = () => {
    if (finalSummary) {
      navigate("/editor", { state: { summary: finalSummary } });
    }
  };

  if (!finalSummary) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No Summary Selected
        </h3>
        <p className="text-gray-500">
          Select a summary to view its content.
        </p>
        <button
          onClick={handleBackToHome}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          🏠 Go to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📖 Summary: {finalSummary.filename}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Created:</strong> {new Date(finalSummary.createdAt).toLocaleString()}</p>
          {finalSummary.customPrompt && (
            <p><strong>Custom Prompt:</strong> {finalSummary.customPrompt}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary Content
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 leading-relaxed whitespace-pre-wrap">
          {finalSummary.summary}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Original Text
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
          {finalSummary.originalText}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          ✏️ Edit Summary
        </button>

        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default SummaryViewer;
