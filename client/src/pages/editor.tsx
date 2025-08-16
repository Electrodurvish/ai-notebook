import { useLocation, useNavigate } from "react-router-dom";
import SummaryEditor from "../components/summaryeditor";

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSummary = location.state?.summary as Summary | null;

  const handleSummaryUpdated = (summary: Summary) => {
    // Update the summary in the location state
    navigate("/editor", { 
      state: { summary }, 
      replace: true 
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📝 Summary Editor
            </h1>
            <p className="text-gray-600 mt-2">
              Edit and refine your AI-generated summary
            </p>
          </div>
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        {/* Editor Component */}
        <SummaryEditor 
          summary={selectedSummary || undefined} 
          onSummaryUpdated={handleSummaryUpdated}
        />

        {/* Instructions */}
        {!selectedSummary && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">
              💡 How to Use the Editor
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Generate a summary on the home page first</li>
              <li>• Click "Edit" on any summary to open it here</li>
              <li>• Make your changes and click "Save Changes"</li>
              <li>• Use "Reset to Original" to undo changes</li>
            </ul>
            <div className="mt-4">
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                🏠 Go to Home Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
