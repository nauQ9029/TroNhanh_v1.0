/*
___ NOTE: PLEASE READ ___
- node seed.js để import data vào mongo trước, thay đổi api url nếu cần
- node server.js
*/

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const propertyRoutes = require("./src/routes/propertyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" >>>[DEUBG] MongoDB connected"))
  .catch((err) => console.error(" >>>[DEUBG] MongoDB connection error:", err));

app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` >>>[DEUBG] Server started on port ${PORT}`)
);
