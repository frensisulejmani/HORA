const express = require('express');
const router = express.Router();
const { computeHumanDesign } = require('../controllers/hdController');

// POST /api/hd/design
router.post('/design', computeHumanDesign);

module.exports = router;


