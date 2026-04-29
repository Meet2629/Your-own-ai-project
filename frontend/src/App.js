import { useState } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import ScatterCanvas from "./components/ScatterCanvas";
import RightPanel from "./components/RightPanel";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [results, setResults] = useState([]);

  return (
    <div className="app">
      <Header />

      <div className="layout">
        <LeftPanel setResults={setResults} />

        <ScatterCanvas results={results} />

        <RightPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          results={results}
        />
      </div>
    </div>
  );
}

export default App;