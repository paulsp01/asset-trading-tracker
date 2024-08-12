const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
connectDB();

//app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/", assetRoutes);
app.use("/", marketplaceRoutes);
app.use("/", requestRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
