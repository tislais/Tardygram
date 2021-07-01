import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';
import Comment from '../lib/models/Comment.js';


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
    
    await agent.post('/api/v1/posts').send(
      { ...post1, 
        userId: user.id 
      });
    await agent.post('/api/v1/posts').send({ ...post2, userId: user.id });

    const res = await request(app).get('/api/v1/posts');
    const expected = [
      { ...post1, id: '1', userId: '1' }, 
      { ...post2, id: '2', userId: '1' }
    ];
    
    expect(res.body).toEqual(expected);
  });

  it('gets a post by id via GET', async () => {

    const post = await Post.insert({ ...post1, userId: user.id });

    await Comment.insert({
      id: '1',
      commentBy: user.id,
      postId: post.id,
      comment: 'pog'
    });
    
    const res = await request(app).get(`/api/v1/posts/${post.id}`);    
    
    expect(res.body).toEqual({
      ...post,
      comments: ['pog']
    });
  });

  it('updates a post via patch', async () => {

    const post = await Post.insert({ ...post1, userId: user.id });

    post.caption = 'pogchamp';
    
    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send({ caption: 'pogchamp' });
    
    expect(res.body).toEqual(post);
  });

  it('deletes a post via DELETE', async () => {

    const post = await Post.insert({ ...post1, userId: user.id });
    const res = await agent
      .delete(`/api/v1/posts/${post.id}`);
    
    expect(res.body).toEqual(post);
  });

});
