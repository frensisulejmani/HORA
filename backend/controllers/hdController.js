const { getNatalBasics } = require('../utils/astroAPI');
const {
  getPlanetaryActivations,
  getDefinedCenters,
  getActivatedChannels,
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
  try {
    const { birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place } = req.body;
    const norm = normalizeBirth({ birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place });

    const birthISO = norm.isoUTC;
    const birth = norm.birth;

    // Design date ≈ 88 days before birth (approximation of 88° solar arc)
    const designDate = new Date(birthISO);
    designDate.setUTCDate(designDate.getUTCDate() - 88);
    const designParts = toPartsFromISO(designDate.toISOString());

    // Use getNatalBasics instead of getComprehensiveNatal for faster response
    // Human Design doesn't need all the comprehensive data
    const [personality, design] = await Promise.all([
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

    // Calculate proper planetary activations using hdkit
    const personalityActivations = getPlanetaryActivations(personality);
    const designActivations = getPlanetaryActivations(design);

    // Determine defined centers from channel activations
    const definedCenters = getDefinedCenters(personalityActivations, designActivations);
    const activatedChannels = getActivatedChannels(personalityActivations, designActivations);

    // Extract Human Design information
    const hdType = determineHDType(personalityActivations, designActivations, definedCenters);
    const hdAuthority = determineHDAuthority(personalityActivations, designActivations, definedCenters);
    const hdProfile = determineHDProfile(personalityActivations, designActivations);
    
    return res.json({
      message: 'OK',
      birth,
      isoUTC: birthISO,
      designISO: designDate.toISOString(),
      personality: personalityActivations,
      design: designActivations,
      definedCenters,
      activatedChannels,
      type: hdType,
      typeDescription: getHDTypeDescription(hdType),
      authority: hdAuthority,
      authorityDescription: getHDAuthorityDescription(hdAuthority),
      profile: hdProfile,
      profileDescription: getHDProfileDescription(hdProfile)
    });
  } catch (err) {
    console.error('computeHumanDesign error:', err.message);
    return res.status(500).json({ message: 'Human Design error', error: err.message });
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

module.exports = { computeHumanDesign };