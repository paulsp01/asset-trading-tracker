const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index"); 
const Asset = require("../src/models/Asset");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("Asset Management API", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

   
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
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Asset.deleteMany({});
  });

 
  it("should create an asset in draft state", async () => {
    const res = await request(app)
      .post("/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Draft Asset",
        description: "This is a draft asset",
        image: "image_url",
        status: "draft",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Asset created successfully");
    expect(res.body).toHaveProperty("assetId");
  });

  it("should create an asset in published state", async () => {
    const res = await request(app)
      .post("/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Published Asset",
        description: "This is a published asset",
        image: "image_url",
        status: "published",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Asset created successfully");
    expect(res.body).toHaveProperty("assetId");
  });

  
  it("should list an asset on the marketplace", async () => {
    const asset = new Asset({
      name: "Draft Asset",
      description: "This is a draft asset",
      image: "image_url",
      status: "draft",
      creator: userId,
    });
    await asset.save();

    const res = await request(app)
      .put(`/assets/${asset._id}/publish`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Asset published successfully");

    const updatedAsset = await Asset.findById(asset._id);
    expect(updatedAsset.status).toEqual("published");
  });

  
  it("should retrieve asset details", async () => {
    const asset = new Asset({
      name: "Test Asset",
      description: "This is a test asset",
      image: "image_url",
      status: "published",
      creator: userId,
      currentHolder: userId,
      tradingJourney: [],
      averageTradingPrice: 100,
      lastTradingPrice: 120,
      numberOfTransfers: 2,
      isListed: true,
      proposals: 3,
    });
    await asset.save();

    const res = await request(app)
      .get(`/assets/${asset._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", asset._id.toString());
    expect(res.body).toHaveProperty("name", "Test Asset");
    expect(res.body).toHaveProperty("tradingJourney");
    expect(res.body).toHaveProperty("averageTradingPrice", 100);
    expect(res.body).toHaveProperty("lastTradingPrice", 120);
    expect(res.body).toHaveProperty("numberOfTransfers", 2);
    expect(res.body).toHaveProperty("isListed", true);
    expect(res.body).toHaveProperty("proposals", 3);
  });

 
  it("should retrieve all assets for a user", async () => {
    await Asset.create([
      {
        name: "Asset 1",
        description: "First asset",
        image: "image_url_1",
        status: "published",
        creator: userId,
        currentHolder: userId,
      },
      {
        name: "Asset 2",
        description: "Second asset",
        image: "image_url_2",
        status: "draft",
        creator: userId,
        currentHolder: userId,
      },
    ]);

    const res = await request(app)
      .get(`/users/${userId}/assets`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Asset 1");
    expect(res.body[1]).toHaveProperty("name", "Asset 2");
  });
});
