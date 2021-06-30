import { Router } from 'express';
import UserService from '../services/UserService.js';

const ONE_DAY = 1000 * 60 * 60 * 24;

export default Router()
  .post('/api/v1/auth/signup', (req, res, next) => {
    UserService.create(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          httpOnly: true,
          maxAge: ONE_DAY
        });
        res.sent(user);
      })
      .catch(next);
  })



;
