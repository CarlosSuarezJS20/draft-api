const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.updateStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      user.status = req.body.status;
      return user.save();
    })
    .then((response) => {
      res.status(200).json({
        message: "Updated status",
        response: response,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStatus = (req, res, next) => {
  console.log(req.userId);
  User.findById(req.userId)
    .then((user) => {
      console.log(user.status);
      res.status(200).json({
        message: "Here is user status",
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signup = (req, res, next) => {
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
        throw error;
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "secret for app",
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "user found!!",
        userId: user._id,
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
