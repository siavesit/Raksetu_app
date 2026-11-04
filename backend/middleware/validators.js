const { body, param, validationResult } = require("express-validator");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["open", "fulfilled"];

// Runs after the rules: if anything failed, stop and reply with 400
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const idRule = param("id").isMongoId().withMessage("Invalid request ID");

const validateId = [idRule, handleValidationErrors];

// ---------- Blood requests ----------
const validateCreateRequest = [
  body("hospitalName")
    .isString().withMessage("Hospital name is required and must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Hospital name is required")
    .isLength({ max: 100 }).withMessage("Hospital name must be 100 characters or less"),
  body("bloodGroup")
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(", ")}`),
  body("unitsNeeded")
    .isInt({ min: 1, max: 20 }).withMessage("Units needed must be a whole number from 1 to 20")
    .toInt(),
  body("urgency")
    .optional()
    .isIn(URGENCY_LEVELS).withMessage(`Urgency must be one of: ${URGENCY_LEVELS.join(", ")}`),
  body("location")
    .isString().withMessage("Location is required and must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Location is required"),
  body("status")
    .optional()
    .isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(", ")}`),
  handleValidationErrors,
];

const validateUpdateRequest = [
  idRule,
  body("hospitalName")
    .optional()
    .isString().withMessage("Hospital name must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Hospital name cannot be empty")
    .isLength({ max: 100 }).withMessage("Hospital name must be 100 characters or less"),
  body("bloodGroup")
    .optional()
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(", ")}`),
  body("unitsNeeded")
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage("Units needed must be a whole number from 1 to 20")
    .toInt(),
  body("urgency")
    .optional()
    .isIn(URGENCY_LEVELS).withMessage(`Urgency must be one of: ${URGENCY_LEVELS.join(", ")}`),
  body("location")
    .optional()
    .isString().withMessage("Location must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Location cannot be empty"),
  body("status")
    .optional()
    .isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(", ")}`),
  handleValidationErrors,
];

// ---------- Users ----------
const validateRegister = [
  body("name")
    .isString().withMessage("Name is required and must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 60 }).withMessage("Name must be 60 characters or less"),
  body("email")
    .isString().withMessage("Email is required")
    .bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isString().withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 64 }).withMessage("Password must be 8 to 64 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
    body("role")
  .isIn(["Donor", "Requester", "Hospital"])
  .withMessage("Role must be Donor, Requester or Hospital"),
  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .isString().withMessage("Email is required")
    .bail()
    .trim()
    .toLowerCase()
    .isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isString().withMessage("Password is required")
    .bail()
    .notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

module.exports = {
  validateId,
  validateCreateRequest,
  validateUpdateRequest,
  validateRegister,
  validateLogin,
};