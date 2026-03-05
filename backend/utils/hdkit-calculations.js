const gateOrder = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];

const harmonicOrder = [8, 14, 60, 63, 15, 59, 31, 1, 52, 20, 56, 22, 33, 2, 5, 48, 62, 58, 49, 10, 45, 12, 43, 61, 51, 44, 50, 38, 46, 41, 7, 54, 13, 7, 4, 63, 40, 28, 55, 37, 64, 59, 23, 43, 21, 35, 29, 16, 19, 27, 25, 9, 42, 32, 39, 11, 57, 18, 6, 3, 60, 24, 17, 47];

// Channel definitions (which gates connect to form channels)
const channels = {
  '1-8': ['Head', 'Ajna'],
  '2-14': ['Ajna', 'Throat'],
  '3-60': ['Ajna', 'G'],
  '4-63': ['Root', 'Spleen'],
  '5-15': ['G', 'SolarPlexus'],
  '6-59': ['Spleen', 'Sacral'],
  '7-31': ['Throat', 'G'],
  '9-52': ['Root', 'Spleen'],
  '10-20': ['G', 'Sacral'],
  '10-34': ['G', 'Sacral'],
  '10-57': ['G', 'Sacral'],
  '11-56': ['Throat', 'Spleen'],
  '12-22': ['SolarPlexus', 'Throat'],
  '13-33': ['Ajna', 'Throat'],
  '16-48': ['Ego', 'Throat'],
  '17-62': ['Ajna', 'Throat'],
  '18-58': ['Spleen', 'Root'],
  '19-49': ['Root', 'Throat'],
  '20-34': ['G', 'Sacral'],
  '20-57': ['G', 'Sacral'],
  '21-45': ['Ego', 'Throat'],
  '23-43': ['Ajna', 'Throat'],
  '24-61': ['Root', 'SolarPlexus'],
  '25-51': ['Ego', 'G'],
  '26-44': ['Ajna', 'SolarPlexus'],
  '27-50': ['Spleen', 'SolarPlexus'],
  '28-38': ['Root', 'SolarPlexus'],
  '29-46': ['Spleen', 'G'],
  '30-41': ['SolarPlexus', 'Sacral'],
  '32-54': ['Spleen', 'Root'],
  '34-57': ['G', 'Sacral'],
  '35-36': ['SolarPlexus', 'SolarPlexus'],
  '37-40': ['Throat', 'G'],
  '39-55': ['SolarPlexus', 'Sacral'],
  '42-53': ['Root', 'SolarPlexus'],
  '47-64': ['Head', 'Ajna']
};

// Energy centers in HD
const centers = ['Head', 'Ajna', 'Throat', 'G', 'Ego', 'SolarPlexus', 'Spleen', 'Sacral', 'Root'];

// Planetary order for HD calculations
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'NorthNode', 'SouthNode', 'Earth', 'Chiron'];

function oppositeGate(gate) {
  const index = gateOrder.indexOf(gate);
  const oppositeIndex = (index + 32) % gateOrder.length;
  return gateOrder[oppositeIndex];
}

function harmonicGate(gate) {
  const index = gateOrder.indexOf(gate);
  if (index >= 0 && index < harmonicOrder.length) {
    return harmonicOrder[index];
  }
  return -1;
}

function nextGate(gate) {
  const index = gateOrder.indexOf(gate);
  return gateOrder[(index + 1) % gateOrder.length];
}

function nextLine(line) {
  return line === 6 ? 1 : line + 1;
}

function nextGateAndLine(gate, line) {
  return line === 6 ? nextGate(gate) + '.' + nextLine(line) : gate + '.' + nextLine(line);
}

function previousGate(gate) {
  const index = gateOrder.indexOf(gate);
  return gateOrder[(index - 1 + gateOrder.length) % gateOrder.length];
}

// Calculate gate from planetary longitude (degrees)
// 0° = Gate 41 (first gate of I Ching wheel)
function gateFromLongitude(longitude) {
  // Normalize to 0-360
  const normalizedLong = ((longitude % 360) + 360) % 360;
  
  // Each gate is 5.625° (360/64)
  const gateIndex = Math.floor((normalizedLong / 360) * 64) % 64;
  return gateOrder[gateIndex];
}

// Calculate line (1-6) from planetary longitude
function lineFromLongitude(longitude) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const lineIndex = Math.floor(((normalizedLong / 360) * 64 * 6) % 6);
  return lineIndex + 1;
}

// Calculate color (1-6) from planetary longitude
function colorFromLongitude(longitude) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const colorIndex = Math.floor(((normalizedLong / 360) * 64 * 36) % 6);
  return colorIndex + 1;
}

// Calculate tone (1-6) from planetary longitude
function toneFromLongitude(longitude) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const toneIndex = Math.floor(((normalizedLong / 360) * 64 * 216) % 6);
  return toneIndex + 1;
}

