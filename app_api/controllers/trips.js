/**
 * @file    trips.js
 * @brief   This file contains the controller functions for handling trip-related operations.
 *
 * @details This file exports several functions that handle various operations related to trips,
 *          such as listing all trips, finding a trip by code, adding a new trip, and updating an
 *          existing trip. These functions interact with the 'trips' and 'users' models from the
 *          MongoDB database.
 */

const mongoose = require("mongoose");
const Trip = require("../models/travlr");
const Model = mongoose.model("trips");
const User = mongoose.model("users");

/**
 * @brief   Retrieves a list of all trips.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function retrieves a list of all trips from the database. It first executes a
 *          MongoDB query to find all documents in the 'trips' collection. If the query returns
 *          no data, it sends a 404 Not Found response with an error message. Otherwise, it sends
 *          a 200 OK response with the list of trips.
 */
const tripsList = async (req, res) => {
  // No filter, return all records
  const q = await Model.find({}).exec();

  if (!q) {
    // Database returned no data
    const err = new Error("No trips found");
    console.log(err);
    return res.status(404).json(err);
  } else {
    // Return resuling trip list
    return res.status(200).json(q);
  }
};

/**
 * @brief   Retrieves a single trip by its code.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function retrieves a single trip from the database based on the 'tripCode' parameter
 *          in the request URL. It executes a MongoDB query to find documents in the 'trips' collection
 *          where the 'code' field matches the provided 'tripCode'. If the query returns no data, it
 *          sends a 404 Not Found response with an error message. Otherwise, it sends a 200 OK response
 *          with the trip details.
 */
const tripsFindByCode = async (req, res) => {
  const q = await Model.find({ code: req.params.tripCode }).exec(); // No filter, return all records

  if (!q) {
    // Database returned no data
    const err = new Error("Trip not found");
    console.log(err);
    return res.status(404).json(err);
  } else {
    // Return resulting trip list
    return res.status(200).json(q);
  }
};

/**
 * @brief   Adds a new trip to the database.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function adds a new trip to the database based on the data provided in the request
 *          body. It first calls the `getUser` function to retrieve the user associated with the
 *          request. If the user is found, it creates a new 'Trip' document using the data from the
 *          request body and saves it to the database. If the operation is successful, it sends a
 *          200 OK response with the new trip details. If an error occurs, it sends an appropriate
 *          error response with a status code and error message.
 */
const tripsAddTrip = async (req, res) => {
  await getUser(req, res,
    (req, res) => {
      Trip
        .create({
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        })
        .then(trip => {
          if (!trip) {
            return res.status(404).send({ message: "Trip not found with code" + req.params.tripCode });
          }
          res.send(trip);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({ message: "Trip not found with code" + req.params.tripCode });
          }
          // server error
          return res.status(500).json(err);
        });
    }
  );
};

/**
 * @brief   Updates an existing trip in the database.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function updates an existing trip in the database based on the 'tripCode' parameter
 *          in the request URL and the data provided in the request body. It first calls the `getUser`
 *          function to retrieve the user associated with the request. If the user is found, it
 *          executes a MongoDB query to find and update the 'Trip' document where the 'code' field
 *          matches the provided 'tripCode'. If the operation is successful, it sends a 200 OK response
 *          with the updated trip details. If an error occurs, it sends an appropriate error response
 *          with a status code and error message.
 */
const tripsUpdateTrip = async (req, res) => {
  await getUser(req, res, (req, res) => {
    Trip.findOneAndUpdate({ code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true })
      .then(trip => {
        if (!trip) {
          return res.status(404).send({ message: "Trip not found with code" + req.params.tripCode });
        }
        res.send(trip);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({ message: "Trip not found with code" + req.params.tripCode });
        }
        return res.status(500).json(err); // server error
      });
  });
};

/**
 * @brief   Retrieves a user based on the email address in the request.
 *
 * @param {Object}    req The Express request object.
 * @param {Object}    res The Express response object.
 * @param {Function}  callback The callback function to be called with the user object.
 *
 * @details This function retrieves a user from the database based on the email address in the
 *          'req.auth.email' property of the request object. If the user is found, it calls the
 *          provided callback function with the request, response, and user name. If the user is
 *          not found, it sends a 404 Not Found response with an error message.
 */
const getUser = async (req, res, callback) => {
  if (req.auth && req.auth.email) {
    try {
      const user = await User.findOne({ email: req.auth.email }).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      callback(req, res, user.name);
    } catch (err) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
