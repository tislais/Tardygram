import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Comment from '../lib/models/Comment.js';
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
    post = await Post.insert({ ...post1, userId: user.id });    
    
    const res = await agent.post('/api/v1/comments')
      .send({ 
        comment: 'pog', 
        commentBy: user.userId, 
        postId: post.id 
      });

    const expected = { 
      comment: 'pog', 
      id: '1', 
      postId: '1', 
      commentBy: '1' };
    
    expect(res.body).toEqual(expected);
  });

  it('deletes a comment via DELETE', async () => {
    post = await Post.insert({ ...post1, userId: user.id }); 
    const comment = await Comment.insert({ 
      id: '1',
      commentBy: user.id,
      postId: post.id,
      comment: 'pog'
    });

    const res = await agent
      .delete(`/api/v1/comments/${comment.id}`)
      .send(comment);

    expect(res.body).toEqual(comment);

  });

});
