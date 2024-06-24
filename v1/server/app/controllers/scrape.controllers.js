const scraperServices = require("../services/scrape.services");

const scrapePage = async (req, res) => {
  try {
    const data = await scraperServices.signup(req.body);
    res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { scrapePage };
