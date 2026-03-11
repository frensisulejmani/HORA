const express = require('express');
const router = express.Router();
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  generateReading,
  interpretDream,
  pastLifeReading,
  generalChat
} = require('../controllers/aiController');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/reading — requires auth so reading is saved to the right user
router.post('/reading', requireAuth, generateReading);

// POST /api/ai/dream
router.post('/dream', requireAuth, interpretDream);

// POST /api/ai/past-life
router.post('/past-life', requireAuth, pastLifeReading);

// POST /api/ai/chat
router.post('/chat', optionalAuth, generalChat);

// POST /api/ai/tarot
router.post('/tarot', optionalAuth, async (req, res) => {
  try {
    const { cards } = req.body;
    if (!Array.isArray(cards) || cards.length < 3) {
      return res.status(400).json({ message: 'Provide at least 3 tarot cards' });
    }

    const prompt = `
You are an ancient, mystical Tarot Oracle.
A user has drawn these three cards: ${cards.join(', ')}.

Please provide a detailed, immersive reading following this structure:
1. Past (${cards[0]}): Write 2-3 paragraphs about the energies that led here.
2. Present (${cards[1]}): Write 2-3 paragraphs about current obstacles and hidden truths.
3. Future (${cards[2]}): Write 2-3 paragraphs about the potential outcome and spiritual advice.

Tone: Enigmatic, poetic, and encouraging. Use metaphors related to stars, shadows, and fate.
Do not use Markdown headers. Use bold text for card names.
    `.trim();

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: 'You are a mystical tarot oracle. Be poetic, enigmatic, and deeply insightful.'
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9 }
    });

    res.json({ message: 'OK', reading: result.response.text() });
  } catch (err) {
    console.error('tarot error:', err.message);
    res.status(500).json({ message: 'Failed to generate tarot reading', error: err.message });
  }
});

module.exports = router;