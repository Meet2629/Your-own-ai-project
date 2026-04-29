// services/bruteforce.js
const { cosine } = require("./distance");

function knn(items, query, k) {
  return items
    .map(v => ({
      id: v._id,
      metadata: v.metadata,
      distance: cosine(query, v.embedding)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}

module.exports = { knn };