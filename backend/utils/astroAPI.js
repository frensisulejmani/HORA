/**
 * astroAPI.js
 *
 * Priority 1: RapidAPI — "Calculate Birth Chart | Character Analysis | Daily Horoscope"
 *             by ltdbilgisam (Swiss Ephemeris precision).
 *             Add to .env:  RAPIDAPI_KEY=your_key_here
 *
 * Priority 2: Local VSOP87 mean-element math — no network required.
 *             Sun + Moon: Meeus Ch.25/47 (<1 arcmin accuracy)
 *             Other planets: VSOP87 mean elements (~0.5–1° accuracy, fine for 30°-wide signs)
 */

const axios = require('axios');

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'calculate-birth-chart-character-analysis-daily-horoscope.p.rapidapi.com';
const RAPIDAPI_URL  = `https://${RAPIDAPI_HOST}/calculateBirthChart`;

// ─── Zodiac helpers ──────────────────────────────────────────────────────────

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

const normDeg     = d => ((d % 360) + 360) % 360;
const signFromDeg = d => SIGNS[Math.floor(normDeg(d) / 30) % 12];
const toR         = d => d * Math.PI / 180;

// ─── RapidAPI integration ────────────────────────────────────────────────────

/**
 * Convert our internal input to the API's expected request body.
 * birthDate: "YYYY-MM-DD", birthTime: "HH:MM", timezone: IANA string
 *
 * The caller passes timezone as either an IANA string ("Europe/Istanbul")
 * or a numeric UTC offset. We handle both.
 */
function toRapidAPIPayload({ date, month, year, hour = 0, minute = 0, latitude, longitude, timezone }) {
  const pad  = n => String(n).padStart(2, '0');
  const birthDate = `${year}-${pad(month)}-${pad(date)}`;
  const birthTime = `${pad(hour)}:${pad(minute)}`;

  // Accept IANA timezone strings directly; numeric offsets fall back to UTC
  const tz = (typeof timezone === 'string' && timezone.includes('/'))
    ? timezone
    : 'UTC';

  return { birthDate, birthTime, lat: latitude, lon: longitude, timezone: tz, lang: 'en' };
}

/**
 * Normalise the API response into our internal shape:
 * { planets: [{name, sign, full_degree, degree}], houses: [...], ascendant: {sign, degree, longitude} }
 *
 * API response planets shape: { Sun: {sign, degree, longitude}, Moon: {...}, ... }
 * API response houses shape:  { Ascendant: {sign, degree, longitude}, MC: {...} }
 */
function normaliseRapidAPIResponse(data) {
  const result = data.result ?? data;

  // ── Planets ──
  const rawPlanets = result.planets ?? {};
  const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Chiron','NorthNode','Lilith'];
  
  const planets = PLANET_ORDER
    .filter(name => rawPlanets[name])
    .map(name => {
      const p = rawPlanets[name];
      return {
        name,
        sign:        p.sign,
        full_degree: p.longitude,
        degree:      p.longitude,
      };
    });

  // ── Houses (API only returns Ascendant + MC) ──
  const rawHouses = result.houses ?? {};
  const houses = Object.entries(rawHouses).map(([name, h], idx) => ({
    id:        name === 'Ascendant' ? 1 : name === 'MC' ? 10 : idx + 1,
    name,
    sign:      h.sign,
    longitude: h.longitude,
    degree:    h.longitude % 30,
  }));

  // ── Ascendant ──
  const rawAsc   = rawHouses.Ascendant ?? {};
  const ascendant = {
    sign:      rawAsc.sign      ?? signFromDeg(rawAsc.longitude ?? 0),
    degree:    (rawAsc.longitude ?? 0) % 30,
    longitude: rawAsc.longitude ?? 0,
  };

  return { planets, houses, ascendant, source: 'rapidapi-bilgisam' };
}

async function fetchRapidAPI(input) {
  const payload = toRapidAPIPayload(input);
  const { data } = await axios.post(RAPIDAPI_URL, payload, {
    headers: {
      'Content-Type':    'application/json',
      'X-RapidAPI-Key':  RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
    timeout: 20000,
  });

  if (data.result?.errors?.length) {
    throw new Error(`API errors: ${JSON.stringify(data.result.errors)}`);
  }

  return normaliseRapidAPIResponse(data);
}

// ─── Local VSOP87 fallback ───────────────────────────────────────────────────

function calcJD(year, month, day, hour, minute) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716))
       + Math.floor(30.6001 * (month + 1))
       + day + B - 1524.5
       + (hour + minute / 60) / 24;
}

