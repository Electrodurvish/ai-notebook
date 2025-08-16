import { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";
import ShareForm from "../components/shareform";
import SummaryList from "../components/SummaryList";
import SummaryEditor from "../components/summaryeditor"; // Assuming you will create this component

interface Summary {
  _id: string;
  filename: string;
  summary: string;
  originalText: string;
  customPrompt?: string;
  createdAt: string;
}

function Home() {
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchSummaries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/summary");
      if (response.data.success) {
        setSummaries(response.data.summaries);
      }
    } catch (error) {
      console.error("Failed to fetch summaries:", error);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, [refreshTrigger]);

  const handleSummaryGenerated = (summary: Summary) => {
    setSelectedSummary(summary);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSummaryUpdated = (summary: Summary) => {
    setSelectedSummary(summary);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI Meeting Notes Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your meeting transcripts into intelligent summaries with custom instructions. 
            Edit, save, and share your AI-generated insights effortlessly.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Upload Form */}
          <div>
            <UploadForm onSummaryGenerated={handleSummaryGenerated} />
          </div>

          {/* Right Column - Share Form */}
          <div>
            <ShareForm 
              summaries={summaries} 
            />
          </div>
        </div>

        {/* Summaries List */}
        <div className="mb-8">
          <SummaryList 
            onSummarySelected={setSelectedSummary}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Summary Editor - New Section */}
        {selectedSummary && (
          <div className="mb-8">
            <SummaryEditor 
              summary={selectedSummary} 
              onSummaryUpdated={handleSummaryUpdated} 
            />
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            ✨ Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-medium text-gray-800 mb-2">AI-Powered Summarization</h3>
              <p className="text-gray-600 text-sm">
                Uses Google's advanced AI to create intelligent, contextual summaries
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✏️</div>
              <h3 className="font-medium text-gray-800 mb-2">Editable Summaries</h3>
              <p className="text-gray-600 text-sm">
                Fine-tune and customize your summaries before sharing
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-medium text-gray-800 mb-2">Easy Sharing</h3>
              <p className="text-gray-600 text-sm">
                Share summaries via email with custom messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;