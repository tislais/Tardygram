import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth';
import Post from '../models/Post';

export default Router()
  .post('/api/v1/posts', ensureAuth, (req, res, next) => {
    Post.insert({...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })


;
