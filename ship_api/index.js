const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const shipRoute = require("./routes/ship");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("database connection successful"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/ship", shipRoute);

app.listen(5000, () => {
  console.log("server is running");
});
