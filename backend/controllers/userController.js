const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// Makes the wristband (token) holding the user's id and role
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// What we are allowed to send back about a user (never the password)
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// REGISTER: save a new user with a hashed password
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, "Email is already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ success: true, token: generateToken(user), data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// LOGIN: check the credentials, then hand out a token
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    res.status(200).json({ success: true, token: generateToken(user), data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// PROFILE: any logged-in user (the "normal page")
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
};

// ALL USERS: Admin only (the "admin page")
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, getAllUsers };