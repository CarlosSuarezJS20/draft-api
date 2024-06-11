const express = require("express");

// validation
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

// Validators:
const createPostValidator = [
  body("title").trim().isLength(5).withMessage("The title is incorrect"),
  body("content").trim().isLength(5).withMessage("Review your content"),
];

// GET /feed/posts
router.get("/posts/:id?", feedController.getPosts);

// POST /feed/post
router.post("/post", createPostValidator, feedController.createPost);

router.put("/post/:id", createPostValidator, feedController.updatePost);

module.exports = router;
