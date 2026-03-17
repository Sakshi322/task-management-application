const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

const protect = (req, res, next) => {
  // Read JWT from HTTP-only cookie
  const token = req.cookies?.token;

  if (!token) {
    return errorResponse(res, 401, "Not authenticated. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Session expired. Please log in again.");
    }
    return errorResponse(res, 401, "Invalid token. Please log in.");
  }
};

module.exports = { protect };