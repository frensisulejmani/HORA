import React, { useEffect, useState } from 'react';

const HumanDesignChart = ({ hdData }) => {
  const [chartSvg, setChartSvg] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  // Gate-to-center mapping
  const gateToCenter = {
    64: 'Head', 61: 'Head', 63: 'Head',
    47: 'Ajna', 24: 'Ajna', 17: 'Ajna', 62: 'Ajna', 43: 'Ajna', 23: 'Ajna',
    56: 'Throat', 16: 'Throat', 48: 'Throat', 11: 'Throat', 8: 'Throat', 1: 'Throat', 20: 'Throat', 31: 'Throat', 7: 'Throat', 33: 'Throat', 13: 'Throat', 37: 'Throat', 40: 'Throat',
    15: 'G', 10: 'G', 20: 'G', 34: 'G', 57: 'G',
    25: 'Ego', 51: 'Ego', 45: 'Ego', 21: 'Ego',
    12: 'SolarPlexus', 22: 'SolarPlexus', 35: 'SolarPlexus', 36: 'SolarPlexus',
    6: 'Spleen', 59: 'Spleen', 32: 'Spleen', 54: 'Spleen', 28: 'Spleen', 38: 'Spleen', 18: 'Spleen', 58: 'Spleen', 46: 'Spleen', 29: 'Spleen', 27: 'Spleen', 50: 'Spleen',
    5: 'Sacral', 14: 'Sacral', 2: 'Sacral', 3: 'Sacral', 39: 'Sacral', 55: 'Sacral', 41: 'Sacral', 30: 'Sacral', 9: 'Sacral', 52: 'Sacral', 42: 'Sacral', 53: 'Sacral',
    19: 'Root', 49: 'Root', 4: 'Root', 60: 'Root', 26: 'Root', 44: 'Root', 11: 'Root', 27: 'Root', 50: 'Root', 34: 'Root', 57: 'Root'
  };

  // Gate meanings (brief descriptions)
  const gateMeanings = {
    1: 'Creative potential', 2: 'Direction & partnership', 3: 'Ordering disorder', 4: 'Limitations & pressure', 5: 'Rhythm & waiting',
    6: 'Friction & competition', 7: 'Role of the self', 8: 'Contribution & contribution', 9: 'Focus & isolation', 10: 'Behavior & treading',
    11: 'Peace & ideation', 12: 'Caution & discretion', 13: 'Listening & witness', 14: 'Possession & power', 15: 'Extremity & humility',
    16: 'Empathy & enthusiasm', 17: 'Opinion & faith', 18: 'Judgment & corruption', 19: 'Want & wanting', 20: 'Now & contemplation',
    21: 'Hunter/Hunted', 22: 'Opening & grace', 23: 'Assimilation & spliting', 24: 'Rationalization', 25: 'Spirit of the self', 26: 'Taming power',
    27: 'Nourishment & caring', 28: 'Preponderance', 29: 'Depths of being', 30: 'Recognition & identification', 31: 'Influence & leadership',
    32: 'Constancy & endurance', 33: 'Retreat & withdrawal', 34: 'Power of the great', 35: 'Progress & emergence', 36: 'Darkening of light',
    37: 'Community & family', 38: 'Opposition & struggle', 39: 'Shock & provocation', 40: 'Deliverance & dissolution', 41: 'Decrease & humility',
    42: 'Increase & growth', 43: 'Breakthrough & impossibility', 44: 'Coupling & meeting', 45: 'Gathering & congregation', 46: 'Ascending & expansion',
    47: 'Oppression & confinement', 48: 'Inadequacy & insufficiency', 49: 'Revolution & reform', 50: 'The vessel & nourishing', 51: 'Shock & awakening',
    52: 'Keeping still', 53: 'Development & gradual progress', 54: 'Marrying maiden', 55: 'Abundance & fullness', 56: 'Wanderer & being foreign',
    57: 'Gentle penetrating', 58: 'Joy & opening', 59: 'Dispersion & dissolution', 60: 'Limitation & boundaries', 61: 'Inner truth & faithfulness',
    62: 'Preponderance of detail', 63: 'After completion', 64: 'Before completion'
  };

  useEffect(() => {
    generateChart();
  }, [hdData]);

  const generateChart = () => {
    try {
      if (!hdData) return;

      const personality = hdData.personality || {};
      const design = hdData.design || {};

      const personalityGates = new Set();
      const designGates = new Set();

      Object.values(personality).forEach(act => {
        if (act && act.gate) personalityGates.add(act.gate);
      });

      Object.values(design).forEach(act => {
        if (act && act.gate) designGates.add(act.gate);
      });

      // Collect gates per center
      const centerGates = {};
      Object.keys(gateToCenter).forEach(gate => {
        const center = gateToCenter[gate];
        if (!centerGates[center]) centerGates[center] = [];
        centerGates[center].push(parseInt(gate));
      });

      // SVG with bodygraph structure
      let svg = `<svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .gate-circle { stroke-width: 1; }
            .gate-text { font-size: 10px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; }
            .center-box { stroke-width: 2; }
            .center-label { font-size: 11px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; }
            .channel-line { stroke-width: 1.5; opacity: 0.5; }
          </style>
        </defs>`;

      // Center positions with gate numbers
      const centers = {
        Head: { x: 400, y: 80, w: 80, h: 60, gates: centerGates.Head || [] },
        Ajna: { x: 400, y: 170, w: 90, h: 55, gates: centerGates.Ajna || [] },
        Throat: { x: 400, y: 270, w: 110, h: 70, gates: centerGates.Throat || [] },
        G: { x: 260, y: 420, w: 80, h: 80, gates: centerGates.G || [] },
        Ego: { x: 540, y: 420, w: 80, h: 80, gates: centerGates.Ego || [] },
        SolarPlexus: { x: 540, y: 530, w: 80, h: 70, gates: centerGates.SolarPlexus || [] },
        Spleen: { x: 160, y: 610, w: 80, h: 80, gates: centerGates.Spleen || [] },
        Sacral: { x: 400, y: 610, w: 90, h: 90, gates: centerGates.Sacral || [] },
        Root: { x: 400, y: 760, w: 90, h: 60, gates: centerGates.Root || [] }
      };

      // Draw channel connection lines
      const channels = [
        ['Head', 'Ajna'], ['Ajna', 'Throat'], ['Throat', 'G'], ['Throat', 'Ego'],
        ['Throat', 'SolarPlexus'], ['G', 'Spleen'], ['Ego', 'SolarPlexus'],
        ['SolarPlexus', 'Spleen'], ['Spleen', 'Sacral'], ['Ego', 'Sacral'],
        ['Sacral', 'Root'], ['G', 'Root'], ['SolarPlexus', 'Root']
      ];

      channels.forEach(([c1, c2]) => {
        const from = centers[c1];
        const to = centers[c2];
        svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" class="channel-line" stroke="#555"/>`;
      });

      // Draw centers with gate numbers inside
      Object.entries(centers).forEach(([name, data]) => {
        const isDefined = hdData.definedCenters?.[name];
        const fill = isDefined ? '#FF1493' : '#2a2a2a';
        const stroke = isDefined ? '#FF69B4' : '#666';
        const textColor = isDefined ? '#FFF' : '#888';

        svg += `<rect x="${data.x - data.w/2}" y="${data.y - data.h/2}" width="${data.w}" height="${data.h}" rx="8" class="center-box" fill="${fill}" stroke="${stroke}" opacity="${isDefined ? 0.85 : 0.5}"/>`;
        
        // Show gate numbers for this center
        const gatesStr = data.gates.slice(0, 3).join(', ') + (data.gates.length > 3 ? '...' : '');
        svg += `<text x="${data.x}" y="${data.y - 5}" class="center-label" fill="${textColor}" font-size="10">${gatesStr}</text>`;
      });

      // Draw 64 gates around outer circle (smaller, less prominent)
      for (let gate = 1; gate <= 64; gate++) {
        const angle = ((gate - 1) / 64) * 360 - 90;
        const radian = (angle * Math.PI) / 180;
        const radius = 365;
        const gateX = 400 + Math.cos(radian) * radius;
        const gateY = 450 + Math.sin(radian) * radius;

        const isPersonality = personalityGates.has(gate);
        const isDesign = designGates.has(gate);

        let fill = '#444';
        let stroke = '#555';
        let textFill = '#777';

        if (isPersonality && isDesign) {
          fill = '#FF1493';
          stroke = '#FF69B4';
          textFill = '#FFF';
        } else if (isPersonality) {
          fill = '#FF69B4';
          stroke = '#FF1493';
          textFill = '#FFF';
        } else if (isDesign) {
          fill = '#00D9FF';
          stroke = '#00A8CC';
          textFill = '#FFF';
        }

        svg += `<circle cx="${gateX}" cy="${gateY}" r="8" class="gate-circle" fill="${fill}" stroke="${stroke}" opacity="${isPersonality || isDesign ? 0.9 : 0.25}"/>`;
        svg += `<text x="${gateX}" y="${gateY}" class="gate-text" fill="${textFill}">${gate}</text>`;
      }

      svg += `</svg>`;
      setChartSvg(svg);
    } catch (err) {
      console.error('Error generating chart:', err);
    }
  };

  if (!hdData) return null;

  // Get all active placements
  const activePlacements = [];
  
  if (hdData.personality) {
    Object.entries(hdData.personality).forEach(([planet, act]) => {
      if (act && act.gate) {
        activePlacements.push({
          planet,
          gate: act.gate,
          line: act.line,
          type: 'Personality (Conscious)',
          color: '#00D9FF'
        });
      }
    });
  }

  if (hdData.design) {
    Object.entries(hdData.design).forEach(([planet, act]) => {
      if (act && act.gate) {
        activePlacements.push({
          planet,
          gate: act.gate,
          line: act.line,
          type: 'Design (Unconscious)',
          color: '#FF1493'
        });
      }
    });
  }

  // Get meaningful info
  const selectedInfo = selectedPlacement ? activePlacements.find(p => p.planet === selectedPlacement) : activePlacements[0];

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-2">Your Human Design BodyGraph</h2>
        <p className="text-gray-400 text-sm">Your unique genetic design and energetic blueprint</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-lg border border-[#555] p-4">
          <div className="w-full" dangerouslySetInnerHTML={{ __html: chartSvg }} />
        </div>

        {/* Right: Key Info & Type */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1a1a1a] p-5 rounded-lg border-2 border-[#FF6B9D]">
            <div className="text-xs text-gray-400 uppercase font-semibold">Your Type</div>
            <div className="text-2xl font-bold text-[#FF6B9D] mt-2">{hdData.type}</div>
            <p className="text-xs text-gray-400 mt-3">{hdData.typeDescription}</p>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-lg border-2 border-[#00D9FF]">
            <div className="text-xs text-gray-400 uppercase font-semibold">Authority</div>
            <div className="text-2xl font-bold text-[#00D9FF] mt-2">{hdData.authority}</div>
            <p className="text-xs text-gray-400 mt-3">{hdData.authorityDescription}</p>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-lg border-2 border-[#FFB6C1]">
            <div className="text-xs text-gray-400 uppercase font-semibold">Profile</div>
            <div className="text-2xl font-bold text-[#FFB6C1] mt-2">{hdData.profile}</div>
            <p className="text-xs text-gray-400 mt-3">{hdData.profileDescription}</p>
          </div>
        </div>
      </div>

      {/* Active Placements Summary */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#555] p-6">
        <h3 className="font-bold text-white mb-4 uppercase text-sm">Your Key Activations ({activePlacements.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {activePlacements.map((placement, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPlacement(placement.planet)}
              className={`p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedInfo?.planet === placement.planet
                  ? 'bg-opacity-40 border-opacity-100 scale-105'
                  : 'bg-opacity-10 border-opacity-30 hover:bg-opacity-20'
              }`}
              style={{
                borderColor: placement.color,
                backgroundColor: placement.color,
                color: placement.color === '#FF1493' ? '#FF69B4' : '#00A8CC'
              }}
            >
              {placement.planet}
              <div className="text-xs opacity-70 mt-0.5">Gate {placement.gate}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Placement Details */}
      {selectedInfo && (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-lg border-2 p-6" style={{ borderColor: selectedInfo.color }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">{selectedInfo.type}</div>
              <h2 className="text-3xl font-bold mt-2" style={{ color: selectedInfo.color }}>
                {selectedInfo.planet}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold" style={{ color: selectedInfo.color }}>
                {selectedInfo.gate}
              </div>
              <div className="text-xs text-gray-400">Gate · Line {selectedInfo.line}</div>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <p className="text-sm text-gray-200 leading-relaxed">
              <span className="font-semibold" style={{ color: selectedInfo.color }}>{selectedInfo.planet}</span> in Gate {selectedInfo.gate}: <span className="italic">{gateMeanings[selectedInfo.gate] || 'Essential life force activation'}</span>
            </p>
            <p className="text-xs text-gray-400 mt-3">
              This is a {selectedInfo.type === 'Personality (Conscious)' ? 'conscious activation you\'re aware of' : 'unconscious pattern running in your design'}. Your {selectedInfo.planet} energy expresses through this gate\'s specific frequency.
            </p>
          </div>

          {/* Center where this gate lives */}
          {gateToCenter[selectedInfo.gate] && (
            <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="text-xs text-gray-400 uppercase font-semibold mb-2">In The {gateToCenter[selectedInfo.gate]} Center</div>
              <p className="text-sm text-gray-300">
                {gateToCenter[selectedInfo.gate] === 'Head' && 'Mental pressure and inspiration. Your thinking patterns.'}
                {gateToCenter[selectedInfo.gate] === 'Ajna' && 'How you perceive and process information conceptually.'}
                {gateToCenter[selectedInfo.gate] === 'Throat' && 'Your expression, communication, and manifestation power.'}
                {gateToCenter[selectedInfo.gate] === 'G' && 'Your identity, direction, and sense of belonging.'}
                {gateToCenter[selectedInfo.gate] === 'Ego' && 'Your willpower, drive, and importance in the world.'}
                {gateToCenter[selectedInfo.gate] === 'SolarPlexus' && 'Your emotional center and intuitive knowing.'}
                {gateToCenter[selectedInfo.gate] === 'Spleen' && 'Your instincts, survival, and present-moment timing.'}
                {gateToCenter[selectedInfo.gate] === 'Sacral' && 'Your life force energy, sexuality, and work capacity.'}
                {gateToCenter[selectedInfo.gate] === 'Root' && 'The foundation of pressure and survival stress in your system.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Defined Centers Section */}
      {hdData.definedCenters && Object.values(hdData.definedCenters).some(v => v) && (
        <div className="bg-[#1a1a1a] rounded-lg border border-[#FF6B9D] p-6">
          <h3 className="font-bold text-[#FF69B4] mb-4 uppercase text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF1493] rounded-full"></span>
            What Your Design is Built For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(hdData.definedCenters).map(([center, isDefined]) => (
              isDefined && (
                <div key={center} className="bg-[#0f0f0f] p-3 rounded border border-[#FF6B9D]/30">
                  <div className="font-semibold text-[#FF69B4] text-sm">{center}</div>
                  <p className="text-xs text-gray-400 mt-1">
                    {center === 'Head' && 'Consistent mental clarity and thinking patterns'}
                    {center === 'Ajna' && 'Reliable perceptive framework and beliefs'}
                    {center === 'Throat' && 'Consistent self-expression and manifestation'}
                    {center === 'G' && 'Stable identity and clear direction'}
                    {center === 'Ego' && 'Reliable willpower and personal drive'}
                    {center === 'SolarPlexus' && 'Predictable emotional/intuitive knowing'}
                    {center === 'Spleen' && 'Reliable instincts and right timing'}
                    {center === 'Sacral' && 'Consistent life force and work capacity'}
                    {center === 'Root' && 'Sustained pressure and drive to move'}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanDesignChart;
