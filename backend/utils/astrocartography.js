// Minimal astrocartography lines (MC/IC) using approximate conversion.
// Assumptions: ecliptic latitude ~ 0 for planets (good enough for lines preview).

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function toJulianDate(date) {
  // Meeus: JD = (ms since epoch)/86400000 + 2440587.5
  return date.getTime() / 86400000 + 2440587.5;
}

function gmstInRadians(date) {
  // Approx GMST from date (Meeus simplified)
  const jd = toJulianDate(date);
  const T = (jd - 2451545.0) / 36525.0;
  let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  theta = ((theta % 360) + 360) % 360; // normalize 0..360
  return theta * DEG2RAD;
}

function eclipticToEquatorial(lambdaDeg, betaDeg = 0) {
  // Convert ecliptic lon/lat to RA/Dec. Assume mean obliquity.
  const epsilon = 23.43928 * DEG2RAD;
  const lambda = lambdaDeg * DEG2RAD;
  const beta = betaDeg * DEG2RAD;

  const sinDec = Math.sin(beta) * Math.cos(epsilon) + Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda);
  const dec = Math.asin(sinDec);
  const y = Math.sin(lambda) * Math.cos(epsilon) - Math.tan(beta) * Math.sin(epsilon);
  const x = Math.cos(lambda);
  let ra = Math.atan2(y, x);
  if (ra < 0) ra += 2 * Math.PI;
  return { ra, dec }; // radians
}

function normalizeLon(lon) {
  // Normalize to -180..180
  let L = ((lon + 180) % 360 + 360) % 360 - 180;
  return L;
}

function makeMeridianPolyline(lonDeg, steps = 181) {
  const coords = [];
  for (let i = 0; i < steps; i++) {
    const lat = -90 + (180 * i) / (steps - 1);
    coords.push([lat, lonDeg]); // [lat, lon]
  }
  return coords;
}

function extractPlanetLongitude(p) {
  // Try common fields from our data mapping
  if (typeof p.full_degree === 'number') return p.full_degree;
  if (typeof p.lon === 'number') return p.lon;
  if (typeof p.longitude === 'number') return p.longitude;
  return null;
}

function extractPlanetLat(p) {
  if (typeof p.lat === 'number') return p.lat;
  if (typeof p.latitude === 'number') return p.latitude;
  return 0;
}

function extractPlanetRA(p) {
  if (typeof p.ra === 'number') return p.ra; // radians or degrees? assume degrees if > 2π
  if (typeof p.rightAscension === 'number') return p.rightAscension;
  return null;
}

function extractPlanetDec(p) {
  if (typeof p.dec === 'number') return p.dec;
  if (typeof p.declination === 'number') return p.declination;
  return null;
}

function computeMcIcLines(planets, birthDateIso) {
  const date = new Date(birthDateIso);
  const gmst = gmstInRadians(date); // radians
  const lines = [];
  const targets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];

  for (const name of targets) {
    const p = planets && planets.find((x) => (x.name || '').toLowerCase() === name.toLowerCase());
    if (!p) continue;
    const lonDeg = extractPlanetLongitude(p);
    const latDeg = extractPlanetLat(p);
    const raMaybe = extractPlanetRA(p);
    let ra;
    if (raMaybe != null) {
      ra = (raMaybe > 2 * Math.PI ? (raMaybe * DEG2RAD) : raMaybe);
    } else if (lonDeg != null) {
      ra = eclipticToEquatorial(lonDeg, latDeg).ra;
    } else {
      continue;
    }
    const gha = gmst - ra; // Greenwich Hour Angle (radians)
    const ghaDeg = gha * RAD2DEG;
    const subLon = normalizeLon(-ghaDeg); // subpoint longitude (deg East)

    // MC line near subLon meridian; IC is opposite meridian
    lines.push({
      body: name,
      type: 'MC',
      coordinates: makeMeridianPolyline(subLon)
    });
    lines.push({
      body: name,
      type: 'IC',
      coordinates: makeMeridianPolyline(normalizeLon(subLon + 180))
    });
  }
  return lines;
}

function computeAscDscLines(planets, birthDateIso, stepDeg = 2) {
  const date = new Date(birthDateIso);
  const gmst = gmstInRadians(date);
  const lines = [];
  const targets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];

  for (const name of targets) {
    const p = planets && planets.find((x) => (x.name || '').toLowerCase() === name.toLowerCase());
    if (!p) continue;
    const lonDeg = extractPlanetLongitude(p);
    const latDeg = extractPlanetLat(p);
    const raMaybe = extractPlanetRA(p);
    const decMaybe = extractPlanetDec(p);
    let ra, dec;
    if (raMaybe != null && decMaybe != null) {
      ra = (raMaybe > 2 * Math.PI ? (raMaybe * DEG2RAD) : raMaybe);
      dec = (Math.abs(decMaybe) > Math.PI ? (decMaybe * DEG2RAD) : decMaybe);
    } else if (lonDeg != null) {
      const eq = eclipticToEquatorial(lonDeg, latDeg);
      ra = eq.ra; dec = eq.dec;
    } else {
      continue;
    }
    const ascCoords = [];
    const dscCoords = [];

    for (let lon = -180; lon <= 180; lon += stepDeg) {
      const lonRad = lon * DEG2RAD;
      let lst = gmst + lonRad; // radians
      // normalize to -pi..pi for stability
      lst = ((lst + Math.PI) % (2 * Math.PI)) - Math.PI;
      const H = lst - ra; // hour angle
      // ASC latitude
      const latAsc = Math.atan2(-Math.cos(dec) * Math.cos(H), Math.sin(dec)) * RAD2DEG;
      // DSC latitude (H + π) => flips sign
      const latDsc = -latAsc;

      ascCoords.push([Math.max(-90, Math.min(90, latAsc)), lon]);
      dscCoords.push([Math.max(-90, Math.min(90, latDsc)), lon]);
    }

    lines.push({ body: name, type: 'ASC', coordinates: ascCoords });
    lines.push({ body: name, type: 'DSC', coordinates: dscCoords });
  }

  return lines;
}

function buildAstrocartographyLines({ natal, isoUTC }) {
  try {
    const planets = Array.isArray(natal?.planets) ? natal.planets : [];
    const lines = [
      ...computeMcIcLines(planets, isoUTC),
      ...computeAscDscLines(planets, isoUTC)
    ];
    return { lines };
  } catch (e) {
    return { lines: [] };
  }
}

module.exports = { buildAstrocartographyLines };