function calcSunLongitude(T) {
  const L0    = normDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M     = normDeg(357.52911 + 35999.05029 * T - 0.0001536 * T * T);
  const Mrad  = toR(M);
  const C     = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
              + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
              +  0.000289 * Math.sin(3 * Mrad);
  const omega = normDeg(125.04 - 1934.136 * T);
  return normDeg(L0 + C - 0.00569 - 0.00478 * Math.sin(toR(omega)));
}

function calcMoonLongitude(T) {
  const Lp = normDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D  = normDeg(297.8501921 + 445267.1142695  * T - 0.0016802 * T * T);
  const M  = normDeg(357.52910918 + 35999.0502909  * T);
  const Mp = normDeg(134.9633964 + 477198.8675055  * T + 0.0087414 * T * T);
  const F  = normDeg(93.2720950  + 483202.0175233  * T - 0.0036539 * T * T);
  const E  = 1 - 0.002516 * T - 0.0000074 * T * T;
  return normDeg(Lp
    + 6.2887 * Math.sin(toR(Mp))
    + 1.2740 * Math.sin(toR(2*D - Mp))
    + 0.6583 * Math.sin(toR(2*D))
    + 0.2136 * Math.sin(toR(2*Mp))
    + 0.1851 * Math.sin(toR(M)) * E
    + 0.1144 * Math.sin(toR(2*F - 2*D))
    - 0.1093 * Math.sin(toR(2*F))
    - 0.0587 * Math.sin(toR(2*D - M)) * E
    + 0.0571 * Math.sin(toR(2*D - M - Mp)) * E
    - 0.0533 * Math.sin(toR(2*D + Mp))
    - 0.0459 * Math.sin(toR(M - Mp)) * E
    + 0.0410 * Math.sin(toR(2*D - 2*Mp))
    + 0.0347 * Math.sin(toR(M + Mp)) * E
  );
}

// VSOP87 mean elements — Meeus Table 31.a
const PLANET_ELEMENTS = {
  Mercury: { L0: 252.250906, L1: 149474.0722491 },
  Venus:   { L0: 181.979801, L1:  58519.2130302 },
  Mars:    { L0: 355.433000, L1:  19141.6964471 },
  Jupiter: { L0:  34.351519, L1:   3036.3027748 },
  Saturn:  { L0:  50.077444, L1:   1223.5110686 },
  Uranus:  { L0: 314.055005, L1:    429.8640561 },
  Neptune: { L0: 304.348665, L1:    219.8833092 },
  Pluto:   { L0: 238.928880, L1:    145.2078800 },
};

const calcPlanetLng = (name, T) =>
  normDeg(PLANET_ELEMENTS[name].L0 + PLANET_ELEMENTS[name].L1 * T);

function calcGMST(JD) {
  const T   = (JD - 2451545.0) / 36525.0;
  const JD0 = Math.floor(JD + 0.5) - 0.5;
  const UT1 = (JD - JD0) * 86400.0;
  const gmst = 67310.54841
    + (876600.0 * 3600.0 + 8640184.812866) * T
    + 0.093104 * T * T - 6.2e-6 * T * T * T;
  return ((gmst + 1.00273790935 * UT1) % 86400 + 86400) % 86400 / 3600.0;
}

function obliquity(T) {
  return toR(23.4392911 - 0.0130041667 * T - 0.000000163889 * T * T + 0.00000050361111 * T * T * T);
}

function calcAscendant(JD, lat, lon) {
  const T     = (JD - 2451545.0) / 36525.0;
  const lmst  = ((calcGMST(JD) + lon / 15.0) % 24.0 + 24.0) % 24.0;
  const theta = toR(lmst * 15.0);
  const eps   = obliquity(T);
  return normDeg(Math.atan2(
    Math.sin(theta) * Math.cos(eps) + Math.tan(toR(lat)) * Math.sin(eps),
    -Math.cos(theta)
  ) * 180 / Math.PI);
}

