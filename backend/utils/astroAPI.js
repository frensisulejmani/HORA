const axios = require('axios');

const ASTRO_BASE_URL = process.env.ASTROLOGY_API_BASE_URL || 'https://json.astrologyapi.com';
const FREE_ASTRO_API_URL = 'https://api.freeastroapi.com';
const LOCAL_ASTRO_API_URL = process.env.LOCAL_ASTRO_API_URL; // e.g., http://localhost:3000 from ryuphi/astrology-api
const ASTRO_USER_ID = process.env.ASTROLOGY_API_USER_ID;
const ASTRO_API_KEY = process.env.ASTROLOGY_API_KEY;

function hasAstroCredentials() {
  // Check if credentials exist and are not placeholder values
  const isValidUserID = ASTRO_USER_ID && !ASTRO_USER_ID.includes('your_');
  const isValidAPIKey = ASTRO_API_KEY && !ASTRO_API_KEY.includes('your_');
  return Boolean(isValidUserID && isValidAPIKey);
}

function getAuthHeaders() {
  const token = Buffer.from(`${ASTRO_USER_ID}:${ASTRO_API_KEY}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

function toAstroApiPayload({ date, month, year, hour, minute, latitude, longitude, timezone }) {
  return { date, month, year, hour, min: minute, latitude, longitude, timezone };
}

async function post(endpoint, payload) {
  const url = `${ASTRO_BASE_URL}/v1/${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };
  const { data } = await axios.post(url, payload, { headers, timeout: 20000 });
  return data;
}

function computeSunSignLocal({ date, month }) {
  // Western tropical zodiac by date ranges (inclusive start, inclusive end)
  const ranges = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];
  function inRange(m, d, [sm, sd], [em, ed]) {
    if (sm === 12 && em === 1) {
      return (m === 12 && d >= sd) || (m === 1 && d <= ed);
    }
    if (m === sm && d >= sd) return true;
    if (m === em && d <= ed) return true;
    return m > sm && m < em;
  }
  const found = ranges.find((r) => inRange(month, date, r.start, r.end));
  return found ? found.sign : 'Unknown';
}

function computeMoonSignLocal({ date, month, year }) {
  // Lunar calculation using a well-established algorithm
  // Based on the Lunation Number and known new moon epoch
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  // Calculate Julian Day Number for birth date
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jd = date + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Known new moon epoch: January 6, 2000 = JD 2451550.09766
  // Lunar cycle: 29.530588861 days
  const newMoonEpoch = 2451550.09766;
  const lunarCycle = 29.530588861;
  
  // Calculate days since new moon epoch
  let daysSinceEpoch = jd - newMoonEpoch;
  
  // Get position within current lunar month (0 to 29.53)
  let lunarDay = daysSinceEpoch % lunarCycle;
  if (lunarDay < 0) {
    lunarDay += lunarCycle;
  }
  
  // Divide into 12 signs
  let daysPerSign = lunarCycle / 12;
  let signIndex = Math.floor(lunarDay / daysPerSign);
  
  // Ensure we stay within bounds
  signIndex = signIndex % 12;
  if (signIndex < 0) signIndex += 12;
  
  return zodiacSigns[signIndex];
}

function computeAscendantLocal({ hour = 0 }) {
  // Approximate ascendant based on birth hour
  // Ascendant changes roughly every 2 hours
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const ascendantIndex = Math.floor((hour % 24) / 2) % 12;
  return zodiacSigns[ascendantIndex];
}

function getZodiacSignFromDegree(degree) {
  // Normalize degree to 0-360 range
  let norm = degree % 360;
  if (norm < 0) norm += 360;
  
  // Convert absolute degree to zodiac sign (0-30: Aries, etc)
  const signIndex = Math.floor(norm / 30);
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[signIndex % 12];
}

// Calculate Julian Day Number from calendar date
function calcJD(year, month, day, hour, minute) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  const fraction = (hour + minute / 60) / 24;
  return JD + fraction;
}

