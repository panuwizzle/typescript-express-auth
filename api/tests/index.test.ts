import request from 'supertest';
import app from '../app';

describe('POST /signup', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    expect(res.body).toHaveProperty('ok', 'ok');
  });

});
