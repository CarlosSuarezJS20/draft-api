const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  console.log(req.body);
  if (!validationResult(req).isEmpty()) {
    const error = new Error("Validation failed. Check the details");
    error.statusCode = 422;
    error.data = validationResult(req).array();
    throw error;
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    posts: [],
  });

  user
    .save()
    .then((response) => {
      console.log(response);
      return res.status(201).json({
        message: "user has been created!!",
        userId: response._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  console.log(req.body);
  if (!validationResult(req).isEmpty()) {
    const error = new Error("Email not found");
    error.statusCode = 422;
    error.data = validationResult(req).array();
    throw error;
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (req.body.password !== user.password) {
        const error = new Error("incorrect Password!");
        error.statusCode = 422;
      }

      return res.status(201).json({
        message: "user found!!",
        userId: user._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
