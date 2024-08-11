// tests/request.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/User');
const Asset = require('../src/models/Asset');
const Request = require('../src/models/Request');

let token;
let userId;
let assetId;

describe('Requests and Negotiations', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/asset-trading-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.create({
      username: 'testuser',
      password: 'password123', // Ensure password is hashed in real implementation
      email: 'testuser@example.com',
    });
    userId = user._id;

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    token = res.body.token;

    const asset = await Asset.create({
      name: 'Test Asset',
      description: 'Test Description',
      image: 'test-image-url',
      status: 'published',
      creator: userId,
      currentHolder: userId,
    });
    assetId = asset._id;
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should request to buy an asset', async () => {
    const res = await request(app)
      .post(`/assets/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        proposedPrice: 500,
      });
    res.status.should.equal(201);
    res.body.message.should.equal('Purchase request sent');
  });

  it('should negotiate a purchase request', async () => {
    const requestDoc = await Request.create({
      asset: assetId,
      buyer: userId,
      proposedPrice: 500,
      status: 'pending',
    });

    const res = await request(app)
      .put(`/requests/${requestDoc._id}/negotiate`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newProposedPrice: 600,
      });
    res.status.should.equal(200);
    res.body.message.should.equal('Negotiation updated');
  });

  it('should accept a purchase request', async () => {
    const requestDoc = await Request.create({
      asset: assetId,
      buyer: userId,
      proposedPrice: 500,
      status: 'pending',
    });

    const res = await request(app)
      .put(`/requests/${requestDoc._id}/accept`)
      .set('Authorization', `Bearer ${token}`);
    res.status.should.equal(200);
    res.body.message.should.equal('Request accepted, holder updated');
  });

  it('should deny a purchase request', async () => {
    const requestDoc = await Request.create({
      asset: assetId,
      buyer: userId,
      proposedPrice: 500,
      status: 'pending',
    });

    const res = await request(app)
      .put(`/requests/${requestDoc._id}/deny`)
      .set('Authorization', `Bearer ${token}`);
    res.status.should.equal(200);
    res.body.message.should.equal('Request denied');
  });

  it('should get user\'s purchase requests', async () => {
   
