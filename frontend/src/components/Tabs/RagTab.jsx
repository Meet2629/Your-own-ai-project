import { useState } from "react";

export default function RagTab() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      console.log("🚀 Sending request...");

      const res = await fetch("http://127.0.0.1:8080/api/doc/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      // ❗ handle non-200 responses
      if (!res.ok) {
        throw new Error(text || "Server error");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from backend");
      }

      setAnswer(data.answer || "No response from AI");

    } catch (err) {
      console.log("❌ ERROR:", err.message);
      setAnswer("❌ Backend not reachable or API error");
    }

    setLoading(false);
  };

  return (
    <div className="tab-content">

      <h2 className="section-title">
        Ask AI
      </h2>

      <div className="form-group">

        <textarea
          className="textarea"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          className="search-btn"
          onClick={askAI}
          disabled={loading}
        >
          {loading ? "Thinking..." : "ASK AI"}
        </button>

      </div>

      {answer && (
        <div className="ai-card">

          <div className="ai-label">
            AI RESPONSE
          </div>

          <p className="ai-answer">
            {answer}
          </p>

        </div>
      )}

    </div>
  );
}