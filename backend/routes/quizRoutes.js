const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const { getDailyQuiz, submitQuiz } = require('../controllers/quizController');

router.get('/daily', optionalAuth, getDailyQuiz);
router.post('/submit', optionalAuth, submitQuiz);

module.exports = router;


