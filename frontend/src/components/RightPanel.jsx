import SearchTab from "./Tabs/SearchTab";
import DocsTab from "./Tabs/DocsTab";
import RagTab from "./Tabs/RagTab";

export default function RightPanel({
  activeTab,
  setActiveTab,
  results,
}) {
  return (
    <aside className="right-panel">

      {/* TABS */}

      <div className="tabs">

        <div
          className={
            activeTab === "search"
              ? "tab active"
              : "tab"
          }
          onClick={() => setActiveTab("search")}
        >
          SEARCH
        </div>

        <div
          className={
            activeTab === "docs"
              ? "tab active"
              : "tab"
          }
          onClick={() => setActiveTab("docs")}
        >
          DOCUMENTS
        </div>

        <div
          className={
            activeTab === "rag"
              ? "tab active"
              : "tab"
          }
          onClick={() => setActiveTab("rag")}
        >
          ASK AI
        </div>

      </div>

      {/* CONTENT */}

      <div className="tab-content">

        {activeTab === "search" && (
          <SearchTab results={results} />
        )}

        {activeTab === "docs" && (
          <DocsTab />
        )}

        {activeTab === "rag" && (
          <RagTab />
        )}

      </div>

    </aside>
  );
}