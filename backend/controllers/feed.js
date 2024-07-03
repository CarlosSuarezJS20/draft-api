const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

const NUMBER_OF_POSTS = 2;

exports.deletePost = (req, res, next) => {
  console.log("deleting");
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
        post: { ...mongoosePost[0]._doc },
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
      return Post.find()
        .populate("creator")
        .skip(skipPosts)
        .limit(NUMBER_OF_POSTS);
    })
    .then((mongoosePosts) => {
      const tempPosts = mongoosePosts.map((post) => {
        return { ...post._doc };
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
  // Validation
  const postTitle = req.body.title;
  const postContent = req.body.content;
  const errors = validationResult(req);
  let currentUser;
  let newPost;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Check the details");
    error.statusCode = 422;

    throw error;
  }

  User.findById(req.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        const error = new Error("Not user found");
        error.statusCode = 422;
      }

      const post = new Post({
        title: postTitle,
        content: postContent,
        imageURL: "images/duck.jpg",
        creator: user._id,
      });

      currentUser = user;

      return post.save();
    })
    .then((post) => {
      console.log(post);
      newPost = post;
      currentUser.posts.push(post._id);
      currentUser.save();
      // Create post in db
    })
    .then((result) => {
      console.log(newPost);
      return res.status(201).json({
        message: "Post created successfully!",
        post: {
          _id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          imageURL: newPost.imageURL,
          creator: { name: currentUser.name },
          createdAt: newPost.createdAt,
        },
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
