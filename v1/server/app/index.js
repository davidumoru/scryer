require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./configs/database");
const geminiRouter = require("./routes/gemini.routes");
const userRouter = require("./routes/user.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB(process.env.MONGO_URI);

app.use("/", geminiRouter);
app.use("/auth", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am running",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
