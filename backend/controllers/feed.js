exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "dummy_id_1",
        title: "First Post",
        content: "This is the first post!",
        creator: { name: "Carlos" },
        imageURL: "images/duck.jpg",
        createdAt: new Date(),
      },
      {
        _id: "dummy_id_2",
        title: "Second Post",
        content: "This is the Second post!",
        creator: { name: "Carlos" },
        imageURL: "images/duck.jpg",
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  let imageURL;
  console.log(req);

  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: `${new Date() + title}`,
      creator: {
        name: "Carlos",
      },
      title: title,
      content: content,
      createdAt: new Date(),
    },
  });
};
