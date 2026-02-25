const express = require('express');
const router = express.Router();
const { computeDestinyMatrix } = require('../controllers/destinyController');

// POST /api/destiny/matrix
router.post('/matrix', computeDestinyMatrix);

module.exports = router;
