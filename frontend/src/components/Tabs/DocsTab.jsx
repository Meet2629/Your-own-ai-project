import { useState } from "react";

export default function DocsTab() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const insertDoc = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/vector/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Insert failed");
      }

      alert("✅ Document inserted");

      setTitle("");
      setText("");

    } catch (err) {
      console.error("Insert error:", err);
      alert("❌ Failed to insert document");
    }
  };

  return (
    <div className="tab-content">

      <h2 className="section-title">
        Insert Document
      </h2>

      <div className="form-group">

        <div className="search-box">
          <input
            placeholder="Document title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <textarea
          className="textarea"
          placeholder="Paste document text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="search-btn"
          onClick={insertDoc}
        >
          INSERT DOCUMENT
        </button>

      </div>

    </div>
  );
}