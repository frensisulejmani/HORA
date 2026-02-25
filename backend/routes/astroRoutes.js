const express = require('express');
const router = express.Router();
const { natal, astrocartography } = require('../controllers/astroController');

// POST /api/astro/natal
router.post('/natal', natal);

// POST /api/astro/astrocartography
router.post('/astrocartography', astrocartography);

module.exports = router;