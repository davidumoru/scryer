/* 
const { crawlPage } = require("./crawl/crawl");
const { printReport } = require("./report/report");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many arguments provided");
    process.exit(1);
  }
  const baseURL = process.argv[2];

  console.log(`starting crawl of ${baseURL}`);
  const pages = await crawlPage(baseURL, baseURL, {});

  printReport(pages);
}

main();

*/

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const geminiRouter = require("./routes/gemini.routes");

app.use("/", geminiRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am running",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
