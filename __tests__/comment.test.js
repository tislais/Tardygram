import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';

describe('tardygram post routes', () => {
  let agent;
  let user;
  let post;

  const post1 = {
    photoUrl: 'cat.png',
    caption: 'my cat',
    tags: ['#cute', '#cat'] 
  };

  const comment = { 
    comment: 'hella pog bro'
  };

  beforeEach(async () => {
    await setup(pool);
    agent = await request.agent(app);
    user = await UserService.create({
      username: 'Pogchamp',
      password: 'vidyagamez',
      profilePhotoUrl: 'dog.png' 
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'Pogchamp',
        password: 'vidyagamez'
      });
  });

  it('creates a new comment via POST', async () => {
    const post = await Post.insert({ ...post1, userId: user.id });
    const res = await agent.post('/api/v1/comments')
      .send({ ...comment, commentBy: user.userId, post: post.userId });

    const expected = { ...comment, id: '1', user: '1' };
    
    expect(res.body).toEqual(expected);
  });

});
