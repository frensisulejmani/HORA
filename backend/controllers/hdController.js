const { getNatalBasics } = require('../utils/astroAPI');
const {
  getPlanetaryActivations,
  getDefinedCenters,
  getActivatedChannels,
  getGatesInCenters,
  getAllGatesByCenter,
  gateOrder,
  harmonicGate
} = require('../utils/hdkit-calculations');

function toPartsFromISO(iso) {
  const d = new Date(iso);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    date: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes()
  };
}

function normalizeBirth({ birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place }) {
  let isoUTC = birthDateISO;
  if (!isoUTC) {
    isoUTC = new Date(Date.UTC(year, (month || 1) - 1, date || 1, hour || 0, minute || 0)).toISOString();
  }
  const parts = toPartsFromISO(isoUTC);
  return {
    isoUTC,
    birth: {
      ...parts,
      latitude,
      longitude,
      timezone: typeof timezone === 'number' ? timezone : 0,
      place
    }
  };
}

async function computeHumanDesign(req, res) {
  console.log('computeHumanDesign called with body:', req.body);
  try {
    // If the user is authenticated and has birth data stored, use that as defaults
    let {
      birthDateISO,
      year,
      month,
      date,
      hour,
      minute,
      latitude,
      longitude,
      timezone,
      place
    } = req.body || {};

    // debug
    console.log('computeHumanDesign called. body:', { birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place });
    if (req.user && req.user.birth) console.log('user birth stored:', req.user.birth);

    if (req.user && req.user.birth) {
      const b = req.user.birth;
      // compute ISO if not provided
      if (!birthDateISO && b.year && b.month && b.date) {
        birthDateISO = new Date(Date.UTC(b.year, (b.month || 1) - 1, b.date || 1, b.hour || 0, b.minute || 0)).toISOString();
      }
      // Only override individual fields if missing
      year = year || b.year;
      month = month || b.month;
      date = date || b.date;
      hour = hour || b.hour;
      minute = minute || b.minute;
      latitude = latitude || b.latitude;
      longitude = longitude || b.longitude;
      timezone = timezone || b.timezone;
      place = place || b.place;
    }

    // validate values exist now
    if (!(birthDateISO || (year && month && date))) {
      // no birth info supplied – send base map containing all gate numbers
      // note: even if user is authenticated and missing birth data, we still return
      // a blueprint rather than an error so the frontend always has something to render.
      if (req.user && (!year || !month || !date)) {
        console.log('User authenticated but no birth data; returning static blueprint.');
      }
      const allGatesByCenter = getAllGatesByCenter();
      const definedCenters = Object.fromEntries(
        Object.keys(allGatesByCenter).map(c => [c, true])
      );
      return res.json({
        message: 'OK',
        birth: null,
        isoUTC: null,
        designISO: null,
        personality: {},
        design: {},
        definedCenters,
        activatedChannels: [],
        gatesInCenters: allGatesByCenter,
        allGatesByCenter,
        type: null,
        typeDescription: null,
        authority: null,
        authorityDescription: null,
        profile: null,
        profileDescription: null
      });
    }

    const norm = normalizeBirth({ birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place });

    const birthISO = norm.isoUTC;
    const birth = norm.birth;
    // ensure minimal defaults for API
    birth.hour = birth.hour || 0;
    birth.minute = birth.minute || 0;
    birth.latitude = birth.latitude || 0;
    birth.longitude = birth.longitude || 0;
    birth.timezone = typeof birth.timezone === 'number' ? birth.timezone : 0;

    // Design date ≈ 88 days before birth (approximation of 88° solar arc)
    const designDate = new Date(birthISO);
    designDate.setUTCDate(designDate.getUTCDate() - 88);
    const designParts = toPartsFromISO(designDate.toISOString());

    // Use getNatalBasics instead of getComprehensiveNatal for faster response
    // Human Design doesn't need all the comprehensive data
    let personality, design;
    try {
      [personality, design] = await Promise.all([
        getNatalBasics({
          year: birth.year,
          month: birth.month,
          date: birth.date,
          hour: birth.hour,
          minute: birth.minute,
          latitude: birth.latitude,
          longitude: birth.longitude,
          timezone: birth.timezone
        }),
        getNatalBasics({
          year: designParts.year,
          month: designParts.month,
          date: designParts.date,
          hour: designParts.hour,
          minute: designParts.minute,
          latitude: birth.latitude,
          longitude: birth.longitude,
          timezone: birth.timezone
        })
      ]);
    } catch (apiErr) {
      console.error('Natal API error, falling back to static blueprint:', apiErr);
      const allGatesByCenter = getAllGatesByCenter();
      const definedCenters = Object.fromEntries(
        Object.keys(allGatesByCenter).map(c => [c, true])
      );
      return res.json({
        message: 'OK',
        birth,
        isoUTC: birthISO,
        designISO: designDate.toISOString(),
        personality: {},
        design: {},
        definedCenters,
        activatedChannels: [],
        gatesInCenters: allGatesByCenter,
        allGatesByCenter,
        type: null,
        typeDescription: null,
        authority: null,
        authorityDescription: null,
        profile: null,
        profileDescription: null,
        error: apiErr.message
      });
    }

    // Calculate proper planetary activations using hdkit
    const personalityActivations = getPlanetaryActivations(personality);
    const designActivations = getPlanetaryActivations(design);

    // Determine defined centers from channel activations
    const definedCenters = getDefinedCenters(personalityActivations, designActivations);
    const activatedChannels = getActivatedChannels(personalityActivations, designActivations);
    const gatesInCenters = getGatesInCenters(personalityActivations, designActivations);
    const allGatesByCenter = getAllGatesByCenter();

    // Extract Human Design information
    const hdType = determineHDType(personalityActivations, designActivations, definedCenters);
    const hdAuthority = determineHDAuthority(personalityActivations, designActivations, definedCenters);
    const hdProfile = determineHDProfile(personalityActivations, designActivations);

    // Map type → strategy so the frontend can display
    const hdStrategy = getHDStrategy(hdType);

    // Very lightweight “Incarnation Cross” label based on Sun/Earth gates.
    // This avoids returning a generic placeholder and at least ties the text to the actual design.
    const hdIncarnationCross = buildIncarnationCrossLabel(personalityActivations, designActivations);
    
    return res.json({
      message: 'OK',
      birth,
      isoUTC: birthISO,
      designISO: designDate.toISOString(),
      personality: personalityActivations,
      design: designActivations,
      definedCenters,
      activatedChannels,
      gatesInCenters,
      allGatesByCenter,
      type: hdType,
      typeDescription: getHDTypeDescription(hdType),
      authority: hdAuthority,
      authorityDescription: getHDAuthorityDescription(hdAuthority),
      profile: hdProfile,
      profileDescription: getHDProfileDescription(hdProfile),
      strategy: hdStrategy,
      incarnationCross: hdIncarnationCross
    });
  } catch (err) {
    console.error('computeHumanDesign error:', err);
    // return static blueprint instead of error
    const allGatesByCenter = getAllGatesByCenter();
    const definedCenters = Object.fromEntries(
      Object.keys(allGatesByCenter).map(c => [c, true])
    );
    return res.json({
      message: 'OK',
      birth: null,
      isoUTC: null,
      designISO: null,
      personality: {},
      design: {},
      definedCenters,
      activatedChannels: [],
      gatesInCenters: allGatesByCenter,
      allGatesByCenter,
      type: null,
      typeDescription: null,
      authority: null,
      authorityDescription: null,
      profile: null,
      profileDescription: null,
      error: err.message
    });
  }
}

