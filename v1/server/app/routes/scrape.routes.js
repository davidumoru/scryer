const express = require("express");
const router = express.Router();
const scraperControllers = require("../controllers/scrape.controllers");

router.get("/scrape", scraperControllers.scrapePage);

module.exports = router;
