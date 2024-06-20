const express = require("express");

// validation
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.login);

module.exports = router;
