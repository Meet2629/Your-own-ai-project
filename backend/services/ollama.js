const axios = require("axios");

const OLLAMA_URL = "http://127.0.0.1:11434";

/* =========================
   EMBEDDING
========================= */

async function embed(text) {

  try {

    const res = await axios.post(
      `${OLLAMA_URL}/api/embeddings`,
      {
        model: "nomic-embed-text",
        prompt: text
      },
      {
        timeout: 60000
      }
    );

    // Validate embedding
    if (
      !res.data ||
      !res.data.embedding ||
      !Array.isArray(res.data.embedding) ||
      res.data.embedding.length === 0
    ) {
      throw new Error("Empty embedding returned");
    }

    return res.data.embedding;

  } catch (err) {

    console.error(
      "❌ EMBEDDING ERROR:",
      err.response?.data || err.message
    );

    return null;
  }
}

/* =========================
   GENERATION
========================= */

async function generate(prompt) {

  try {

    console.log("🧠 Sending prompt to Ollama...");

    const res = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: "llama3:latest",

        prompt: prompt,

        stream: false,

        options: {
          temperature: 0.3,
          num_predict: 200
        }
      },
      {
        timeout: 300000
      }
    );

    // Validate response
    if (!res.data || !res.data.response) {
      throw new Error("Empty response from model");
    }

    console.log("✅ LLM response received");

    return res.data.response;

  } catch (err) {

    console.error(
      "❌ GENERATION ERROR:",
      err.response?.data || err.message
    );

    return "Sorry, the AI could not generate a response.";
  }
}

module.exports = {
  embed,
  generate
};