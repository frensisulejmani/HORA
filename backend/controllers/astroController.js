const { getNatalBasics } = require('../utils/astroAPI');
const { getUserAstroData } = require('../utils/getUserAstroData');
const { buildAstrocartographyLines } = require('../utils/astrocartography');

async function natal(req, res) {
  try {
    const { date, month, year, hour, minute, latitude, longitude, timezone } = req.body;
    if (![date, month, year, hour, minute, latitude, longitude].every((v) => v !== undefined)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const natalData = await getNatalBasics({ date, month, year, hour, minute, latitude, longitude, timezone: timezone ?? 0 });
    
    // Extract sun sign, moon sign, and ascendant from natal data
    let sunSign = 'Unknown';
    let moonSign = 'Unknown';
    let ascendant = 'Unknown';

    console.log('Natal API Response:', JSON.stringify(natalData, null, 2));

    // Extract ascendant - handle different response formats
    if (natalData.ascendant?.sign) {
      ascendant = natalData.ascendant.sign;
    } else if (typeof natalData.ascendant === 'string') {
      ascendant = natalData.ascendant;
    } else if (natalData.ascendant?.name) {
      ascendant = natalData.ascendant.name;
    }

    // Extract sun and moon signs from planets array
    if (natalData.planets && Array.isArray(natalData.planets)) {
      // Try various naming conventions
      const sunPlanet = natalData.planets.find(p => 
        p.name === 'Sun' || p.name === 'SUN' || p.name === 'sun' || 
        p.body === 'Sun' || p.body === 'SUN'
      );
      const moonPlanet = natalData.planets.find(p => 
        p.name === 'Moon' || p.name === 'MOON' || p.name === 'moon' || 
        p.body === 'Moon' || p.body === 'MOON'
      );
      
      if (sunPlanet?.sign) sunSign = sunPlanet.sign;
      if (moonPlanet?.sign) moonSign = moonPlanet.sign;
    }

    // Extract all planets from rawData
    const allPlanets = [];
    if (natalData.planets && Array.isArray(natalData.planets)) {
      natalData.planets.forEach(p => {
        const planetName = p.name || p.body || 'Unknown';
        const planetSign = p.sign || 'Unknown';
        const planetDegree = p.full_degree || p.degree || p.longitude || 0;
        allPlanets.push({
          name: planetName,
          sign: planetSign,
          full_degree: planetDegree,
          degree: planetDegree
        });
      });
    }

    const data = {
      sunSign,
      moonSign,
      ascendant,
      planets: allPlanets,
      houses: natalData.houses || null,
      rawData: natalData // Include raw data for reference
    };

    console.log('Extracted astro data:', data);
    return res.json({ message: 'OK', data });
  } catch (err) {
    console.error('astroController.natal error:', err.message);
    return res.status(500).json({ message: 'Astro API error', error: err.message });
  }
}

module.exports = { natal };

async function astrocartography(req, res) {
  try {
    const { birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone, place } = req.body;
    const { natal, birth } = await getUserAstroData({ birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone });
    const isoUTC = new Date(Date.UTC(birth.year, birth.month - 1, birth.date, birth.hour || 0, birth.minute || 0)).toISOString();

    const acg = buildAstrocartographyLines({ natal, isoUTC });
    return res.json({ message: 'OK', birth: { ...birth, place }, isoUTC, natal, astrocartography: acg });
  } catch (err) {
    console.error('astroController.astrocartography error:', err.message);
    return res.status(500).json({ message: 'Astrocartography error', error: err.message });
  }
}

module.exports.astrocartography = astrocartography;