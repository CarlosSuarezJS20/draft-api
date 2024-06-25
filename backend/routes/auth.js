const express = require("express");

// validation
const { body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

const emailSignUpVal = () => [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("e-mail already exists!");
      }
    })
    .normalizeEmail({
      all_lowercase: true,
      gmail_lowercase: true,
      outlookdotcom_lowercase: true,
    })
    .trim(),
  body("password")
    .isLength(5)
    .withMessage("Password must be at least 5 characters long"),
  body("name").trim().not().isEmpty(),
];

const emailLogin = () => [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        const err = new Error("e-mail does not exists!");
        throw err;
      }
    })
    .normalizeEmail({
      all_lowercase: true,
      gmail_lowercase: true,
      outlookdotcom_lowercase: true,
    })
    .trim(),
  body("password")
    .isLength(5)
    .withMessage("Password must be at least 5 characters long"),
];

router.put("/signup", emailSignUpVal(), authController.signup);

router.post("/login", emailLogin(), authController.login);

module.exports = router;