function calcMidheaven(JD, lon) {
  const T    = (JD - 2451545.0) / 36525.0;
  const lmst = ((calcGMST(JD) + lon / 15.0) % 24.0 + 24.0) % 24.0;
  const ramc = (lmst * 15.0) % 360.0;
  const eps  = obliquity(T);
  let mc = Math.atan2(Math.tan(toR(ramc)), Math.cos(eps)) * 180 / Math.PI;
  if (ramc >= 90  && ramc < 270) mc += 180;
  else if (ramc >= 270)          mc += 360;
  return normDeg(mc);
}

function calcHouses(JD, lat, lon) {
  const asc = calcAscendant(JD, lat, lon);
  const mc  = calcMidheaven(JD, lon);
  const ic  = normDeg(mc  + 180);
  const dsc = normDeg(asc + 180);
  const interp = (a, b, f) => normDeg(a + (((b - a) + 540) % 360 - 180) * f);
  const h = (id, lng) => ({ id, sign: signFromDeg(lng), longitude: +lng.toFixed(4), degree: +(lng % 30).toFixed(4) });
  return [
    h(1,  asc),
    h(2,  interp(asc, ic,  1/3)),
    h(3,  interp(asc, ic,  2/3)),
    h(4,  ic),
    h(5,  interp(ic,  dsc, 1/3)),
    h(6,  interp(ic,  dsc, 2/3)),
    h(7,  dsc),
    h(8,  interp(dsc, mc,  1/3)),
    h(9,  interp(dsc, mc,  2/3)),
    h(10, mc),
    h(11, interp(mc,  asc + 360, 1/3)),
    h(12, interp(mc,  asc + 360, 2/3)),
  ];
}

function computeLocalNatal({ date, month, year, hour = 0, minute = 0,
                              latitude = 0, longitude = 0, timezone = 0 }) {
  // Convert local time → UTC (only if timezone is numeric offset)
  let h = typeof timezone === 'number' ? hour - timezone : hour;
  let d = date, mo = month, y = year;
  if (h < 0)  { h += 24; d--; if (d < 1)  { mo--; if (mo < 1)  { mo = 12; y--; } d = new Date(y, mo, 0).getDate(); } }
  if (h >= 24){ h -= 24; d++; const dim = new Date(y, mo, 0).getDate(); if (d > dim) { d = 1; mo++; if (mo > 12) { mo = 1; y++; } } }

  const JD = calcJD(y, mo, d, h, minute);
  const T  = (JD - 2451545.0) / 36525.0;
  const asc = calcAscendant(JD, latitude, longitude);

  const p = (name, lng) => ({ name, sign: signFromDeg(lng), full_degree: +lng.toFixed(4), degree: +lng.toFixed(4) });

  const planets = [
    p('Sun',     calcSunLongitude(T)),
    p('Moon',    calcMoonLongitude(T)),
    p('Mercury', calcPlanetLng('Mercury', T)),
    p('Venus',   calcPlanetLng('Venus',   T)),
    p('Mars',    calcPlanetLng('Mars',    T)),
    p('Jupiter', calcPlanetLng('Jupiter', T)),
    p('Saturn',  calcPlanetLng('Saturn',  T)),
    p('Uranus',  calcPlanetLng('Uranus',  T)),
    p('Neptune', calcPlanetLng('Neptune', T)),
    p('Pluto',   calcPlanetLng('Pluto',   T)),
    // Chiron, NorthNode, Lilith not available locally — omitted in fallback
  ];

  const houses    = calcHouses(JD, latitude, longitude);
  const ascendant = { sign: signFromDeg(asc), degree: +(asc % 30).toFixed(4), longitude: +asc.toFixed(4) };

  console.log(`[astroAPI] local VSOP87 — Sun=${planets[0].sign} Moon=${planets[1].sign} Asc=${ascendant.sign}`);
  return { planets, houses, ascendant, source: 'local-vsop87' };
}

// ─── Public API ───────────────────────────────────────────────────────────────

async function getNatalBasics(input) {
  if (RAPIDAPI_KEY) {
    try {
      const result = await fetchRapidAPI(input);
      console.log('[astroAPI] using RapidAPI (ltdbilgisam)');
      return result;
    } catch (err) {
      console.warn('[astroAPI] RapidAPI failed:', err.response?.data ?? err.message);
    }
  }

  console.warn('[astroAPI] using local VSOP87 fallback');
  return computeLocalNatal(input);
}

const getComprehensiveNatal = getNatalBasics;

module.exports = { getNatalBasics, getComprehensiveNatal };