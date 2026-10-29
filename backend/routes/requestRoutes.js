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

router.post("/", validateCreateRequest, createRequest);
router.get("/", getRequests);
router.get("/:id", validateId, getRequestById);
router.put("/:id", validateUpdateRequest, updateRequest);
router.delete("/:id", validateId, deleteRequest);

module.exports = router;