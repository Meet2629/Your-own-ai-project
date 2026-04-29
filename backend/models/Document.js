const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  title: String,
  text: String
});

module.exports = mongoose.model("Document", docSchema);