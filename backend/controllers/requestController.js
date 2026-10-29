const Request = require("../models/Request");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const ALLOWED_FIELDS = ["hospitalName", "bloodGroup", "unitsNeeded", "urgency", "location", "status"];

const pickAllowed = (body = {}) => {
  const data = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

const createRequest = asyncHandler(async (req, res) => {
  const request = await Request.create(pickAllowed(req.body));

  // Live alert: tell every connected browser about the new request
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

  res.status(201).json({ success: true, data: request });
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: requests.length, data: requests });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) throw new ApiError(404, "Request not found");
  res.status(200).json({ success: true, data: request });
});

const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, pickAllowed(req.body), {
    new: true,
    runValidators: true,
  });
  if (!request) throw new ApiError(404, "Request not found");
  res.status(200).json({ success: true, data: request });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request) throw new ApiError(404, "Request not found");
  res.status(200).json({ success: true, message: "Request deleted successfully" });
});

module.exports = { createRequest, getRequests, getRequestById, updateRequest, deleteRequest };