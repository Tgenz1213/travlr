/**
 * @file    passport.js
 * @brief   This file configures the Passport.js authentication middleware for the application.
 *
 * @details Passport.js is a middleware for Node.js that provides authentication strategies
 *          for various authentication methods, including local authentication (username and password).
 *          This file sets up the local authentication strategy using the 'passport-local' module
 *          and the 'users' model from the MongoDB database.
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

/**
 * @brief                   Configures the local authentication strategy for Passport.js.
 *
 * @details                 This function sets up the local authentication strategy using the 'passport-local' module.
 *                          It specifies that the 'email' field should be used as the username field for authentication.
 *                          The strategy function finds a user in the database based on the provided email address,
 *                          verifies the password, and returns the user object if the credentials are valid.
 *
 * @param {string} username The email address of the user attempting to authenticate.
 * @param {string} password The password provided by the user.
 * @param {function} done   The callback function to be called with the result of the authentication attempt.
 *                          The first argument is an error object (if any), the second argument is the
 *                          authenticated user object (if successful), and the third argument is an optional
 *                          info object containing additional information.
 */
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
