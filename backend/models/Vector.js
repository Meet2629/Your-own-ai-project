const mongoose = require("mongoose");

const vectorSchema = new mongoose.Schema({
  documentId: mongoose.Schema.Types.ObjectId, // link to document
  text: String,   // chunk text (VERY IMPORTANT for RAG)
  vector: {
    type: [Number],
    required: true
  }
});

module.exports = mongoose.model("Vector", vectorSchema);