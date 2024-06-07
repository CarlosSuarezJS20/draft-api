const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
const { databaseUrl } = require("../backend/util/database");
const path = require("path");

const dbConnection = mongoose.connection;

dbConnection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
dbConnection.once("open", () => {
  console.log("Connected to MongoDB");
});

// URI from MongoDB

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

// error middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(databaseUrl)
  .then(() => {
    app.listen(8080, () => {
      console.log("connected to mongoose");
    });
  })
  .catch((err) => {
    console.dir;
    console.log(err);
  });
