/**
 * @file    user.js
 * @brief   This file defines the Mongoose schema for the 'users' collection.
 *
 * @details This file exports a Mongoose model for the 'users' collection, which represents user
 *          data in the application. The model includes fields for email, name, password hash,
 *          and salt. It also defines methods for setting and validating passwords, as well as
 *          generating JSON Web Tokens (JWT) for authentication purposes.
 */

const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");

/**
 * @brief   Defines the Mongoose schema for the 'users' collection.
 *
 * @details The userSchema defines the structure and validation rules for user documents in the
 *          'users' collection. It includes fields for email, name, password hash, and salt.
 *          The email field is required, unique, and must be a valid email address. The name
 *          field is required and has a maximum length of 50 characters.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Name must be less than 50 characters"]
  },
  hash: String,
  salt: String
});

/**
 * @brief   Pre-save hook to sanitize and standardize user input.
 *
 * @details This pre-save hook is executed before saving a user document to the database.
 *          It normalizes the email address to a canonical form and escapes HTML entities
 *          in the name field to prevent potential security vulnerabilities.
 *
 * @param {Function} next The callback function to be called after the pre-save hook is executed.
 */
userSchema.pre("save", function (next) {
  this.email = validator.normalizeEmail(this.email, { all_lowercase: true });
  this.name = validator.escape(this.name.trim());

  next();
});

/**
 * @brief Sets the password for a user document.
 *
 * @details This method generates a random salt and hashes the provided password using the
 *          PBKDF2 algorithm with 100,000 iterations and the SHA-512 hash function. The
 *          resulting hash and salt are stored in the user document.
 *
 * @param {string} password The plaintext password to be hashed.
 */
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, "sha512").toString("hex");
};

/**
 * @brief Validates a provided password against the stored hash and salt.
 *
 * @details This method hashes the provided password using the stored salt and compares
 *          the resulting hash with the stored hash in the user document. It returns
 *          true if the hashes match, indicating a valid password, and false otherwise.
 *
 * @param {string} password The plaintext password to be validated.
 * @returns {boolean} True if the provided password is valid, false otherwise.
 */
userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 100000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

/**
 * @brief Generates a JSON Web Token (JWT) for the user.
 *
 * @details This method generates a JSON Web Token (JWT) for the user, which can be used
 *          for authentication and authorization purposes. The JWT payload includes the
 *          user's ID, email, name, and an expiration time set to 7 days from the current
 *          date. The JWT is signed using a secret key stored in the environment variable
 *          'JWT_SECRET'.
 *
 * @returns {string} The generated JSON Web Token (JWT).
 */
userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000, 10)
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("users", userSchema);
