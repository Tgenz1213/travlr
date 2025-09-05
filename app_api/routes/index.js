/**
 * @file    index.js
 * @brief   This file defines the routes for the application.
 *
 * @details This file sets up the Express router and defines the routes for various endpoints
 *          in the application. It imports the necessary controllers and middleware functions
 *          to handle the routes. The routes include authentication (login and registration),
 *          listing trips, adding new trips, finding trips by code, and updating trips.
 */

const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");

const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"]
});

const authController = require("../controllers/authentication");
const tripsController = require("../controllers/trips");

/**
 * @brief   Route for user login.
 *
 * @details This route handles user login requests. It maps the '/login' endpoint to the
 *          'login' function in the 'authController'.
 *
 * @route   POST /login
 * @access  public
 */
router.route("/login").post(authController.login);

/**
 * @brief   Route for user registration.
 *
 * @details This route handles user registration requests. It maps the '/register' endpoint
 *          to the 'register' function in the 'authController'.
 *
 * @route   POST /register
 * @access  public
 */
router.route("/register").post(authController.register);

/**
 * @brief   Routes for trip operations.
 *
 * @details These routes handle various operations related to trips, such as listing all trips,
 *          adding a new trip, finding a trip by code, and updating an existing trip.
 *
 * @route   GET   /trips
 * @route   POST  /trips
 * @route   GET   /trips/:tripCode
 * @route   PUT   /trips/:tripCode
 * @access  private (requires authentication)
 */
router
  .route("/trips")
  .get(tripsController.tripsList) // GET Method routes tripsList
  .post(auth, tripsController.tripsAddTrip); // POST Method routes addTrip

router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode) // GET Method tripsFindByCode - requires parameter
  .put(auth, tripsController.tripsUpdateTrip); // PUT Method tripsUpdateTrip - requires parameter

module.exports = router;
