const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, getAllUsers } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validators");

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Any logged-in user can open this (normal page)
router.get("/profile", protect, getProfile);

// Only an Admin can open this (admin page)
router.get("/", protect, authorize("Admin"), getAllUsers);

module.exports = router;