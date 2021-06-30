import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import authController from './controllers/auth.js';
import postController from './controllers/posts.js';
import errorMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

if (app) {
  console.log('app go brr');
}

app.use(authController);
app.use(postController);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
