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

  it('gets a list of 10 posts with the most with the most comments', async () => {

    const post1 = await Post.insert({
      photoUrl: 'cat1.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post1.id,
      comment: 'comment'
    });

    const post2 = await Post.insert({
      photoUrl: 'cat2.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post2.id,
      comment: 'comment'
    });

    const post3 = await Post.insert({
      photoUrl: 'cat3.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post3.id,
      comment: 'comment'
    });

    const post4 = await Post.insert({
      photoUrl: 'cat4.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post4.id,
      comment: 'comment'
    });

    const post5 = await Post.insert({
      photoUrl: 'cat5.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post5.id,
      comment: 'comment'
    });

    const post6 = await Post.insert({
      photoUrl: 'cat6.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post6.id,
      comment: 'comment'
    });
    
    const post7 = await Post.insert({
      photoUrl: 'cat7.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post7.id,
      comment: 'comment'
    });

    const post8 = await Post.insert({
      photoUrl: 'cat8.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post8.id,
      comment: 'comment'
    });

    const post9 = await Post.insert({
      photoUrl: 'cat9.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post9.id,
      comment: 'comment'
    });

    const post10 = await Post.insert({
      photoUrl: 'cat10.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    await Comment.insert({
      commentBy: user.id,
      postId: post10.id,
      comment: 'comment'
    });

    await Post.insert({
      photoUrl: 'cat11.png',
      caption: 'my cat',
      tags: ['#cute', '#cat'],
      userId: user.id
    });

    const res = await agent
      .get('/api/v1/posts/popular');
    
    expect(res.body).toEqual(expect.arrayContaining([post1, post2, post3, post4, post5, post6, post7, post8, post9, post1]));
  });

});
