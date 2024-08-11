const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tradingJourney: [
    {
      holder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      price: { type: Number },
    },
  ],
  averageTradingPrice: { type: Number, default: 0 },
  lastTradingPrice: { type: Number, default: 0 },
  numberOfTransfers: { type: Number, default: 0 },
  proposals: { type: Number, default: 0 },
});

module.exports = mongoose.model("Asset", AssetSchema);
