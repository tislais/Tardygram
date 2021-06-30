import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

const agent = request.agent(app);

describe.skip('tardygram auth routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  it('signs a user up via POST', async () => {
    
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'test@example.com',
        password: 'supersecretpizzaparty',
        profilePhotoUrl: 'djkfldsj'
      });      

    const expected = {
      id: '1',
      username: 'test@example.com',
      profilePhotoUrl: 'djkfldsj'
    };
    
    expect(res.body).toEqual(expected);
  });

  it('logs in a user via POST', async() => {
    const res = await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'test@example.com',
        password: 'supersecretpizzaparty'
      });
      
    expect(res.body).toEqual({
      id: '1',
      username: 'test@example.com',
      profilePhotoUrl: 'djkfldsj'
    });
  });


});