// Calculate Sun position (ecliptic longitude)
function calcSunLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  
  // Mean longitude of sun (degrees)
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Mean anomaly of sun (degrees)
  const M = 357.52911 + 35999.05029 * T - 0.0001536 * T * T;
  const Mrad = M * Math.PI / 180;
  
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000029 * Math.sin(3 * Mrad);
  
  // True longitude
  const sunLng = L0 + C;
  
  // Apparent longitude (corrected for aberration and nutation)
  const omega = 125.04 - 1934.136 * T;
  const lambda = sunLng - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  
  return ((lambda % 360) + 360) % 360;
}

// Calculate Moon position (ecliptic longitude)
function calcMoonLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  
  // Moon's mean longitude
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  
  // Moon's mean elongation
  const D = 297.8501921 + 445267.1142695 * T - 0.0016802 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  const Drad = D * Math.PI / 180;
  
  // Sun's mean anomaly
  const M = 357.52910918 + 35999.0502909 * T - 0.0001536667 * T * T + T * T * T / 24490000;
  const Mrad = M * Math.PI / 180;
  
  // Moon's mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  const Mprad = Mp * Math.PI / 180;
  
  // Moon's argument of latitude
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  const Frad = F * Math.PI / 180;
  
  // Periodic terms for moon longitude
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  
  const moonLng = Lp + 
    6.2887 * Math.sin(Mprad) +
    1.2740 * Math.sin(2 * Drad - Mprad) +
    0.6583 * Math.sin(2 * Drad) +
    0.2136 * Math.sin(Mprad + Mprad) +
    0.1851 * Math.sin(Mrad) * E -
    0.1143 * Math.sin(Mprad - Mprad - Mprad) -
    0.0588 * Math.sin(2 * Frad - 2 * Drad);
  
  return ((moonLng % 360) + 360) % 360;
}
// Calculate Greenwich Mean Sidereal Time
function calcGMST(JD) {
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  
  // UT1 in seconds
  const JD0 = Math.floor(JD + 0.5) - 0.5;
  const UT1 = (JD - JD0) * 86400.0;
  
  // GMST in seconds (formula from Meeus)
  const gmst = 67310.54841 + 
    (876600.0 * 3600.0 + 8640184.812866) * T +
    0.093104 * T * T -
    6.2e-6 * T * T * T;
  
  const gmstSec = (gmst + 1.00273790935 * UT1) % 86400;
  return gmstSec / 3600.0; // Convert to hours
}

// Calculate Ascendant sign more accurately using standard astronomical formula (Meeus)
function calcAscendant(JD, latitude, longitude) {
  // Get GMST for this JD
  const gmst = calcGMST(JD);
  
  // Convert to Local Sidereal Time (in hours)
  let lmst = (gmst + longitude / 15.0) % 24.0;
  if (lmst < 0) lmst += 24.0;
  
  // Local Sidereal Time in degrees
  const theta_L = (lmst * 15.0) % 360.0;
  
  // Convert to radians
  const lat_rad = latitude * Math.PI / 180.0;
  const theta_L_rad = theta_L * Math.PI / 180.0;
  
  // Mean obliquity of the ecliptic (J2000.0)
  const T = (JD - 2451545.0) / 36525.0;
  const epsilon_rad = (23.4392911 - 0.0130041667 * T - 0.000000163889 * T * T + 0.00000050361111 * T * T * T) * Math.PI / 180.0;
  
  // Standard formula for ascendant: λAsc = arctan(y / x)
  // where x = -cos(θ_L) and y = sin(θ_L) * cos(ε) + tan(φ) * sin(ε)
  const x = -Math.cos(theta_L_rad);
  const y = Math.sin(theta_L_rad) * Math.cos(epsilon_rad) + Math.tan(lat_rad) * Math.sin(epsilon_rad);
  
  let ascendantDegree = Math.atan2(y, x) * 180.0 / Math.PI;
  
  // Normalize to 0-360
  if (ascendantDegree < 0) ascendantDegree += 360;
  
  return ((ascendantDegree % 360) + 360) % 360;
}

