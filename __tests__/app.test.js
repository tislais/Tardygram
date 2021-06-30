import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('demo routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  it('signs a user up via POST', async () => {
    
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'supersecretpizzaparty'
      });

    const expected = {
      id: '1',
      email: 'test@example.com'
    };
    
    expect(res.body).toEqual(expected);
  });


});
