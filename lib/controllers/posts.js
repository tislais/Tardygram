import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth.js';
import Post from '../models/Post.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post.insert({ ...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Post.findAll()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

;
