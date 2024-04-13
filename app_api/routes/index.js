const express = require("express");
const router = express.Router(); // Router logic

const tripsController = require("../controllers/trips");

// Define endpoint route
router.route("/trips").get(tripsController.tripsList); // GET Method routes tripsList

router.route("/trips/:tripCode").get(tripsController.tripsFindByCode); // GET Method tripsFindByCode - requires parameter

module.exports = router;
