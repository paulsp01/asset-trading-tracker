// tests/marketplace.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/User");
const Asset = require("../src/models/Asset");

let token;
let userId;
let assetId;

describe("Marketplace", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/asset-trading-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.create({
      username: "testuser",
      password: "password123", // Ensure password is hashed in real implementation
      email: "testuser@example.com",
    });
    userId = user._id;

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    token = res.body.token;

    const asset = await Asset.create({
      name: "Test Asset",
      description: "Test Description",
      image: "test-image-url",
      status: "draft",
      creator: userId,
      currentHolder: userId,
    });
    assetId = asset._id;
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should list an asset on the marketplace", async () => {
    const res = await request(app)
      .put(`/assets/${assetId}/publish`)
      .set("Authorization", `Bearer ${token}`);
    res.status.should.equal(200);
    res.body.message.should.equal("Asset published successfully");
  });

  it("should get assets on the marketplace", async () => {
    const res = await request(app).get("/marketplace/assets");
    res.status.should.equal(200);
    res.body.should.be.an("array");
    res.body[0].name.should.equal("Test Asset");
  });
});
