import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';

// Admin / Auth Routes
import adminRoutes from './routes/Admin/adminRoutes.js';
import authRoutes from './routes/Admin/authRoutes.js';
import userRoutes from './routes/Admin/userRoutes.js';

// Gym Routes
import trainerRoutes from './routes/Gym/trainerRoutes.js';
import planRoutes from './routes/Gym/planRoutes.js';
import bookingRoutes from './routes/Gym/bookingRoutes.js';
import supplementRoutes from './routes/Gym/supplementRoutes.js';

import { userMembershipRouter, adminMembershipRouter } from './routes/Gym/membershipPurchaseRoutes.js';
import { userStoreProductRouter, adminStoreProductRouter } from './routes/Gym/storeProductRoutes.js';
import { userStoreOrderRouter, adminStoreOrderRouter } from './routes/Gym/storeOrderRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors({ origin: allowedOrigins, credentials: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Body parsing — allow up to 10MB for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve('./uploads')));

// ── Routes ──────────────────────────────────────────────────────────────────
// Auth / Admin
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Gym
app.use('/api/trainers', trainerRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/supplements', supplementRoutes);

// New Gym features
app.use('/api/memberships', userMembershipRouter);
app.use('/api/admin/memberships', adminMembershipRouter);
app.use('/api/store/products', userStoreProductRouter);
app.use('/api/admin/store/products', adminStoreProductRouter);
app.use('/api/store/orders', userStoreOrderRouter);
app.use('/api/admin/store/orders', adminStoreOrderRouter);

// Health check
app.get('/', (req, res) => res.json({ message: 'Fitness World API is running 🏋️' }));

// ── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect to DB:', err.message || err);
    if (process.env.START_SERVER_EVEN_IF_DB_FAIL === 'true') {
      console.warn('START_SERVER_EVEN_IF_DB_FAIL=true — starting without DB');
      app.listen(PORT, () => console.log(`⚠️  Server running (no DB) on http://localhost:${PORT}`));
    } else {
      process.exit(1);
    }
  }
};

startServer();
