// purpose: seed data from properties.json directly into mongoDB
/*
___ NOTE: PLEASE READ ___
- node seed.js để import data vào mongo trước, thay đổi api url nếu cần
- node server.js
*/

const mongoose = require("mongoose");
const Property = require("../models/Property");
const propertyData = require("./properties.json");

mongoose
  .connect("mongodb://localhost:27017/tro-nhanh", {
    // change DB name if needed
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Property.deleteMany({});
    await Property.insertMany(propertyData); // an array of objects
    console.log(" >>>[DEBUG] Seeding successful");
    process.exit(0);
  })
  .catch((err) => {
    console.error(" >>>[DEBUG] Seeding error:", err);
    process.exit(1);
  });
