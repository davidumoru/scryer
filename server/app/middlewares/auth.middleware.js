const jwt = require("jsonwebtoken");
require("dotenv").config();

const response = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return response.buildFailureResponse("No token provided", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return response.buildFailureResponse("Invalid token", 403);
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = authMiddleware;
