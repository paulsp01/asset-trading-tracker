// src/routes/assetRoutes.js
const express = require("express");
const { createAsset } = require("../controllers/assetController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/assets", authMiddleware, createAsset);

module.exports = router;
