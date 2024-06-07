const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res) => {
  const postId = req.params.id;
  const queryPostById = req.params.id !== undefined ? { _id: postId } : {};
  Post.find(queryPostById)
    .then((mongoosePosts) => {
      const tempPosts = mongoosePosts.map((post) => {
        return { ...post._doc, creator: { name: "Carlos" } };
      });

      console.log(tempPosts);

      res.status(200).json({
        message: "fetched successful!",
        posts: tempPosts,
      });
    })
    .catch((err) => console.log(err));
};

exports.getSinglePost = (req, res) => {
  const postId = req.params.id;
  console.log(postId);
};

exports.createPost = (req, res) => {
  const errors = validationResult(req);

  const postTitle = req.body.title;
  const postContent = req.body.content;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Check the details");
    error.statusCode = 422;

    throw error;
  }

  const post = new Post({
    title: postTitle,
    content: postContent,
    imageURL: "images/duck.jpg",
  });

  post
    .save()
    .then((post) => {
      // Create post in db
      return res.status(200).json({
        message: "Post created successfully!",
        post: { ...post },
      });
    })
    .catch((err) => {
      // error handling
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
