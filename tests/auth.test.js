const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index"); 
const User = require("../src/models/User");

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should signup a new user", async () => {
    const res = await request(app).post("/auth/signup").send({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not signup a user with duplicate username", async () => {
    await User.create({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });

    const res = await request(app).post("/auth/signup").send({
      username: "testuser",
      password: "newpassword123",
      email: "newemail@example.com",
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("error", "Username already exists");
  });

  it("should login an existing user", async () => {
    const user = new User({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });
    await user.save();

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    const user = new User({
      username: "testuser",
      password: "password123",
      email: "testuser@example.com",
    });
    await user.save();

    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });
});
