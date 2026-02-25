const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const { 
  generateReading, 
  interpretDream, 
  pastLifeReading,
  generalChat 
} = require('../controllers/aiController');

// POST /api/ai/reading
router.post('/reading', optionalAuth, generateReading);

// POST /api/ai/dream
router.post('/dream', optionalAuth, interpretDream);

// POST /api/ai/past-life
router.post('/past-life', optionalAuth, pastLifeReading);

// POST /api/ai/chat - General chatbot endpoint
router.post('/chat', optionalAuth, generalChat);

module.exports = router;