// Helper functions for Human Design
function determineHDType(personalityActivations, designActivations, definedCenters) {
  // HD Type is determined by whether Sacral is defined (Generator) or Sacral + Ego (Manifesting Generator)
  // Or whether only Motor centers are defined (Manifestor) vs. Motor + Response (Projector/Reflector)
  
  const sacralDefined = definedCenters.Sacral;
  const egoMotorDefined = definedCenters.Ego;
  
  // Check for response (Ajna or Throat connection to motors)
  const hasResponse = definedCenters.Throat;

  if (sacralDefined && egoMotorDefined) {
    return 'Manifesting Generator';
  } else if (sacralDefined) {
    return 'Generator';
  } else if (egoMotorDefined && !hasResponse) {
    return 'Manifestor';
  } else if (!hasResponse) {
    return 'Reflector';
  } else {
    return 'Projector';
  }
}

function determineHDAuthority(personalityActivations, designActivations, definedCenters) {
  // Authority is determined by which center is defined for decision-making
  // Order of precedence: Emotional (Solar Plexus) > Sacral > Splenic > Ego > Self-Projected > Mental > Lunar
  
  if (definedCenters.SolarPlexus) return 'Emotional (Solar Plexus)';
  if (definedCenters.Sacral) return 'Sacral';
  if (definedCenters.Spleen) return 'Splenic';
  if (definedCenters.Ego) return 'Ego';
  if (definedCenters.Head) return 'Mental';
  
  return 'Lunar';
}

