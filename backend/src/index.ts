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
import hpp from 'hpp';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import './workers/email.worker.js';
import './workers/matches.worker.js';
import './workers/competitions.worker.js';
import './workers/notifications.worker.js';
import './workers/slack.worker.js';

import {
  scheduleMatchesSyncMasterJob,
  scheduleLiveMatchesTicker,
  scheduleMissingTipsReminder,
  scheduleDailyMissingTipsReminder,
} from './queues/matches.queue.js';
import { scheduleDailyStandingsSync } from './queues/competitions.queue.js';
import helmet from 'helmet';

const allowedOrigins = [
  'https://slapshot.club',
  'https://app.slapshot.club',
  'http://localhost:3800',
];

const app = express();
app.disable('x-powered-by');

app.set('trust proxy', 1);
app.set('query parser', 'extended');

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },

    hsts: {
      maxAge: 31536000,

      includeSubDomains: true,
      preload: true,
    },
  }),
);

app.use(pinoHttp({ logger, autoLogging: false }));

app.use('/api/v1', globalLimiter, apiRouter);

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
  await scheduleDailyStandingsSync();
});
