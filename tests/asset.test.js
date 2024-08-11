// tests/asset.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/User");
const Asset = require("../src/models/Asset");

let token;
let userId;

describe("Asset Management", () => {
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
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should create an asset", async () => {
    const res = await request(app)
      .post("/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Asset",
        description: "Test Description",
        image: "test-image-url",
        status: "draft",
      });
    res.status.should.equal(201);
    res.body.message.should.equal("Asset created successfully");
    res.body.assetId.should.be.a("string");
  });

  it("should get asset details", async () => {
    const asset = await Asset.create({
      name: "Test Asset",
      description: "Test Description",
      image: "test-image-url",
      status: "draft",
      creator: userId,
      currentHolder: userId,
    });

    const res = await request(app).get(`/assets/${asset._id}`);
    res.status.should.equal(200);
    res.body.name.should.equal("Test Asset");
  });
});
