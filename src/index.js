const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const requestRoutes = require("./routes/requestRoutes");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", assetRoutes);
app.use("/api", marketplaceRoutes);
app.use("/api", requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
