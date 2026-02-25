const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { dailyCheckin } = require('../controllers/gamifyController');

router.post('/checkin', authMiddleware, dailyCheckin);

module.exports = router;


