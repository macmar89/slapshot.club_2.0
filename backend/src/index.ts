import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { IS_PRODUCTION, env } from './config/env.js';
import { AppError } from './utils/appError.js';
import { HttpStatusCode } from './utils/httpStatusCodes.js';
import './workers/email.worker.js';
import './workers/matches.worker.js';
import './workers/competitions.worker.js';
import {
  scheduleMatchesSyncMasterJob,
  scheduleLiveMatchesTicker,
  scheduleMissingTipsReminder,
  scheduleDailyMissingTipsReminder,
} from './queues/matches.queue.js';

const allowedOrigins = [
  'https://slapshot.club',
  'https://app.slapshot.club',
  'http://localhost:3800',
];

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(pinoHttp({ logger, autoLogging: false }));

app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => {
  res.status(HttpStatusCode.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.all('{*path}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatusCode.NOT_FOUND));
});

app.use(errorHandler);

app.listen(env.PORT, async () => {
  console.log(`Server running on http://localhost:${env.PORT}`);

  // Schedule the recurring matches sync job
  await scheduleMatchesSyncMasterJob();
  await scheduleLiveMatchesTicker();
  await scheduleMissingTipsReminder();
  await scheduleDailyMissingTipsReminder();
});
