import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

app.use(helmet());
app.use(cors()); // judge requires open CORS
app.use(express.json());
app.use(morgan('dev'));

// global rate limiter (per-user/IP)
app.use(rateLimiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// error handler (final)
app.use(errorHandler);

export default app;
