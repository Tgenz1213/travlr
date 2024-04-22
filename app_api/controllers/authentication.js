/**
 * @file    authentication.js
 * @brief   This file contains the authentication routes and handlers for user registration and login.
 *
 * @details This file exports two functions, `register` and `login`, which handle user registration
 *          and login requests, respectively. The functions use the Passport.js middleware for
 *          authentication and the 'users' model from the MongoDB database.
 */

const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");

/**
 * @brief   Handles user registration requests.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function handles user registration requests. It first validates that all required
 *          fields (name, email, and password) are present in the request body. If any field is
 *          missing, it returns a 400 Bad Request response with an error message.
 *
 *          If all required fields are present, it creates a new User object, sets the name, email,
 *          and password (using the `setPassword` method), and generates a JSON Web Token (JWT) using
 *          the `generateJwt` method.
 *
 *          The function then attempts to save the new user to the database using the `save` method.
 *          If the save operation is successful, it returns a 200 OK response with the generated JWT.
 *          If an error occurs during the save operation, it logs the error to the console and returns
 *          a 400 Bad Request response with the error object.
 */
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  const token = user.generateJwt();

  try {
    await user.save();
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

/**
 * @brief Handles user login requests.
 *
 * @param {Object} req The Express request object.
 * @param {Object} res The Express response object.
 *
 * @details This function handles user login requests. It first validates that both the email and
 *          password fields are present in the request body. If either field is missing, it returns
 *          a 400 Bad Request response with an error message.
 *
 *          If both fields are present, it uses the Passport.js `authenticate` method with the 'local'
 *          strategy to authenticate the user. The authentication callback function is called with
 *          an error object (if any), the authenticated user object (if successful), and an info object
 *          containing additional information.
 *
 *          If an error occurs during the authentication process, it logs the error to the console and
 *          returns a 404 Not Found response with the error object.
 *
 *          If the authentication is successful (i.e., the user object is not null), it generates a
 *          JSON Web Token (JWT) using the `generateJwt` method and returns a 200 OK response with the
 *          generated JWT.
 *
 *          If the authentication fails (i.e., the user object is null), it logs the info object to the
 *          console and returns a 401 Unauthorized response with the info object.
 */
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(404).json(err);
    }

    if (user) {
      const token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      console.log(info);
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports = {
  register,
  login
};
