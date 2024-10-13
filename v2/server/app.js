const express = require("express");
const webRoutes = require("./routes/webRoutes");
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", webRoutes);

module.exports = app;
