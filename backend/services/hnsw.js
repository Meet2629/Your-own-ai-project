const Vector = require("../models/Vector");

class HNSW {
  constructor(M = 16, efBuild = 200) {
    this.M = M;
    this.M0 = 2 * M;
    this.efBuild = efBuild;
    this.mL = 1 / Math.log(M);

    this.graph = new Map();
    this.entryPoint = null;
    this.topLayer = -1;
  }

  reset() {
    this.graph = new Map();
    this.entryPoint = null;
    this.topLayer = -1;
  }

  cosine(a, b) {
    if (!a || !b || a.length !== b.length) return 1;

    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }

    if (na === 0 || nb === 0) return 1;

    return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  randomLevel() {
    let r = Math.random();
    if (r === 0) r = 1e-10;
    return Math.floor(-Math.log(r) * this.mL);
  }

  insert(item) {
    if (!item._id || !item.vector) return;

    const id = item._id.toString();
    if (this.graph.has(id)) return;

    const level = this.randomLevel();

    const node = {
      id,
      vector: item.vector,
      text: item.text || "",
      maxLevel: level,
      neighbors: Array.from({ length: level + 1 }, () => [])
    };

    this.graph.set(id, node);

    if (!this.entryPoint) {
      this.entryPoint = id;
      this.topLayer = level;
      return;
    }

    let ep = this.entryPoint;

    for (let l = this.topLayer; l > level; l--) {
      const res = this.searchLayer(item.vector, ep, 1, l);
      if (res.length) ep = res[0].id;
    }

    for (let l = Math.min(this.topLayer, level); l >= 0; l--) {
      let neighbors = this.searchLayer(item.vector, ep, this.efBuild, l);
      neighbors = neighbors.slice(0, l === 0 ? this.M0 : this.M);

      node.neighbors[l] = neighbors.map(n => n.id);

      for (let n of neighbors) {
        const neighborNode = this.graph.get(n.id);
        if (!neighborNode) continue;

        if (!neighborNode.neighbors[l]) {
          neighborNode.neighbors[l] = [];
        }

        if (!neighborNode.neighbors[l].includes(id)) {
          neighborNode.neighbors[l].push(id);
        }
      }

      if (neighbors.length) ep = neighbors[0].id;
    }

    if (level > this.topLayer) {
      this.topLayer = level;
      this.entryPoint = id;
    }
  }

  searchLayer(query, entryId, ef, level) {
    const visited = new Set();
    const candidates = [];
    const results = [];

    const entryNode = this.graph.get(entryId);
    if (!entryNode) return [];

    const dist = this.cosine(query, entryNode.vector);

    candidates.push({ id: entryId, dist });
    results.push({ id: entryId, dist });
    visited.add(entryId);

    while (candidates.length) {
      candidates.sort((a, b) => a.dist - b.dist);
      const curr = candidates.shift();

      const worst = results[results.length - 1];
      if (results.length >= ef && curr.dist > worst.dist) break;

      const node = this.graph.get(curr.id);
      if (!node || !node.neighbors[level]) continue;

      for (let nid of node.neighbors[level]) {
        if (visited.has(nid)) continue;
        visited.add(nid);

        const neighbor = this.graph.get(nid);
        if (!neighbor) continue;

        const d = this.cosine(query, neighbor.vector);

        if (results.length < ef || d < worst.dist) {
          candidates.push({ id: nid, dist: d });
          results.push({ id: nid, dist: d });

          if (results.length > ef) {
            results.sort((a, b) => a.dist - b.dist);
            results.pop();
          }
        }
      }
    }

    return results.sort((a, b) => a.dist - b.dist);
  }

  search(query, k = 5, ef = 50) {
    if (!this.entryPoint) return [];

    let ep = this.entryPoint;

    for (let l = this.topLayer; l > 0; l--) {
      const res = this.searchLayer(query, ep, 1, l);
      if (res.length) ep = res[0].id;
    }

    const results = this.searchLayer(query, ep, Math.max(ef, k), 0);

    return results.slice(0, k).map(r => {
      const node = this.graph.get(r.id);
      return {
        id: r.id,
        dist: r.dist,
        text: node?.text || ""
      };
    });
  }
}

// ✅ SINGLE INSTANCE
const hnsw = new HNSW();
let isBuilt = false;

// ✅ INSERT
function insertIntoIndex(doc) {
  if (!doc || !doc.vector) return;
  hnsw.insert(doc);
}

// ✅ REBUILD
async function rebuildIndex() {
  console.log("🔄 Rebuilding index...");

  hnsw.reset();

  const items = await Vector.find();

  items.forEach(item => {
    if (item.vector) hnsw.insert(item);
  });

  isBuilt = true;

  console.log("✅ Index rebuilt:", items.length);
}

// ✅ SEARCH
function searchIndex(queryVector, k = 5) {
  if (!isBuilt) {
    console.log("⚠️ Index not built yet");
    return [];
  }

  return hnsw.search(queryVector, k);
}

module.exports = {
  insertIntoIndex,
  rebuildIndex,
  searchIndex
};