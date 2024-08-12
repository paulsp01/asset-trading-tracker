// src/routes/marketplaceRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMarketplaceAssets,
} = require("../controllers/marketplaceController");

// Get assets on marketplace
router.get("/assets", getMarketplaceAssets);

module.exports = router;
