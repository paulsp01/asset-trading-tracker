// src/controllers/assetController.js
const Asset = require("../models/Asset");

exports.createAsset = async (req, res) => {
  const { name, description, image, status } = req.body;
  try {
    const asset = new Asset({
      name,
      description,
      image,
      status,
      creator: req.user._id,
      currentHolder: req.user._id,
    });
    await asset.save();
    res
      .status(201)
      .json({ message: "Asset created successfully", assetId: asset._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAsset = async (req, res) => {
  const { id } = req.params;
  const { name, description, image, status } = req.body;
  try {
    const asset = await Asset.findByIdAndUpdate(
      id,
      { name, description, image, status },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Asset updated successfully", assetId: asset._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.publishAsset = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );
    res.status(200).json({ message: "Asset published successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAssetDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findById(id).populate("creator currentHolder");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserAssets = async (req, res) => {
  const { id } = req.params;
  try {
    const assets = await Asset.find({ creator: id });
    res.status(200).json(assets);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
