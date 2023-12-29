import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import cors from 'cors';

app.use(cors());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
