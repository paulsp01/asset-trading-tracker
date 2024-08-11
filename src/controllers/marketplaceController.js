const Asset = require("../models/Asset");

exports.getAssetsOnMarketplace = async (req, res) => {
  try {
    const assets = await Asset.find({ status: "published" }).populate(
      "currentHolder",
      "username"
    );
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
