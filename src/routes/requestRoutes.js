// src/routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const {
  requestToBuyAsset,
  negotiateRequest,
  acceptRequest,
  denyRequest,
  getUserRequests,
} = require("../controllers/requestController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Request to buy an asset
router.post("/assets/:id/request", authenticateJWT, requestToBuyAsset);

// Negotiate purchase request
router.put("/requests/:id/negotiate", authenticateJWT, negotiateRequest);

// Accept purchase request
router.put("/requests/:id/accept", authenticateJWT, acceptRequest);

// Deny purchase request
router.put("/requests/:id/deny", authenticateJWT, denyRequest);

// Get user's purchase requests
router.get("/users/:id/requests", authenticateJWT, getUserRequests);

module.exports = router;
