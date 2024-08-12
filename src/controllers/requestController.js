// src/controllers/requestController.js
const Request = require("../models/Request");
const Asset = require("../models/Asset");

exports.requestToBuyAsset = async (req, res) => {
  const { id } = req.params;
  const { proposedPrice } = req.body;
  try {
    const request = new Request({
      asset: id,
      buyer: req.user._id,
      proposedPrice,
    });
    await request.save();
    res.status(201).json({ message: "Purchase request sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.negotiateRequest = async (req, res) => {
  const { id } = req.params;
  const { newProposedPrice } = req.body;
  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { proposedPrice: newProposedPrice },
      { new: true }
    );
    res.status(200).json({ message: "Negotiation updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findById(id).populate("asset");
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update asset holder
    await Asset.findByIdAndUpdate(request.asset._id, {
      currentHolder: request.buyer,
      $push: {
        tradingJourney: {
          holder: request.buyer,
          date: new Date(),
          price: request.proposedPrice,
        },
      },
      $inc: { numberOfTransfers: 1 },
    });

    // Send response
    res.status(200).json({ message: "Request accepted, holder updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.denyRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await Request.findByIdAndUpdate(id, { status: "denied" }, { new: true });
    res.status(200).json({ message: "Request denied" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserRequests = async (req, res) => {
  const { id } = req.params;
  try {
    const requests = await Request.find({ buyer: id });
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
