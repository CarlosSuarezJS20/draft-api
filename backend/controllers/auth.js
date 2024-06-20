const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signup = (req, res, next) => {};

exports.login = (req, res, next) => {
  console.log("logged");
  req.session.isLoggedIn = true;
};
