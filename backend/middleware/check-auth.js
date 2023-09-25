const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // For certain http requests other than GET, the browser sends an OPTIONS request before the actual request to check if the server will permit/support the request
  if (req.method === "OPTIONS") {
    // Handling OPTIONS request
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer TOKEN" => authorization.split(" ")[1]: "TOKEN"
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
