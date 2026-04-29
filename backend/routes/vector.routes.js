const express = require("express");
const router = express.Router();

const { embed } = require("../services/ollama");
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
    console.log("🔄 Building index...");
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
      return res.status(400).json({ message: "Text required" });
    }

    const emb = await embed(text);

    if (!emb) {
      return res.status(500).json({
        message: "Embedding failed"
      });
    }

    const doc = await Vector.create({
      metadata,
      category,
      text,
      vector: emb
    });

    insertIntoIndex(doc);

    res.json({
      message: "Inserted successfully",
      id: doc._id
    });

  } catch (err) {
    console.error("❌ INSERT ERROR:", err);
    res.status(500).json({ message: "Insert failed" });
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
      return res.status(400).json({ message: "Query required" });
    }

    const queryVector = await embed(query);

    if (!queryVector) {
      return res.status(500).json({
        message: "Query embedding failed"
      });
    }

    const results = searchIndex(queryVector, k);

    res.json({ results });

  } catch (err) {
    console.error("❌ SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* =========================
   GET ALL CONTEXT DOCS
========================= */
router.get("/all", async (req, res) => {
  try {
    const docs = await Vector.find({}, { vector: 0 }); 
    // exclude heavy embedding array

    res.json({
      docs
    });

  } catch (err) {
    console.error("❌ FETCH ALL ERROR:", err);
    res.status(500).json({
      docs: []
    });
  }
});

module.exports = router;