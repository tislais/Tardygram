import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth.js';
import Comment from '../models/Comment.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Comment.insert({ ...req.body, commentBy: req.user.id })
      .then(comment => res.send(comment))
      .catch(next);
  })




;