
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import db from './models/indes';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import  { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

 connectDB();

const app = express();
app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

db.sequelize.sync()
    .then(() => {
        console.log("sync db.");
    })
    .catch((err: Error) => {
        console.error("Failed to sync db: " + err.message);
    });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
      status: 'fail',
      code: 500,
      error: `Can't find ${err.stack}`
  });
});

// 404 handler
app.use((req: Request, res: Response, next: Function) => {
  res.status(404).json({
      status: 'fail',
      code: 404,
      error: `Can't find ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
