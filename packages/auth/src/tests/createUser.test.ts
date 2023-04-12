import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { User } from '../models/user'


describe('POST /signup', () => {
  // Connect to MongoDB before running tests
  beforeAll(async () => {
    const mongoURI = 'mongodb://authy:abcd1234@localhost:27017/authytest';
    await mongoose.connect(mongoURI);
  });

  // Close the MongoDB connection after running tests
  afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'test@example.com',
        password: '12345678',
      })
      .expect(201);

    expect(res.body).toHaveProperty('data.email', 'test@example.com');
  });

  it('should return a 400 Bad Request for invalid input', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: 'invalid_email',
        password: '',
      })
      .expect(400);
  });
});
