import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import authController from './controllers/auth.js';
import errorMiddleware from './middleware/error.js';

const app = express();

app.use(express.json());

if (app) {
  console.log('app go brr');
}

app.use(authController);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
