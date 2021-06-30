import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';

let agent;
let user;

describe('tardygram post routes', () => {
  beforeEach(async ()=> {
    await setup(pool);
    agent = await request.agent(app);
    user = await UserService.create({
      username: 'Tis',
      password: 'butts',
      profilePhotoUrl: 'dog.png' 
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'Tis',
        password: 'butts'
      });

  });

  it('', async () => {
    
    const res = await agent.post('/api/v1/posts')
      .send({
        user: user.id,
        photoUrl: 'cat.png',
        caption: 'my cat',
        tags: ['#cute', '#cat']
      });

    const expected = {
      id: '1',
      user: user.id,
      photoUrl: 'cat.png',
      caption: 'my cat',
      tags: ['#cute', '#cat']}
    
    expect(res.body).toEqual(expected);
  });

});
