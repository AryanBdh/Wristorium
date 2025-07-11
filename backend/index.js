import webRouter from './router/web.js';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connection from './database/connection.js';
import UserTableSeeder from './database/seeder/UserTableSeeder.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes under /api
app.use('/api', webRouter);

// Start server
const startServer = async () => {
  await connection(); // connect to DB
  await UserTableSeeder.run(); // seed users if needed

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
