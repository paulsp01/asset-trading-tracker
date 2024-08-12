// src/routes/assetRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAsset,
  updateAsset,
  publishAsset,
  getAssetDetails,
  getUserAssets,
} = require("../controllers/assetController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Create asset (save as draft)
router.post("/", authenticateJWT, createAsset);

// Update asset
router.post("/:id", authenticateJWT, updateAsset);

// List asset on marketplace
router.put("/:id/publish", authenticateJWT, publishAsset);

// Get asset details
router.get("/:id", getAssetDetails);

// Get user's assets
router.get("/users/:id/assets", authenticateJWT, getUserAssets);

module.exports = router;
