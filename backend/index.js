import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import visitorRoutes from './routes/visitorRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import dns from 'dns';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Rate limiter configuration (max 50 requests per minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per window
  message: {
    message: 'Too many requests from this IP, please try again after a minute'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});
