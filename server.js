require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

app.use(errorHandler);

app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
