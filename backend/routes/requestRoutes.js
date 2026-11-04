const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestController");

const {
  validateId,
  validateCreateRequest,
  validateUpdateRequest,
} = require("../middleware/validators");

const { protect, authorize } = require("../middleware/authMiddleware");

// Only Requesters and Hospitals can create requests.
// Hospital verification is checked separately in the controller.
router.post(
  "/",
  protect,
  authorize("Requester", "Hospital"),
  validateCreateRequest,
  createRequest
);

// Everyone can view blood requests.
router.get("/", getRequests);

router.get("/:id", validateId, getRequestById);

// Only logged-in users can modify requests.
// Ownership checks will be added in the controller.
router.put("/:id", protect, validateId, validateUpdateRequest, updateRequest);

router.delete("/:id", protect, validateId, deleteRequest);

module.exports = router;