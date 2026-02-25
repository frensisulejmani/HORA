const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '7d'
  });
};

// Redirect user to Google's OAuth consent screen
const googleAuthRedirect = async (req, res) => {
  try {
    // Ensure client id is configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set');
      return res.status(500).json({ message: 'Server misconfiguration: GOOGLE_CLIENT_ID not set' });
    }
    // Ensure redirect is configured
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL || 'http://localhost:5000'}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // Log the redirect URI and final URL for debugging redirect_uri_mismatch
    console.log('Google OAuth redirect_uri used:', redirectUri);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Full Google OAuth URL:', url);
    }
    return res.redirect(url);
  } catch (error) {
    console.error('Google auth redirect error:', error);
    return res.status(500).json({ message: 'Failed to start Google authentication' });
  }
};

// Callback handler to exchange code and sign user in
const googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Missing code from Google' });

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
      return res.status(500).json({ message: 'Server misconfiguration: Google OAuth credentials not set' });
    }

    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL || 'http://localhost:5000'}/auth/google/callback`,
      grant_type: 'authorization_code'
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenRes.data;

    // Get user info
    const userInfoRes = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture, sub } = userInfoRes.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create a random password for OAuth users
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = new User({ name: name || 'Google User', email, password: randomPassword });
      await user.save();
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Redirect back to frontend onboarding page with token for client to pick up
    const frontend = process.env.FRONTEND_URL || (process.env.VITE_API_URL ? process.env.VITE_API_URL : 'http://localhost:5173');
    const redirectUrl = `${frontend}/onboarding?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    const errDetail = error.response?.data || error.message || error;
    console.error('Google auth callback error:', errDetail);

    // In development return the remote error payload for easier debugging
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: 'Google authentication failed', error: errDetail });
    }

    return res.status(500).json({ message: 'Google authentication failed' });
  }
};

module.exports = {
  googleAuthRedirect,
  googleAuthCallback
};
