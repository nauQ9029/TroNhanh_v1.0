const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

// CRUD
app.get("/", (req, res) => {
  res.send("welcome to riel-time message app APIs");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" >>>[INFO] mongoDB connection establised"))
  .catch((err) =>
    console.log(" >>>[INFO] mongoDB connection fail: ", err.message)
  );

app.listen(port, (req, res) => {
  console.log(" >>>[INFO] server is running on port:", port);
});
