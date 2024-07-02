const express = require("express");
const authMiddleware = require("../middleware/isAuth");

// validation
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

// Validators:
const createPostValidator = [
  body("title").trim().isLength(5).withMessage("The title is incorrect"),
  body("content").trim().isLength(5).withMessage("Review your content"),
];

router.get("/post/:id", authMiddleware, feedController.getPost);

// GET /feed/posts
router.get("/posts/:pageNumber?", authMiddleware, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  authMiddleware,
  createPostValidator,
  feedController.createPost
);

router.put(
  "/post/:id",
  authMiddleware,
  createPostValidator,
  feedController.updatePost
);

router.delete("/delete/post/:id", authMiddleware, feedController.deletePost);

module.exports = router;
