// tests/auth.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/User");

describe("Authentication", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/asset-trading-test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/auth/signup").send({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });
    res.status.should.equal(201);
    res.body.message.should.equal("User created successfully");
    res.body.token.should.be.a("string");
  });

  it("should login an existing user", async () => {
    await User.create({
      username: "testuser",
      password: "password123", // Ensure password is hashed in real implementation
      email: "testuser@example.com",
    });

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    res.status.should.equal(200);
    res.body.message.should.equal("Login successful");
    res.body.token.should.be.a("string");
  });
});
