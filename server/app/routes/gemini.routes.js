const express = require("express");
const router = express.Router();
const geminiControllers = require("../controllers/gemini.controllers");

router.get("/analyse", geminiControllers.analyse);
router.get("/extract", geminiControllers.extract);
router.get("/filter", geminiControllers.filter);
router.get("/summarize", geminiControllers.summarize);

module.exports = router;
