// src/controllers/marketplaceController.js
const Asset = require("../models/Asset");

exports.getMarketplaceAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ status: "published" }).populate(
      "currentHolder"
    );
    const response = assets.map((asset) => ({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      currentHolder: asset.currentHolder._id,
      price: asset.averageTradingPrice,
      proposals: asset.proposals,
    }));
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
