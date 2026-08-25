import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import visitorRoutes from './routes/visitorRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { getAirtableBase } from './services/airtableService.js';

// Load environment variables
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env');
dotenv.config({ path: envPath });

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

// Root health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const base = getAirtableBase();
    const table = process.env.AIRTABLE_RECEPTION_DATA_TABLE || 'Reception-Data';
    await base(table).select({ maxRecords: 1 }).firstPage();
    res.status(200).json({ status: 'ok', database: 'Airtable', connected: true });
  } catch (err) {
    res.status(200).json({ 
      status: 'warning', 
      database: 'Airtable', 
      connected: false, 
      error: err.message,
      hasAirtableToken: Boolean((process.env.AIRTABLE_API_KEY || '').trim()),
      airtableBaseId: (process.env.AIRTABLE_BASE_ID || '').trim() ? `${(process.env.AIRTABLE_BASE_ID || '').trim().slice(0, 4)}...${(process.env.AIRTABLE_BASE_ID || '').trim().slice(-4)}` : '',
      airtableTable: (process.env.AIRTABLE_RECEPTION_DATA_TABLE || 'Reception-Data').trim(),
      hint: err.statusCode === 401 ? 'Please check your AIRTABLE_API_KEY in backend/.env' : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Airtable Reception-Data integration`);
});
