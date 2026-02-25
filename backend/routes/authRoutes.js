const express = require('express');
const router = express.Router();
const { googleAuthRedirect, googleAuthCallback } = require('../controllers/authController');

// Redirect to Google
router.get('/google', googleAuthRedirect);

// Callback endpoint Google will call
router.get('/google/callback', googleAuthCallback);

module.exports = router;
