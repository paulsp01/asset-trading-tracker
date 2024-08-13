
const express = require("express");
const router = express.Router();
const {
  getMarketplaceAssets,
} = require("../controllers/marketplaceController");


router.get("/assets", getMarketplaceAssets);

module.exports = router;
