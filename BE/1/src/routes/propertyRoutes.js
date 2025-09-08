const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

router
  // get all properties (with optional query filters)
  .get("/", async (req, res) => {
    const { city, bedrooms, bathrooms, availableFrom, availableTo, guests } =
      req.query;

    let filters = {};
    if (city) filters.city = city;
    if (bedrooms) filters.bedrooms = bedrooms;
    if (bathrooms) filters.bathrooms = bathrooms;

    try {
      const properties = await Property.find(filters);
      res.json(properties);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  // get property by ID
  .get("/:id", async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(400).json({ message: "Invalid ID" });
    }
  });

module.exports = router;
