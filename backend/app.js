const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const { databaseUrl } = require("../backend/util/database");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const dbConnection = mongoose.connection;

const app = express();

dbConnection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
dbConnection.once("open", () => {
  console.log("Connected to MongoDB");
  mongoStore.on("connected", () => {
    console.log("MongoDBStore connected");
  });
  mongoStore.on("error", (error) => {
    console.error("MongoDBStore error", error);
  });
});

const mongoStore = new MongoDBStore({
  uri: databaseUrl,
  collection: "sessions",
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // React app URL
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000", // React app URL
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: "new secret",
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

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
    console.log(err);
  });
