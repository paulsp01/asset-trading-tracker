
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


router.post("/assets/:id/request", authenticateJWT, requestToBuyAsset);


router.put("/requests/:id/negotiate", authenticateJWT, negotiateRequest);


router.put("/requests/:id/accept", authenticateJWT, acceptRequest);


router.put("/requests/:id/deny", authenticateJWT, denyRequest);


router.get("/users/:id/requests", authenticateJWT, getUserRequests);

module.exports = router;