// Calculate base (1-5) from planetary longitude
function baseFromLongitude(longitude) {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const baseIndex = Math.floor(((normalizedLong / 360) * 64 * 1080) % 5);
  return baseIndex + 1;
}

// Get all planetary activations from birth data
function getPlanetaryActivations(birthData) {
  const activations = {};
  
  if (!birthData) {
    return activations;
  }

  // Handle both array format (from API) and object format (from direct planet data)
  let planetsData = [];
  
  if (Array.isArray(birthData)) {
    // birthData is already an array of planets
    planetsData = birthData;
  } else if (birthData.planets && Array.isArray(birthData.planets)) {
    // birthData is {planets: [...]}
    planetsData = birthData.planets;
  } else if (typeof birthData === 'object') {
    // birthData is {Sun: {...}, Moon: {...}, ...}
    planetsData = Object.entries(birthData).map(([name, data]) => ({
      name,
      ...data
    }));
  }

  planetsData.forEach(planet => {
    const planetName = planet.name || planet.planet;
    const longitude = planet.longitude || planet.full_degree || planet.degree || 0;
    
    if (planetName && longitude !== null && longitude !== undefined) {
      activations[planetName] = {
        gate: gateFromLongitude(longitude),
        line: lineFromLongitude(longitude),
        color: colorFromLongitude(longitude),
        tone: toneFromLongitude(longitude),
        base: baseFromLongitude(longitude)
      };
    }
  });

  return activations;
}

// Determine defined centers based on gate activations
function getDefinedCenters(personalityActivations, designActivations) {
  const definedCenters = {
    Head: false,
    Ajna: false,
    Throat: false,
    G: false,
    Ego: false,
    SolarPlexus: false,
    Spleen: false,
    Sacral: false,
    Root: false
  };

  // Combine all activated gates
  const allActivatedGates = new Set();
  
  Object.values(personalityActivations).forEach(act => {
    if (act.gate) allActivatedGates.add(act.gate);
  });
  
  Object.values(designActivations).forEach(act => {
    if (act.gate) allActivatedGates.add(act.gate);
  });

  // Check for channel activations that define centers
  // Head-Ajna channels
  if ((allActivatedGates.has(64) && allActivatedGates.has(47)) ||
      (allActivatedGates.has(61) && allActivatedGates.has(24)) ||
      (allActivatedGates.has(63) && allActivatedGates.has(4))) {
    definedCenters.Head = true;
    definedCenters.Ajna = true;
  }

  // Ajna-Throat channels
  if ((allActivatedGates.has(17) && allActivatedGates.has(62)) ||
      (allActivatedGates.has(43) && allActivatedGates.has(23)) ||
      (allActivatedGates.has(11) && allActivatedGates.has(56))) {
    definedCenters.Ajna = true;
    definedCenters.Throat = true;
  }

  // Throat-G channels
  if ((allActivatedGates.has(20) && allActivatedGates.has(10)) ||
      (allActivatedGates.has(31) && allActivatedGates.has(7)) ||
      (allActivatedGates.has(8) && allActivatedGates.has(1)) ||
      (allActivatedGates.has(33) && allActivatedGates.has(13))) {
    definedCenters.Throat = true;
    definedCenters.G = true;
  }

  // Ego-Throat channels
  if ((allActivatedGates.has(45) && allActivatedGates.has(21)) ||
      (allActivatedGates.has(40) && allActivatedGates.has(37)) ||
      (allActivatedGates.has(16) && allActivatedGates.has(48))) {
    definedCenters.Ego = true;
    definedCenters.Throat = true;
  }

  // Solar Plexus-Throat channels
  if ((allActivatedGates.has(12) && allActivatedGates.has(22)) ||
      (allActivatedGates.has(35) && allActivatedGates.has(36))) {
    definedCenters.SolarPlexus = true;
    definedCenters.Throat = true;
  }

  // G-Spleen channels
  if ((allActivatedGates.has(10) && allActivatedGates.has(57)) ||
      (allActivatedGates.has(29) && allActivatedGates.has(46))) {
    definedCenters.G = true;
    definedCenters.Spleen = true;
  }

  // Spleen-Sacral channels
  if ((allActivatedGates.has(6) && allActivatedGates.has(59)) ||
      (allActivatedGates.has(32) && allActivatedGates.has(54)) ||
      (allActivatedGates.has(28) && allActivatedGates.has(38)) ||
      (allActivatedGates.has(18) && allActivatedGates.has(58))) {
    definedCenters.Spleen = true;
    definedCenters.Sacral = true;
  }

  // Sacral-Ego channels
  if ((allActivatedGates.has(34) && allActivatedGates.has(20)) ||
      (allActivatedGates.has(14) && allActivatedGates.has(2))) {
    definedCenters.Sacral = true;
    definedCenters.Ego = true;
  }

  // Root-Solar Plexus channels
  if ((allActivatedGates.has(39) && allActivatedGates.has(55)) ||
      (allActivatedGates.has(19) && allActivatedGates.has(49)) ||
      (allActivatedGates.has(41) && allActivatedGates.has(30)) ||
      (allActivatedGates.has(3) && allActivatedGates.has(60))) {
    definedCenters.Root = true;
    definedCenters.SolarPlexus = true;
  }

  // Root-Spleen channels
  if ((allActivatedGates.has(9) && allActivatedGates.has(52)) ||
      (allActivatedGates.has(4) && allActivatedGates.has(63))) {
    definedCenters.Root = true;
    definedCenters.Spleen = true;
  }

  // Sacral-Root channels
  if ((allActivatedGates.has(5) && allActivatedGates.has(15)) ||
      (allActivatedGates.has(42) && allActivatedGates.has(53))) {
    definedCenters.Sacral = true;
    definedCenters.Root = true;
  }

  return definedCenters;
}

