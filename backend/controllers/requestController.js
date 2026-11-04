const Request = require("../models/Request");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const ALLOWED_FIELDS = [
  "hospitalName",
  "bloodGroup",
  "unitsNeeded",
  "urgency",
  "location",
  "status",
];

const pickAllowed = (body = {}) => {
  const data = {};

  ALLOWED_FIELDS.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// Check whether the logged-in user owns the request or is Admin
const checkOwnership = (request, user) => {
  if (user.role === "Admin") return true;

  return (
    request.createdBy &&
    request.createdBy.toString() === user._id.toString()
  );
};

// CREATE REQUEST
const createRequest = asyncHandler(async (req, res) => {
  if (req.user.role === "Hospital" && !req.user.isVerified) {
    throw new ApiError(
      403,
      "Your hospital account is awaiting verification."
    );
  }

  const request = await Request.create({
    ...pickAllowed(req.body),
    createdBy: req.user._id,
  });

  const io = req.app.get("io");

  if (io) {
    io.emit("newRequest", {
      _id: request._id,
      hospitalName: request.hospitalName,
      bloodGroup: request.bloodGroup,
      unitsNeeded: request.unitsNeeded,
      urgency: request.urgency,
      location: request.location,
    });
  }

  res.status(201).json({
    success: true,
    data: request,
  });
});

// GET ALL REQUESTS
const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// GET SINGLE REQUEST
const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  res.status(200).json({
    success: true,
    data: request,
  });
});

// UPDATE REQUEST
const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (!checkOwnership(request, req.user)) {
    throw new ApiError(403, "You cannot update this request.");
  }

  Object.assign(request, pickAllowed(req.body));

  await request.save();

  res.status(200).json({
    success: true,
    data: request,
  });
});

// DELETE REQUEST
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (!checkOwnership(request, req.user)) {
    throw new ApiError(403, "You cannot delete this request.");
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: "Request deleted successfully",
  });
});

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};