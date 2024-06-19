const { validationResult } = require("express-validator");
const Post = require("../models/post");

const NUMBER_OF_POSTS = 2;

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId })
    .then((resData) => {
      console.log(resData);
      res.status(200).json({
        message: "Post deleted succefully!",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.id;
  Post.find({ _id: postId })
    .then((mongoosePost) => {
      if (!mongoosePost.length === 0) {
        const error = new Error("Post not Found :(!");
        error.statusCode = 404;

        throw error;
      }

      res.status(200).json({
        message: "fetched successful!",
        post: { ...mongoosePost[0]._doc, creator: { name: "Carlos" } },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  let totalPosts;
  const skipPosts = (req.params.pageNumber - 1) * NUMBER_OF_POSTS;

  Post.countDocuments()
    .then((total) => {
      totalPosts = total;
      return Post.find().skip(skipPosts).limit(NUMBER_OF_POSTS);
    })
    .then((mongoosePosts) => {
      if (mongoosePosts.length === 0) {
        const error = new Error("Post not Found :(!");
        error.statusCode = 404;

        throw error;
      }
      const tempPosts = mongoosePosts.map((post) => {
        return { ...post._doc, creator: { name: "Carlos" } };
      });

      res.status(200).json({
        message: "fetched successful!",
        posts: tempPosts,
        _totalPosts: totalPosts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
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
      return res.status(201).json({
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  const postTitle = req.body.title;
  const postContent = req.body.content;
  const postFilter = { _id: req.params.id };

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Check the details");
    error.statusCode = 422;

    throw error;
  }

  Post.findById(postFilter)
    .then((post) => {
      post.title = postTitle;
      post.content = postContent;

      return post.save();
    })
    .then((post) => {
      return res.status(200).json({
        message: "Post updated successfully!",
        post: { ...post },
      });
    })
    .catch((err) => {
      // error handling
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // middleware error handling
    });
};
