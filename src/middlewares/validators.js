// src/middlewares/validators.js
const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  body("username").isString().notEmpty(),
  body("password").isString().isLength({ min: 6 }),
  body("email").isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateLogin = [
  body("username").isString().notEmpty(),
  body("password").isString().isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
