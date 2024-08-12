// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middlewares/validators");

// User signup
router.post("/signup", validateSignup, signup);

// User login
router.post("/login", validateLogin, login);

module.exports = router;