// Get all activated channels from personality and design
function getActivatedChannels(personalityActivations, designActivations) {
  const activatedChannels = [];
  const personalityGates = new Set();
  const designGates = new Set();

  Object.values(personalityActivations).forEach(act => {
    if (act.gate) personalityGates.add(act.gate);
  });

  Object.values(designActivations).forEach(act => {
    if (act.gate) designGates.add(act.gate);
  });

  // Check all known channels
  Object.keys(channels).forEach(channelKey => {
    const [gate1, gate2] = channelKey.split('-').map(Number);
    const p1 = personalityGates.has(gate1);
    const p2 = personalityGates.has(gate2);
    const d1 = designGates.has(gate1);
    const d2 = designGates.has(gate2);

    if ((p1 || d1) && (p2 || d2)) {
      activatedChannels.push({
        channel: channelKey,
        centers: channels[channelKey],
        type: p1 && p2 && d1 && d2 ? 'both' : (p1 && p2 ? 'personality' : (d1 && d2 ? 'design' : 'partial'))
      });
    }
  });

  return activatedChannels;
}

// Map planetary activations to centers
function getGatesInCenters(personalityActivations, designActivations) {
  const centerGates = {
    Head: [],
    Ajna: [],
    Throat: [],
    G: [],
    Ego: [],
    SolarPlexus: [],
    Spleen: [],
    Sacral: [],
    Root: []
  };

  // Build gate to center mapping from channels
  const gateToCenter = {};
  Object.entries(channels).forEach(([channelKey, [center1, center2]]) => {
    const [gate1, gate2] = channelKey.split('-').map(Number);
    if (!gateToCenter[gate1]) gateToCenter[gate1] = [];
    if (!gateToCenter[gate2]) gateToCenter[gate2] = [];
    // assume gate1 belongs to center1, gate2 belongs to center2
    gateToCenter[gate1].push(center1);
    gateToCenter[gate2].push(center2);
  });

  // Add planetary gates to appropriate centers
  const allActivations = { ...personalityActivations, ...designActivations };
  Object.entries(allActivations).forEach(([planet, activation]) => {
    if (activation.gate) {
      const gate = activation.gate;
      const centersList = gateToCenter[gate] || [];
      centersList.forEach(center => {
        if (centerGates[center]) {
          centerGates[center].push({
            gate: activation.gate,
            line: activation.line,
            planet
          });
        }
      });
    }
  });

  return centerGates;
}

// Return full static list of gates associated with each center
function getAllGatesByCenter() {
  const allGates = {
    Head: [],
    Ajna: [],
    Throat: [],
    G: [],
    Ego: [],
    SolarPlexus: [],
    Spleen: [],
    Sacral: [],
    Root: []
  };

  Object.entries(channels).forEach(([channelKey, [center1, center2]]) => {
    const [gate1, gate2] = channelKey.split('-').map(Number);
     console.log(" ", allGates[center1], allGates[center2]);
   
    // gate1 belongs to center1, gate2 belongs to center2
    if (!allGates[center1].includes(gate1)) allGates[center1].push(gate1);
    if (!allGates[center2].includes(gate2)) allGates[center2].push(gate2);
  });

  // sort each array numerically
  Object.keys(allGates).forEach(center => {
    allGates[center].sort((a,b)=>a-b);
  });

  return allGates;
}

module.exports = {
  gateOrder,
  harmonicOrder,
  channels,
  centers,
  planets,
  oppositeGate,
  harmonicGate,
  nextGate,
  nextLine,
  nextGateAndLine,
  previousGate,
  gateFromLongitude,
  lineFromLongitude,
  colorFromLongitude,
  toneFromLongitude,
  baseFromLongitude,
  getPlanetaryActivations,
  getDefinedCenters,
  getActivatedChannels,
  getGatesInCenters,
  getAllGatesByCenter
};
