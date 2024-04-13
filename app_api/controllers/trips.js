const mongoose = require("mongoose");
const Trip = require("../models/travlr");
const Model = mongoose.model("trips");

// GET: /trips - list all the trips
// Regardless of the outcome, response must include HTML status code and JSON message tot he requesting client
const tripsList = async (req, res) => {
  const q = await Model.find({}).exec(); // No filter, return all records

  // Uncomment the following line to show query results
  // console.log(q);

  if (!q) {
    return res.status(404).json(err); // Database returned no data
  } else {
    return res.status(200).json(q); // Return resuling trip list
  }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of the outcome, response must include HTML status code and JSON message tot he requesting client
const tripsFindByCode = async (req, res) => {
  const q = await Model.find({ code: req.params.tripCode }).exec(); // No filter, return all records

  // Uncomment the following line to show query results
  // console.log(q);

  if (!q) {
    return res.status(404).json(err); // Database returned no data
  } else {
    return res.status(200).json(q); // Return resuling trip list
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
};
