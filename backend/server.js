const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
// Configure CORS to allow requests from the frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl requests or mobile apps)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port (development)
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    if (origin.startsWith('http://127.0.0.1:')) return callback(null, true);
    
    // Allow from environment variable (production)
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
      return callback(null, true);
    }
    
    // For other origins in production, reject
    console.log('CORS request rejected from:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for debugging client requests
app.use((req, res, next) => {
  const short = `${req.method} ${req.url}`;
  const origin = req.headers.origin || req.headers.referer || req.headers.host;
  console.log(` ${short} from ${origin}`);
  next();
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://frensi009_db_user:LZajzt8REj1uQi39@cluster0.3dyd6g8.mongodb.net/';
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hora API' });
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes - Load them and show detailed errors if they fail
console.log('Loading routes...');

try {
  const userRoutes = require('./routes/userRoutes');
  console.log('userRoutes loaded');
  app.use('/api/users', userRoutes);
  console.log('/api/users routes registered');
} catch (error) {
  console.error('ERROR loading user routes:', error.message);
}

try {
  const aiRoutes = require('./routes/aiRoutes');
  console.log('aiRoutes loaded');
  app.use('/api/ai', aiRoutes);
  console.log('/api/ai routes registered');
} catch (error) {
  console.error('ERROR loading AI routes:', error.message);
}

try {
  const astroRoutes = require('./routes/astroRoutes');
  console.log('astroRoutes loaded');
  app.use('/api/astro', astroRoutes);
  console.log('/api/astro routes registered');
} catch (error) {
  console.error('ERROR loading Astro routes:', error.message);
}

try {
  const quizRoutes = require('./routes/quizRoutes');
  console.log('quizRoutes loaded');
  app.use('/api/quiz', quizRoutes);
  console.log('/api/quiz routes registered');
} catch (error) {
  console.error('ERROR loading Quiz routes:', error.message);
}

try {
  const gamifyRoutes = require('./routes/gamifyRoutes');
  console.log('gamifyRoutes loaded');
  app.use('/api/gamify', gamifyRoutes);
  console.log('/api/gamify routes registered');
} catch (error) {
  console.error('ERROR loading Gamify routes:', error.message);
}

try {
  const hdRoutes = require('./routes/hdRoutes');
  console.log('hdRoutes loaded');
  app.use('/api/hd', hdRoutes);
  console.log('/api/hd routes registered');
} catch (error) {
  console.error('ERROR loading HD routes:', error.message);
}

try {
  const destinyRoutes = require('./routes/destinyRoutes');
  console.log('destinyRoutes loaded');
  app.use('/api/destiny', destinyRoutes);
  console.log('/api/destiny routes registered');
} catch (error) {
  console.error('ERROR loading Destiny routes:', error.message);
}

try {
  const authRoutes = require('./routes/authRoutes');
  console.log('authRoutes loaded');
  app.use('/auth', authRoutes);
  console.log('/auth routes registered');
} catch (error) {
  console.error('ERROR loading auth routes:', error.message);
}

console.log('All routes loaded');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// 404 handler - must be last
app.use((req, res) => {
  const now = new Date().toISOString();
  const clientInfo = {
    host: req.headers.host,
    origin: req.headers.origin,
    referer: req.headers.referer,
    'user-agent': req.headers['user-agent']
  };
  console.log('404 - Route not found:', req.method, req.url, 'at', now);
  console.log('   Incoming request headers (selected):', clientInfo);
  res.status(404).json({ 
    message: 'Route not found',
    requestedUrl: req.url,
    method: req.method,
    timestamp: now
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Test with: http://localhost:${PORT}/api/test`);
});