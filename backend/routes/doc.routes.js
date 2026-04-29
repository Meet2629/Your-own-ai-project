const express = require("express");
const router = express.Router();

const { embed, generate } = require("../services/ollama");
const Vector = require("../models/Vector");

const {
  insertIntoIndex,
  searchIndex,
  rebuildIndex
} = require("../services/hnsw");

/* =========================
   INIT INDEX
========================= */

let indexReady = false;

const initIndex = async () => {
  if (!indexReady) {

    console.log("🔄 Building HNSW index...");

    await rebuildIndex();

    indexReady = true;

    console.log("✅ Index ready");
  }
};

/* =========================
   INSERT VECTOR
========================= */

router.post("/insert", async (req, res) => {

  try {

    const { metadata, category, text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required"
      });
    }

    console.log("📥 Inserting text...");

    // Generate embedding
    const emb = await embed(text);

    if (!emb) {
      return res.status(500).json({
        message: "Embedding failed"
      });
    }

    // Save in MongoDB
    const doc = await Vector.create({
      metadata,
      category,
      text,
      vector: emb
    });

    // Insert into HNSW
    insertIntoIndex(doc);

    console.log("✅ Vector inserted");

    res.json({
      message: "Inserted successfully",
      id: doc._id
    });

  } catch (err) {

    console.error("❌ INSERT ERROR:", err);

    res.status(500).json({
      message: "Insert failed"
    });
  }
});

/* =========================
   SEARCH VECTOR
========================= */

router.post("/search", async (req, res) => {

  try {

    await initIndex();

    const { query, k = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Query is required"
      });
    }

    console.log("🔍 Searching:", query);

    // Generate query embedding
    const queryVector = await embed(query);

    if (!queryVector) {
      return res.status(500).json({
        message: "Query embedding failed"
      });
    }

    // Search
    const results = searchIndex(queryVector, k);

    res.json({
      results
    });

  } catch (err) {

    console.error("❌ SEARCH ERROR:", err);

    res.status(500).json({
      message: "Search failed"
    });
  }
});

/* =========================
   ASK AI (RAG)
========================= */

router.post("/ask", async (req, res) => {

  try {

    await initIndex();

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    console.log("❓ Question:", question);

    let prompt = "";

    // Embed question
    const queryVector = await embed(question);

    if (queryVector) {

      // Search relevant chunks
      const results = searchIndex(queryVector, 3);

      console.log("📚 Results:", results);

      // IF CONTEXT EXISTS
      if (results && results.length > 0) {

        const context = results
          .map(r => r.text)
          .join("\n");

        prompt = `
You are a helpful AI assistant.

Answer using ONLY the context below.

Context:
${context}

Question:
${question}
`;

      } else {

        // NO CONTEXT FOUND
        prompt = `
You are a helpful AI assistant.

Answer this question normally:

${question}
`;

      }

    } else {

      // EMBEDDING FAILED
      prompt = `
You are a helpful AI assistant.

Answer this question normally:

${question}
`;

    }

    console.log("🧠 Sending prompt to LLM...");

    // Generate response
    const answer = await generate(prompt);

    console.log("✅ AI response generated");

    res.json({
      answer
    });

  } catch (err) {

    console.error("❌ ASK ERROR:", err);

    res.status(500).json({
      message: "AI request failed"
    });
  }
});

module.exports = router;