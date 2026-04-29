    // services/vectorService.js

const HNSW = require("./hnsw");
const Vector = require("../models/Vector");

const hnsw = new HNSW();

// Load data from DB into HNSW
async function loadIndex() {
  const items = await Vector.find();

  items.forEach(item => hnsw.insert(item));
}

// Search function
async function search(queryVector, k = 5) {
  const results = hnsw.search(queryVector, k);
  return results;
}

module.exports = {
  loadIndex,
  search
};