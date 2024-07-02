const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authenticationHeader = req.get("Authorization");

  if (!authenticationHeader) {
    const err = new Error("Not authenticated");
    err.status = 401;
    throw err;
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret for app");
  } catch (err) {
    //picked up by middleware error
    err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    const err = new Error("Incorrect Token");
    err.status = 401;
    throw err;
  }

  req.userId = decodedToken.userId;
  next();
};
