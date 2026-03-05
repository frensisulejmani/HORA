const express = require('express');
const router = express.Router();
const { computeHumanDesign } = require('../controllers/hdController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// POST /api/hd/design
// authentication optional: if a valid token is sent we can pull the stored birth data;
// otherwise the request body must include the birth fields.
router.post('/design', optionalAuth, computeHumanDesign);

module.exports = router;


