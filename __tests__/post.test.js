import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';


describe('tardygram post routes', () => {
  let agent;
  let user;

  const post1 = {
    photoUrl: 'cat.png',
    caption: 'my cat',
    tags: ['#cute', '#cat'] 
  };

  const post2 = {
    photoUrl: 'frog.png',
    caption: 'frog I found',
    tags: ['#freg', '#forg'] 
  };

  beforeEach(async () => {
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

  it('creates a post from a known user via POST', async () => {
    const res = await agent.post('/api/v1/posts').send({ ...post1, userId: user.id });

    const expected = {
      id: '1',
      userId: user.id,
      photoUrl: 'cat.png',
      caption: 'my cat',
      tags: ['#cute', '#cat']
    };
    
    expect(res.body).toEqual(expected);
  });

  it('gets all posts via GET', async () => {
    
    await agent.post('/api/v1/posts').send({ ...post1, userId: user.id });
    await agent.post('/api/v1/posts').send({ ...post2, userId: user.id });

    const res = await agent.get('/api/v1/posts');
    const expected = [
      { ...post1, id: '1', userId: '1' }, 
      { ...post2, id: '2', userId: '1' }
    ];
    
    expect(res.body).toEqual(expected);
  });

  it('gets a post by id via GET', async () => {

    await agent.post('/api/v1/posts').send({ ...post1, userId: user.id });
    
    const res = await agent.get('/api/v1/posts/1');
    const expected = { 
      ...post1, 
      id: '1', 
      userId: '1' };
    
    expect(res.body).toEqual(expected);
  });

});
