const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const fs       = require('fs');
const connectDB = require('./config/db');

// Load .env from the backend folder regardless of where the process was started
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB Atlas
connectDB();

// Ensure the uploads directory exists for product images (safely ignore in read-only serverless environments)
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('[Init] Created public/uploads/ for product images.');
  }
} catch (err) {
  console.warn('[Init] Could not create uploads directory (safe on read-only environments like Vercel):', err.message);
}

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));           // allow base64 image payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded product images as static files at /uploads/<file>
app.use('/uploads', express.static(UPLOADS_DIR));

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);                     // server-to-server / curl
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return cb(null, true);
    }
    return cb(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Root endpoint ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nayyab Dry Fruit API is running!',
    health: '/api/health',
    endpoints: [
      '/api/products',
      '/api/orders',
      '/api/reviews',
      '/api/bulk-inquiries'
    ]
  });
});

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    success:    true,
    message:    'Nayyab Dry Fruit API is healthy!',
    storage:    'MongoDB Atlas',
    dbState:    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    store:      'Nayyab Dry Fruit',
    proprietor: 'Hafiz Sumair (Baghbanpura, Lahore)',
    timestamp:  new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/products',       require('./routes/productRoutes'));
app.use('/api/orders',         require('./routes/orderRoutes'));
app.use('/api/reviews',        require('./routes/reviewRoutes'));
app.use('/api/bulk-inquiries', require('./routes/bulkInquiryRoutes'));

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error:   process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// ── Start ─────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log('  🥜 NAYYAB DRY FRUIT BACKEND — MongoDB Atlas Mode  ');
    console.log(`  Port: ${PORT}  |  Env: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Health: http://localhost:${PORT}/api/health`);
    console.log('====================================================');
  });
}

module.exports = app;