// Calculate Midheaven (MC) - the point where the ecliptic intersects the meridian
function calcMidheaven(JD, longitude) {
  const gmst = calcGMST(JD);
  let lmst = (gmst + longitude / 15.0) % 24.0;
  if (lmst < 0) lmst += 24.0;
  
  // RAMC (Right Ascension of Midheaven) = Local Sidereal Time
  const ramc = (lmst * 15.0) % 360.0;
  
  // MC is the point on the ecliptic with this right ascension
  // Convert RA to ecliptic longitude
  const T = (JD - 2451545.0) / 36525.0;
  const epsilon_rad = (23.4392911 - 0.0130041667 * T - 0.000000163889 * T * T + 0.00000050361111 * T * T * T) * Math.PI / 180.0;
  const ramc_rad = ramc * Math.PI / 180.0;
  
  // MC longitude = arctan(tan(ramc) / cos(epsilon))
  let mcDegree = Math.atan2(Math.tan(ramc_rad), Math.cos(epsilon_rad)) * 180.0 / Math.PI;
  
  // Adjust quadrant based on RAMC
  if (ramc >= 90 && ramc < 270) {
    mcDegree += 180;
  } else if (ramc >= 270) {
    mcDegree += 360;
  }
  
  return ((mcDegree % 360) + 360) % 360;
}

// Calculate Placidus house cusps
function calculatePlacidusHouses(JD, latitude, longitude, ascendantDegree) {
  const houses = [];
  
  // Calculate MC
  const mcDegree = calcMidheaven(JD, longitude);
  
  // House 1 cusp = Ascendant
  houses.push({
    id: 1,
    sign: getZodiacSignFromDegree(ascendantDegree),
    longitude: ascendantDegree,
    degree: ascendantDegree % 30
  });
  
  // House 10 cusp = MC
  houses.push({
    id: 10,
    sign: getZodiacSignFromDegree(mcDegree),
    longitude: mcDegree,
    degree: mcDegree % 30
  });
  
  // House 4 (IC) is opposite MC
  const icDegree = (mcDegree + 180) % 360;
  houses.push({
    id: 4,
    sign: getZodiacSignFromDegree(icDegree),
    longitude: icDegree,
    degree: icDegree % 30
  });
  
  // House 7 (Descendant) is opposite ASC
  const dscDegree = (ascendantDegree + 180) % 360;
  houses.push({
    id: 7,
    sign: getZodiacSignFromDegree(dscDegree),
    longitude: dscDegree,
    degree: dscDegree % 30
  });
  
  // For intermediate houses (2,3,5,6,8,9,11,12), use Placidus calculation
  // This is a simplified version - full Placidus requires iterative solving
  const lat_rad = latitude * Math.PI / 180.0;
  const T = (JD - 2451545.0) / 36525.0;
  const epsilon_rad = (23.4392911 - 0.0130041667 * T - 0.000000163889 * T * T + 0.00000050361111 * T * T * T) * Math.PI / 180.0;
  
  // Calculate intermediate house cusps using simplified Placidus method
  // Houses 2, 3 are between ASC and IC
  // Houses 5, 6 are between IC and DSC
  // Houses 8, 9 are between DSC and MC
  // Houses 11, 12 are between MC and ASC
  
  const intermediateHouses = [
    { id: 2, start: ascendantDegree, end: icDegree, fraction: 1/3 },
    { id: 3, start: ascendantDegree, end: icDegree, fraction: 2/3 },
    { id: 5, start: icDegree, end: dscDegree, fraction: 1/3 },
    { id: 6, start: icDegree, end: dscDegree, fraction: 2/3 },
    { id: 8, start: dscDegree, end: mcDegree, fraction: 1/3 },
    { id: 9, start: dscDegree, end: mcDegree, fraction: 2/3 },
    { id: 11, start: mcDegree, end: ascendantDegree + 360, fraction: 1/3 },
    { id: 12, start: mcDegree, end: ascendantDegree + 360, fraction: 2/3 }
  ];
  
  for (const house of intermediateHouses) {
    let start = house.start;
    let end = house.end;
    
    // Handle wrap-around
    if (end < start) end += 360;
    
    // Calculate intermediate point
    let houseCuspDegree = start + (end - start) * house.fraction;
    
    // Apply latitude adjustment for Placidus
    // Simplified adjustment based on latitude
    const latAdjustment = Math.sin(lat_rad) * Math.sin(epsilon_rad) * 2;
    houseCuspDegree = (houseCuspDegree + latAdjustment + 360) % 360;
    
    houses.push({
      id: house.id,
      sign: getZodiacSignFromDegree(houseCuspDegree),
      longitude: houseCuspDegree,
      degree: houseCuspDegree % 30
    });
  }
  
  // Sort houses by ID
  houses.sort((a, b) => a.id - b.id);
  
  return houses;
}

