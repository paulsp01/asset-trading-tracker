// src/controllers/requestController.js
const Asset = require("../models/Asset");
const Request = require("../models/Request");

exports.requestToBuyAsset = async (req, res) => {
  const { proposedPrice } = req.body;
  try {
    const request = new Request({
      asset: req.params.id,
      buyer: req.user.id,
      proposedPrice,
      status: "pending",
    });
    await request.save();
    res.status(201).json({ message: "Purchase request sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.negotiateRequest = async (req, res) => {
  const { newProposedPrice } = req.body;
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { proposedPrice: newProposedPrice },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Negotiation updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const asset = await Asset.findById(request.asset);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    asset.currentHolder = request.buyer;
    asset.tradingJourney.push({
      holder: request.buyer,
      date: new Date(),
      price: request.proposedPrice,
    });
    asset.numberOfTransfers += 1;
    asset.lastTradingPrice = request.proposedPrice;
    await asset.save();

    await Request.findByIdAndUpdate(request._id, { status: "accepted" });

    res.status(200).json({ message: "Request accepted, holder updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.denyRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "denied" },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Request denied" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user.id });
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
