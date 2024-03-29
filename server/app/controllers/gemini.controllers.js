const geminiService = require("../services/gemini.services");

const analyse = async (req, res) => {
  try {
    const jsonData = await geminiService.analyse();
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const extract = async (req, res) => {
  try {
    const jsonData = await geminiService.extract();
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const filter = async (req, res) => {
  try {
    const jsonData = await geminiService.filter();
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const summarize = async (req, res) => {
  try {
    const jsonData = await geminiService.summarize();
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

module.exports = { analyse, extract, filter, summarize };
