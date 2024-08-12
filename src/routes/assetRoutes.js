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



router.get("/test-header", (req, res) => {
  res.json({ headers: req.headers });
});

router.post("/assets", authenticateJWT, createAsset);

// Update asset
router.post("/assets/:id", authenticateJWT, updateAsset);

// List asset on marketplace
router.put("/assets/:id/publish", authenticateJWT, publishAsset);

// Get asset details
router.get("/assets/:id", getAssetDetails);

// Get user's assets
router.get("/users/:id/assets", authenticateJWT, getUserAssets);


module.exports = router;
