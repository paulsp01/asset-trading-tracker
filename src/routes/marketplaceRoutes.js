// src/routes/marketplaceRoutes.js
const express = require("express");
const {
  getAssetsOnMarketplace,
} = require("../controllers/marketplaceController");
const router = express.Router();

router.get("/marketplace", getAssetsOnMarketplace);

module.exports = router;
