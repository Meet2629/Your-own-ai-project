require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const vectorRoutes = require("./routes/vector.routes");
const docRoutes = require("./routes/doc.routes");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   MONGODB CONNECTION
====================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

/* ======================
   ROUTES
====================== */

// Vector routes (search / embeddings)
app.use("/api/vector", vectorRoutes);

// Document routes (docs + AI)
app.use("/api/doc", docRoutes);

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong on server"
  });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});