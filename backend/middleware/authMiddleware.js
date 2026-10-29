const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Guard 1: protect. Checks the token ("who are you?")
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Not authorized, token invalid or expired");
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, "Not authorized, user no longer exists");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Guard 2: authorize. Checks the role ("what may you open?")
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "Access denied: your role cannot use this route"));
  }
  next();
};

module.exports = { protect, authorize };