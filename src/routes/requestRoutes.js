// src/routes/requestRoutes.js
const express = require("express");
const { createRequest } = require("../controllers/requestController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/assets/:id/request", authMiddleware, createRequest);

module.exports = router;
