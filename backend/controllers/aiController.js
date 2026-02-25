const { getComprehensiveNatal } = require('../utils/astroAPI');
const { calculateDestinyMatrix } = require('../utils/destinyMatrix');
const Reading = require('../models/Reading');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function buildPrompt({ name, birth, astroNatal, destiny }) {
  const lines = [];
  lines.push(`User: ${name || 'N/A'}`);
  lines.push(`Birth: ${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.date).padStart(2, '0')} ${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')} TZ ${birth.timezone} @ (${birth.latitude}, ${birth.longitude}) ${birth.place || ''}`);
  lines.push('— Destiny Matrix —');
  lines.push(`Life Path: ${destiny.lifePathNumber}`);
  if (destiny.expressionNumber) lines.push(`Expression: ${destiny.expressionNumber}`);
  lines.push('— Natal Highlights —');
  const sun = Array.isArray(astroNatal?.planets) ? astroNatal.planets.find((p) => (p.name || '').toLowerCase() === 'sun') : null;
  const moon = Array.isArray(astroNatal?.planets) ? astroNatal.planets.find((p) => (p.name || '').toLowerCase() === 'moon') : null;
  if (sun && sun.sign) lines.push(`Sun: ${sun.sign}${sun.full_degree != null ? ` (${sun.full_degree}°)` : ''}`);
  if (moon && moon.sign) lines.push(`Moon: ${moon.sign}${moon.full_degree != null ? ` (${moon.full_degree}°)` : ''}`);
  if (astroNatal?.ascendant && astroNatal.ascendant.sign) lines.push(`Ascendant: ${astroNatal.ascendant.sign}`);
  lines.push('\nWrite a warm, personalized reading that blends numerology and astrology. Avoid generic lists; explain themes, strengths, growth areas, and practical guidance. Keep it concise yet insightful.');
  return lines.join('\n');
}

async function generateReading(req, res) {
  try {
    const { name, birthDateISO, place, latitude, longitude, timezone, year, month, date, hour, minute } = req.body;

    if (!birthDateISO && !(year && month && date)) {
      return res.status(400).json({ message: 'Provide birthDateISO or year/month/date' });
    }

    const birth = {
      date: date ?? new Date(birthDateISO).getUTCDate(),
      month: month ?? new Date(birthDateISO).getUTCMonth() + 1,
      year: year ?? new Date(birthDateISO).getUTCFullYear(),
      hour: hour ?? new Date(birthDateISO).getUTCHours(),
      minute: minute ?? new Date(birthDateISO).getUTCMinutes(),
      latitude,
      longitude,
      timezone: typeof timezone === 'number' ? timezone : 0,
      place
    };

    const astroNatal = await getComprehensiveNatal(birth);
    const destiny = calculateDestinyMatrix({ name, birthDateISO: birthDateISO || new Date(Date.UTC(birth.year, birth.month - 1, birth.date)).toISOString() });
    const prompt = await buildPrompt({ name, birth, astroNatal, destiny });

    // Use Gemini instead of OpenAI
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: 'You are an expert astrologer and numerologist. Be empathetic, specific, and practical.'
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
      }
    });

    const aiText = result.response.text();

    const readingDoc = await Reading.create({
      userId: req.user?._id,
      name,
      birth,
      astroNatal,
      destinyMatrix: destiny,
      promptContext: { prompt },
      aiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      aiResponse: aiText
    });

    return res.json({
      message: 'Reading generated successfully',
      reading: readingDoc
    });
  } catch (err) {
    console.error('generateReading error:', err.message);
    return res.status(500).json({ message: 'Failed to generate reading', error: err.message });
  }
}

async function interpretDream(req, res) {
  try {
    const { dreamText, context } = req.body;
    if (!dreamText) return res.status(400).json({ message: 'dreamText is required' });
    
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest',
      systemInstruction: 'You are a compassionate dream interpreter who blends Jungian symbolism with astrology and spiritual insight. Offer gentle, practical guidance.'
    });

    const userPrompt = `Dream: ${dreamText}\n\nContext: ${JSON.stringify(context || {}, null, 2)}`;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.8,
      }
    });

    const text = result.response.text();
    res.json({ message: 'OK', interpretation: text });
  } catch (err) {
    console.error('interpretDream error:', err.message);
    res.status(500).json({ message: 'Failed to interpret dream', error: err.message });
  }
}

async function pastLifeReading(req, res) {
  try {
    const { natal, notes } = req.body;
    
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: 'You are an expert astrologer focusing on karmic themes. Use South Node, Saturn, 12th house, Pluto and aspects to infer past-life patterns. Be grounded and empowering.'
    });

    const prompt = `Natal (JSON): ${JSON.stringify(natal || {}, null, 2)}\n\nNotes: ${notes || ''}\n\nGenerate a concise past-life reading and practical integration steps.`;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    const text = result.response.text();
    res.json({ message: 'OK', reading: text });
  } catch (err) {
    console.error('pastLifeReading error:', err.message);
    res.status(500).json({ message: 'Failed to generate past life reading', error: err.message });
  }
}

async function generalChat(req, res) {
  try {
    const { message } = req.body;
    const user = req.user; // User data from auth middleware

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Build context with user's birth information
    let userContext = `User Profile:
Name: ${user.name || 'Unknown'}
Email: ${user.email || 'Unknown'}`;

    if (user.birth) {
      userContext += `
Birth Information:
- Date: ${user.birth.year}-${String(user.birth.month).padStart(2, '0')}-${String(user.birth.date).padStart(2, '0')}
- Time: ${String(user.birth.hour || 0).padStart(2, '0')}:${String(user.birth.minute || 0).padStart(2, '0')}
- Location: ${user.birth.place || 'Unknown'}
- Coordinates: ${user.birth.latitude || 'N/A'}, ${user.birth.longitude || 'N/A'}
- Timezone: UTC${user.birth.timezone >= 0 ? '+' : ''}${user.birth.timezone || 0}`;
    } else {
      userContext += `
Birth Information: Not provided yet`;
    }

    const systemInstruction = `You are the Hora Oracle, an expert astrologer, numerologist, and spiritual guide. You have access to the user's birth information and can provide personalized insights about their Natal Chart, Human Design, Destiny Matrix, dreams, and karmic patterns.

Be warm, mystical, insightful, and personalized. Use their actual birth data when relevant. If they ask about topics requiring their birth info and it's available, incorporate it naturally. If birth info is missing, gently ask for it.

Keep responses conversational, mystical, and under 100 words unless more detail is specifically requested.`;

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: systemInstruction
    });

    const fullPrompt = `${userContext}

User's Question: ${message}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.8,
      }
    });

    const aiResponse = result.response.text();

    res.json({ 
      message: 'OK', 
      response: aiResponse,
      hasUserData: !!user.birth 
    });

  } catch (err) {
    console.error('generalChat error:', err.message);
    res.status(500).json({ 
      message: 'Failed to process chat', 
      error: err.message 
    });
  }
}

module.exports = { 
  generateReading, 
  interpretDream, 
  pastLifeReading,
  generalChat
};