function determineHDProfile(personalityActivations, designActivations) {
  // Profile determined by Sun's gate line in personality (1st #) and design (2nd #)
  // 6 lines per gate = 64 * 6 = 384 total positions
  
  const sunPersonality = personalityActivations.Sun;
  const sunDesign = designActivations.Sun;
  
  if (!sunPersonality || !sunDesign) return '1 / 3';
  
  const personalityLine = sunPersonality.line || 1;
  const designLine = sunDesign.line || 1;
  
  return `${personalityLine} / ${designLine}`;
}

function getHDTypeDescription(type) {
  const descriptions = {
    'Manifesting Generator': 'You are designed to respond to life before taking action, using your sustainable energy to master multiple crafts.',
    'Generator': 'You are designed to respond to life and have sustainable energy to master your craft.',
    'Manifestor': 'You are designed to initiate and inform others before taking action.',
    'Projector': 'You are designed to guide others and wait for invitations.',
    'Reflector': 'You are designed to reflect the health of your community and sample life.'
  };
  return descriptions[type] || 'Your Human Design type reveals your unique energy configuration.';
}

function getHDAuthorityDescription(authority) {
  const descriptions = {
    'Emotional (Solar Plexus)': 'There is no truth in the now. Wait for your emotional wave to settle before making major decisions.',
    'Sacral': 'Listen to your gut responses - your body knows what is correct for you.',
    'Splenic': 'Trust your immediate intuitive knowing in the moment.',
    'Ego': 'Follow your heart and what you are passionate about.',
    'Self-Projected': 'Speak your truth and listen to your own voice.',
    'Mental-Projected': 'Wait for clarity and outer authority to guide you.',
    'Lunar': 'Wait a full lunar cycle (28 days) before making major decisions.'
  };
  return descriptions[authority] || 'Your authority guides your decision-making process.';
}

function getHDProfileDescription(profile) {
  const descriptions = {
    '4 / 6': 'The Opportunist Role Model. Your influence moves through your network and your wisdom matures after age 30.',
    '1 / 3': 'The Investigator Martyr. You investigate deeply and learn through trial and error.',
    '2 / 4': 'The Hermit Opportunist. You are a natural at what you do and influence through your network.',
    '3 / 5': 'The Martyr Heretic. You experiment and learn through experience, becoming a role model.',
    '4 / 1': 'The Opportunist Investigator. You influence through your network and investigate deeply.',
    '5 / 1': 'The Heretic Investigator. You project solutions and investigate deeply.',
    '6 / 2': 'The Role Model Hermit. Your wisdom matures after age 30 and you are naturally gifted.',
    '6 / 3': 'The Role Model Martyr. Your wisdom matures after age 30 and you learn through experience.'
  };
  return descriptions[profile] || 'Your profile reveals your role and life purpose.';
}

// Strategy mapping derived from the five classic Aura types.
function getHDStrategy(type) {
  const map = {
    'Manifesting Generator': 'To respond first, then inform before you initiate.',
    'Generator': 'To respond to life rather than initiate from the mind.',
    'Manifestor': 'To inform those impacted before you initiate action.',
    'Projector': 'To wait for recognition and the correct invitations.',
    'Reflector': 'To wait through a full lunar cycle before major decisions.'
  };
  return map[type] || 'Follow your body’s signals rather than mental pressure.';
}

// Build a simple, data‑driven Incarnation Cross label using Sun/Earth gates.
function buildIncarnationCrossLabel(personalityActivations, designActivations) {
  const pSun = personalityActivations.Sun;
  const pEarth = personalityActivations.Earth;
  const dSun = designActivations.Sun;
  const dEarth = designActivations.Earth;

  if (!pSun || !pEarth || !dSun || !dEarth) {
    return null;
  }

  const format = (act) => (act.gate ? `${act.gate}.${act.line || 1}` : null);
  const pSunLabel = format(pSun);
  const pEarthLabel = format(pEarth);
  const dSunLabel = format(dSun);
  const dEarthLabel = format(dEarth);

  if (!pSunLabel || !pEarthLabel || !dSunLabel || !dEarthLabel) {
    return null;
  }

  return `Cross of ${pSunLabel}/${pEarthLabel} & ${dSunLabel}/${dEarthLabel}`;
}

module.exports = { computeHumanDesign };