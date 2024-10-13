const express = require("express");
const cors = require("cors");
const webRoutes = require("./routes/webRoutes");
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "https://scryer.vercel.app"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// Routes
app.use("/api", webRoutes);

module.exports = app;