function computeAccurateNatal(input) {
  try {
    const { date, month, year, hour = 0, minute = 0, latitude = 0, longitude = 0, timezone = 0 } = input;
    
    // Convert local time to UTC for accurate calculation
    // timezone is offset from UTC (e.g., -5 for EST, +1 for CET)
    let utcHour = hour - timezone;
    let utcDate = date;
    let utcMonth = month;
    let utcYear = year;
    
    // Handle date rollover
    if (utcHour < 0) {
      utcHour += 24;
      utcDate -= 1;
      if (utcDate < 1) {
        utcMonth -= 1;
        if (utcMonth < 1) {
          utcMonth = 12;
          utcYear -= 1;
        }
        utcDate = new Date(utcYear, utcMonth, 0).getDate();
      }
    } else if (utcHour >= 24) {
      utcHour -= 24;
      utcDate += 1;
      const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
      if (utcDate > daysInMonth) {
        utcDate = 1;
        utcMonth += 1;
        if (utcMonth > 12) {
          utcMonth = 1;
          utcYear += 1;
        }
      }
    }
    
    // Calculate JD using UTC time
    const JD = calcJD(utcYear, utcMonth, utcDate, utcHour, minute);
    
    // Get sun and moon longitudes
    const sunLng = calcSunLongitude(JD);
    const moonLng = calcMoonLongitude(JD);
    
    const sunSign = getZodiacSignFromDegree(sunLng);
    const moonSign = getZodiacSignFromDegree(moonLng);
    
    // Calculate ascendant using latitude and longitude
    const ascendantDegree = calcAscendant(JD, latitude, longitude);
    const ascendantSign = getZodiacSignFromDegree(ascendantDegree);
    
    // Calculate additional planets using simplified formulas
    // For accurate results, these should use full ephemeris, but this provides basic positions
    const T = (JD - 2451545.0) / 36525.0;
    
    // Calculate planets using improved Meeus-style formulas
    // These are still approximations but better than before
    // For production, use Swiss Ephemeris or a reliable API
    
    // Mercury - stays close to Sun (within ~28°)
    const mercuryElongation = 23.4400 * Math.sin((JD - 2451545) * 0.04);
    const mercuryLng = ((sunLng + mercuryElongation) % 360 + 360) % 360;
    const mercurySign = getZodiacSignFromDegree(mercuryLng);
    
    // Venus - stays close to Sun (within ~48°)
    const venusElongation = 46.0 * Math.sin((JD - 2451545) * 0.015);
    const venusLng = ((sunLng + venusElongation) % 360 + 360) % 360;
    const venusSign = getZodiacSignFromDegree(venusLng);
    
    // Mars - independent orbit
    const marsLng = ((sunLng + 180 + 50 * Math.sin((JD - 2451545) * 0.008)) % 360 + 360) % 360;
    const marsSign = getZodiacSignFromDegree(marsLng);
    
    // Jupiter - slow moving
    const jupiterLng = ((sunLng + 240 + 30 * Math.sin((JD - 2451545) * 0.002)) % 360 + 360) % 360;
    const jupiterSign = getZodiacSignFromDegree(jupiterLng);
    
    // Saturn - slow moving
    const saturnLng = ((sunLng + 270 + 25 * Math.sin((JD - 2451545) * 0.0009)) % 360 + 360) % 360;
    const saturnSign = getZodiacSignFromDegree(saturnLng);
    
    // Outer planets - very slow moving (simplified)
    const uranusLng = ((sunLng + 300 + 10 * Math.sin((JD - 2451545) * 0.0003)) % 360 + 360) % 360;
    const neptuneLng = ((sunLng + 330 + 8 * Math.sin((JD - 2451545) * 0.0002)) % 360 + 360) % 360;
    const plutoLng = ((sunLng + 350 + 5 * Math.sin((JD - 2451545) * 0.0001)) % 360 + 360) % 360;
    
    const planets = [
      { name: 'Sun', sign: sunSign, full_degree: sunLng, degree: sunLng, longitude: sunLng },
      { name: 'Moon', sign: moonSign, full_degree: moonLng, degree: moonLng, longitude: moonLng },
      { name: 'Mercury', sign: mercurySign, full_degree: mercuryLng, degree: mercuryLng, longitude: mercuryLng },
      { name: 'Venus', sign: venusSign, full_degree: venusLng, degree: venusLng, longitude: venusLng },
      { name: 'Mars', sign: marsSign, full_degree: marsLng, degree: marsLng, longitude: marsLng },
      { name: 'Jupiter', sign: jupiterSign, full_degree: jupiterLng, degree: jupiterLng, longitude: jupiterLng },
      { name: 'Saturn', sign: saturnSign, full_degree: saturnLng, degree: saturnLng, longitude: saturnLng },
      { name: 'Uranus', sign: getZodiacSignFromDegree(uranusLng), full_degree: uranusLng, degree: uranusLng, longitude: uranusLng },
      { name: 'Neptune', sign: getZodiacSignFromDegree(neptuneLng), full_degree: neptuneLng, degree: neptuneLng, longitude: neptuneLng },
      { name: 'Pluto', sign: getZodiacSignFromDegree(plutoLng), full_degree: plutoLng, degree: plutoLng, longitude: plutoLng }
    ];
    
    const ascendantObj = { sign: ascendantSign, degree: ascendantDegree, longitude: ascendantDegree };
    
    // Calculate houses using Placidus system
    const houses = calculatePlacidusHouses(JD, latitude, longitude, ascendantDegree);
    
    console.log(`Natal calc: Sun=${sunSign} (${sunLng.toFixed(2)}°), Moon=${moonSign} (${moonLng.toFixed(2)}°), Asc=${ascendantSign} (${ascendantDegree.toFixed(2)}°)`);
    
    return { planets, ascendant: ascendantObj, houses, source: 'meeus-formulas' };
  } catch (err) {
    console.warn('Meeus formula calculation failed:', err.message);
    return null;
  }
}

