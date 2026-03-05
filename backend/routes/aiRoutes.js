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


const cards = req.body.cards;

const prompt = `
  You are an ancient, mystical Tarot Oracle. 
  A user has drawn these three cards: ${cards.join(", ")}.
  
  Please provide a detailed, immersive reading following this structure:
  1. **Past (${cards[0]}):** Write 2-3 paragraphs about the energies that led here. 
  2. **Present (${cards[1]}):** Write 2-3 paragraphs about current obstacles and hidden truths.
  3. **Future (${cards[2]}):** Write 2-3 paragraphs about the potential outcome and spiritual advice.
  
  Tone: Enigmatic, poetic, and encouraging. Use metaphors related to stars, shadows, and fate.
  Constraint: Do not use Markdown headers (like # or ##). Use bold text for card names.
`;


module.exports = router;