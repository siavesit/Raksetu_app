const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server error";
  
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors).map((e) => e.message).join(", ");
    }
  
    if (err.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
  
    if (err.code === 11000) {
      statusCode = 409;
      message = "That value is already in use";
    }
  
    if (err.type === "entity.parse.failed") {
      statusCode = 400;
      message = "Invalid JSON in request body";
    }
  
    if (statusCode === 500) {
      console.error(err);
      message = "Internal server error";
    }
  
    res.status(statusCode).json({ success: false, message });
  };
  
  module.exports = { notFound, errorHandler };