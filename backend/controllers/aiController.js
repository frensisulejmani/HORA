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

    // Build context with user's birth information and pre-calculated systems
    let userContext = `User Profile:
Name: ${user?.name || 'Unknown'}
Email: ${user?.email || 'Unknown'}`;

    let astroSummary = '';
    let destinySummary = '';
    let astrocartographySummary = '';

    if (user?.birth && user.birth.year && user.birth.month && user.birth.date) {
      const birth = {
        date: user.birth.date,
        month: user.birth.month,
        year: user.birth.year,
        hour: user.birth.hour || 0,
        minute: user.birth.minute || 0,
        latitude: user.birth.latitude || 0,
        longitude: user.birth.longitude || 0,
        timezone: typeof user.birth.timezone === 'number' ? user.birth.timezone : 0,
        place: user.birth.place || ''
      };

      userContext += `
Birth Information:
- Date: ${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.date).padStart(2, '0')}
- Time: ${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}
- Location: ${birth.place || 'Unknown'}
- Coordinates: ${birth.latitude}, ${birth.longitude}
- Timezone: UTC${birth.timezone >= 0 ? '+' : ''}${birth.timezone}`;

      // Derive natal + destiny context once so the model can reuse it
      try {
        const [astroNatal, destiny] = await Promise.all([
          getComprehensiveNatal(birth),
          calculateDestinyMatrix({
            name: user.name,
            birthDateISO: new Date(Date.UTC(birth.year, birth.month - 1, birth.date)).toISOString()
          })
        ]);

        if (astroNatal) {
          const sun = Array.isArray(astroNatal.planets)
            ? astroNatal.planets.find((p) => (p.name || '').toLowerCase() === 'sun')
            : null;
          const moon = Array.isArray(astroNatal.planets)
            ? astroNatal.planets.find((p) => (p.name || '').toLowerCase() === 'moon')
            : null;
          const asc = astroNatal.ascendant;

          astroSummary = `Natal Snapshot:
- Sun: ${sun?.sign || 'Unknown'}
- Moon: ${moon?.sign || 'Unknown'}
- Ascendant: ${asc?.sign || 'Unknown'}`;
        }

        if (destiny) {
          destinySummary = `Destiny Matrix:
- Life Path: ${destiny.lifePathNumber}
- Expression: ${destiny.expressionNumber || 'N/A'}
- Soul Urge: ${destiny.soulUrgeNumber || 'N/A'}`;
        }

        // Very light astrocartography hint: which signs are emphasized by planets on angles
        if (astroNatal && Array.isArray(astroNatal.planets)) {
          const strongPlanets = astroNatal.planets
            .filter((p) => p.house === 1 || p.house === 4 || p.house === 7 || p.house === 10)
            .slice(0, 5)
            .map((p) => `${p.name} in ${p.sign} (House ${p.house})`);
          if (strongPlanets.length > 0) {
            astrocartographySummary = `Astrocartography Hint:
Key angular planets: ${strongPlanets.join(', ')}. Favor regions that resonate with these line energies.`;
          }
        }
      } catch (calcErr) {
        console.warn('generalChat: failed to precompute natal/destiny context:', calcErr.message);
      }
    } else {
      userContext += `
Birth Information: Not provided yet`;
    }

    const systemInstruction = `You are the Hora Oracle, an expert astrologer, numerologist, and astrocartographer.

You always base your answers on the user's stored birth data and the derived systems below when relevant:
- Natal chart (signs, houses, angles)
- Destiny Matrix numerology (life path, expression, soul urge)
- Astrocartography emphasis (planets on angles by sign/house)

If the user asks about their natal chart, astrocartography, or destiny matrix, answer using these calculated values instead of asking for birth data again. Only ask for birth details if none are available.

Be warm, mystical, insightful, and personalized. Keep responses under 120 words unless the user explicitly requests more depth.`;

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction
    });

    const fullPrompt = `${userContext}

${astroSummary ? `${astroSummary}\n` : ''}${destinySummary ? `${destinySummary}\n` : ''}${astrocartographySummary ? `${astrocartographySummary}\n` : ''}

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
      hasUserData: !!user?.birth 
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