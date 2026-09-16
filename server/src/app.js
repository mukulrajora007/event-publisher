import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured,
    storageMode: isSupabaseConfigured ? 'supabase' : 'in-memory-fallback'
  });
});

// API Routes
app.use('/api', eventRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Event Publisher API is active',
    endpoints: {
      events: '/api/events',
      categories: '/api/categories',
      health: '/api/health'
    }
  });
});

export default app;
