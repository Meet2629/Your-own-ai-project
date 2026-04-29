import { useState } from "react";

const API = "http://localhost:8080";

export default function LeftPanel({
  query,
  setQuery,
  setResults,
  algo = "hnsw",          // ✅ default value
  setAlgo = () => {},     // ✅ prevent crash
}) {
  const [k, setK] = useState(5);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/vector/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          k,
          algo,
        }),
      });

      const data = await res.json();

      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="left-panel">

      <div className="panel-title">Search</div>

      <div className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>

      <button
        className="search-btn"
        onClick={search}
        disabled={loading}
      >
        {loading ? "Searching..." : "⚡ SEARCH"}
      </button>

      <div className="slider-section">
        <label>Top K : {k}</label>

        <input
          type="range"
          min="1"
          max="10"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      <div className="algo-section">
        <label>Algorithm</label>

        <div className="algo-buttons">
          {["hnsw", "kdtree", "bruteforce"].map((a) => (
            <button
              key={a}
              className={algo === a ? "algo active" : "algo"}
              onClick={() => setAlgo(a)}
            >
              {a.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}