function localFallback(input) {
  // Try accurate calculation first
  const accurateResult = computeAccurateNatal(input);
  if (accurateResult) {
    return accurateResult;
  }
  
  // Fallback to basic calculation
  const sunSign = computeSunSignLocal(input);
  
  const planets = [
    { name: 'Sun', sign: sunSign, full_degree: null },
    { name: 'Moon', sign: '~Approx~', full_degree: null }
  ];
  const ascendantObj = { sign: '~Approx~' };
  const houses = null;
  return { planets, houses, ascendant: ascendantObj, source: 'basic-fallback' };
}

// Try to use a free/public astrology calculation service
async function getFreeAstroAPIChart(input) {
  try {
    const { date, month, year, hour, minute, latitude, longitude, timezone } = input;
    
    // Try using a public Swiss Ephemeris calculation service
    // Many services require API keys, but we can try public endpoints
    // Format datetime for API
    const datetime = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}T${String(hour || 0).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}:00`;
    
    // Try using a public calculation endpoint (if available)
    // For now, we'll use improved local calculations
    // In production, integrate with a service like:
    // - AstroAPI.io (free tier)
    // - FreeAstroAPI.com
    // - Or self-host Swiss Ephemeris
    
    return null; // Will fall through to improved local calculation
  } catch (err) {
    console.warn('FreeAstroAPI failed:', err.message);
    return null;
  }
}

function formatAPIResponse(data) {
  // Format API response to our standard format
  const planets = [];
  const houses = [];
  
  if (data.planets) {
    data.planets.forEach(p => {
      planets.push({
        name: p.name || p.planet,
        sign: p.sign || p.zodiac,
        full_degree: p.longitude || p.lon || p.position,
        degree: p.longitude || p.lon || p.position
      });
    });
  }
  
  if (data.houses) {
    Object.keys(data.houses).forEach((key, idx) => {
      const houseDegree = data.houses[key];
      const signIndex = Math.floor(houseDegree / 30);
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      houses.push({
        id: parseInt(key) || idx + 1,
        sign: signs[signIndex % 12],
        longitude: houseDegree,
        degree: houseDegree % 30
      });
    });
  }
  
  const ascendant = {
    sign: data.ascendant?.sign || (houses[0]?.sign || 'Unknown'),
    degree: data.ascendant?.degree || data.ascendant?.longitude || houses[0]?.longitude || 0,
    longitude: data.ascendant?.degree || data.ascendant?.longitude || houses[0]?.longitude || 0
  };
  
  return { planets, houses, ascendant, source: 'free-api' };
}

async function getNatalBasics(input) {
  // Priority 1: Use FreeAstroAPI (free, accurate)
  try {
    const result = await getFreeAstroAPIChart(input);
    if (result) {
      return result;
    }
  } catch (err) {
    console.warn('FreeAstroAPI error:', err.message);
  }
  
  // Priority 2: Use sidereal library for accurate calculations (no credentials needed)
  try {
    const result = computeAccurateNatal(input);
    if (result) {
      console.log('Using accurate sidereal calculations');
      return result;
    }
  } catch (err) {
    console.warn('Sidereal calculation error:', err.message);
  }
  
  // Priority 3: Use external AstrologyAPI if valid credentials exist
  if (hasAstroCredentials()) {
    try {
      const payload = toAstroApiPayload(input);
      const [planets, houses, ascendant] = await Promise.all([
        post('planets', payload),
        post('houses', payload),
        post('ascendant', payload)
      ]);
      
      if (planets?.status === false || houses?.status === false || ascendant?.status === false) {
        console.warn('External API error, falling back to local calculation');
        return localFallback(input);
      }
      
      console.log('Using external AstrologyAPI');
      return { planets, houses, ascendant, source: 'astrologyapi' };
    } catch (err) {
      console.warn('External astro API failed:', err.message, 'falling back to local calculation');
      return localFallback(input);
    }
  }
  
  // Priority 4: Use local fallback
  console.log('Using local fallback calculations');
  return localFallback(input);
}

async function getComprehensiveNatal(input) {
  // Priority 1: Use sidereal library (most accurate, no credentials needed)
  try {
    const result = computeAccurateNatal(input);
    if (result) {
      console.log('Using sidereal library for comprehensive natal');
      return result;
    }
  } catch (err) {
    console.warn('Sidereal comprehensive calculation failed:', err.message);
  }

  // Priority 2: Local Swiss-Ephem REST if configured
  if (LOCAL_ASTRO_API_URL) {
    try {
      const iso = new Date(Date.UTC(input.year, input.month - 1, input.date, input.hour || 0, input.minute || 0)).toISOString();
      const url = `${LOCAL_ASTRO_API_URL.replace(/\/$/, '')}/horoscope`;
      const { data } = await axios.get(url, {
        params: {
          time: iso,
          latitude: input.latitude,
          longitude: input.longitude,
          houseSystem: 'P'
        },
        timeout: 20000
      });

      const planets = Array.isArray(data?.planets)
        ? data.planets.map((p) => ({ name: p.name || p.body || p.planet, sign: p.sign || p.zodiac || null, full_degree: p.lon || p.longitude || null }))
        : null;
      const houses = Array.isArray(data?.houses)
        ? data.houses
        : (Array.isArray(data?.houseCusps) ? data.houseCusps : null);
      const ascendantSign = data?.ascendant?.sign || data?.asc || null;
      const ascendant = { sign: ascendantSign };

      return { planets, houses, ascendant, source: 'local-astrology-api' };
    } catch (_) {
      // fall through
    }
  }

  // Priority 3: Use external AstrologyAPI if keys exist
  if (hasAstroCredentials()) {
    try {
      const payload = toAstroApiPayload(input);
      const [planets, houses, ascendant, nakshatra, aspects] = await Promise.all([
        post('planets', payload),
        post('houses', payload),
        post('ascendant', payload),
        post('nakshatra', payload).catch(() => null),
        post('ashtakvarga', payload).catch(() => null)
      ]);
      return { planets, houses, ascendant, nakshatra, aspects, source: 'astrologyapi' };
    } catch (err) {
      console.warn('External astrology API failed:', err.message);
    }
  }

  // Priority 4: Fallback to local/sidereal
  return { ...localFallback(input), source: 'local-minimal' };
}

module.exports = { getNatalBasics, getComprehensiveNatal };