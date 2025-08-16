import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/editor";
import SummaryViewer from "./components/SummaryViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/view" element={<SummaryViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
