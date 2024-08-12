const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index"); // Assuming your Express app is exported from index.js
const Asset = require("../src/models/assetModel");
const Request = require("../src/models/requestModel");
const User = require("../src/models/userModel");
const jwt = require("jsonwebtoken");

describe("Marketplace and Trading API", () => {
  let token;
  let userId;
  let assetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Create a user and get the token for authentication
    const user = new User({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });
    await user.save();
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create an asset to be used in subsequent tests
    const asset = new Asset({
      name: "Marketplace Asset",
      description: "This is a published asset",
      image: "image_url",
      status: "published",
      creator: userId,
      currentHolder: userId,
    });
    await asset.save();
    assetId = asset._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Request.deleteMany({});
  });

  // Test retrieving assets on the marketplace
  it("should retrieve all published assets on the marketplace", async () => {
    const res = await request(app)
      .get("/marketplace/assets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1); // Assuming there's only one published asset
    expect(res.body[0]).toHaveProperty("name", "Marketplace Asset");
    expect(res.body[0]).toHaveProperty("status", "published");
  });

  // Test creating a purchase request
  it("should create a purchase request for an asset", async () => {
    const res = await request(app)
      .post(`/assets/${assetId}/request`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        proposedPrice: 150,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "Purchase request created successfully"
    );
    expect(res.body).toHaveProperty("requestId");

    const createdRequest = await Request.findById(res.body.requestId);
    expect(createdRequest).not.toBeNull();
    expect(createdRequest.proposedPrice).toEqual(150);
    expect(createdRequest.asset.toString()).toEqual(assetId.toString());
    expect(createdRequest.buyer.toString()).toEqual(userId.toString());
  });

  // Test negotiating a purchase request
  it("should negotiate a purchase request", async () => {
    const purchaseRequest = new Request({
      asset: assetId,
      buyer: userId,
      proposedPrice: 150,
      status: "pending",
    });
    await purchaseRequest.save();

    const res = await request(app)
      .put(`/requests/${purchaseRequest._id}/negotiate`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        proposedPrice: 180,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Purchase request updated successfully"
    );

    const updatedRequest = await Request.findById(purchaseRequest._id);
    expect(updatedRequest.proposedPrice).toEqual(180);
  });

  // Test accepting a purchase request
  it("should accept a purchase request and transfer asset ownership", async () => {
    const purchaseRequest = new Request({
      asset: assetId,
      buyer: userId,
      proposedPrice: 180,
      status: "pending",
    });
    await purchaseRequest.save();

    const res = await request(app)
      .put(`/requests/${purchaseRequest._id}/accept`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Purchase request accepted, asset ownership transferred"
    );

    const acceptedRequest = await Request.findById(purchaseRequest._id);
    expect(acceptedRequest.status).toEqual("accepted");

    const updatedAsset = await Asset.findById(assetId);
    expect(updatedAsset.currentHolder.toString()).toEqual(userId.toString());
  });

  // Test denying a purchase request
  it("should deny a purchase request", async () => {
    const purchaseRequest = new Request({
      asset: assetId,
      buyer: userId,
      proposedPrice: 150,
      status: "pending",
    });
    await purchaseRequest.save();

    const res = await request(app)
      .put(`/requests/${purchaseRequest._id}/deny`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Purchase request denied");

    const deniedRequest = await Request.findById(purchaseRequest._id);
    expect(deniedRequest.status).toEqual("denied");
  });

  // Test retrieving user's purchase requests
  it("should retrieve all purchase requests made by the user", async () => {
    await Request.create([
      {
        asset: assetId,
        buyer: userId,
        proposedPrice: 150,
        status: "pending",
      },
      {
        asset: assetId,
        buyer: userId,
        proposedPrice: 200,
        status: "accepted",
      },
    ]);

    const res = await request(app)
      .get(`/users/${userId}/requests`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("proposedPrice", 150);
    expect(res.body[1]).toHaveProperty("proposedPrice", 200);
  });
});
