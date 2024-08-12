// src/middlewares/authMiddleware.js
require("dotenv").config();

const jwt = require("jsonwebtoken");
const  JWT_SECRET  = process.env.JWT_SECRET;



// exports.authenticateJWT = (req, res, next) => {
    
//   const token = req.headers["authorization"]?.split(" ")[1];
//   console.log("Token received:", token);
//   if (!token) return res.status(403).json({ message: "Access denied" });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = user;
//     next();
//   });
// };

exports.authenticateJWT = (req, res, next) => {
  // Get the token from the 'Authorization' header

  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // Debugging log

  // Extract token from 'Bearer <token>'
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;
  console.log("Token received:", token); // Debugging log

  if (!token) return res.status(403).json({ message: "Access denied" });

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err); // Debugging log
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
