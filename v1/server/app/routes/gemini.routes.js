const express = require("express");
const router = express.Router();
const geminiControllers = require("../controllers/gemini.controllers");

router.get("/generate", geminiControllers.generate);

module.exports = router;
