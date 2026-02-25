import React, { useRef, useMemo } from 'react';

const NatalChartWheel = ({ planets = [], houses = [], ascendant = null }) => {
  const svgRef = useRef(null);
  const size = 800;
  const center = size / 2;
  
  // Define ring radii (from outer to inner)
  const outerRadius = 380;        // Outer edge with degree marks
  const signRingRadius = 350;      // Zodiac signs
  const houseRingRadius = 320;     // House numbers
  const planetRingRadius = 280;    // Planets
  const aspectRadius = 200;        // Inner area for aspect lines
  const innerRadius = 50;          // Center circle

  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const signSymbols = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };

  const planetSymbols = {
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
    'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅',
    'Neptune': '♆', 'Pluto': '♇'
  };

  // Convert degree to angle - ASC at left (9 o'clock), counter-clockwise
  const degreeToAngle = (degree) => {
    if (!ascendant) return (degree * Math.PI / 180) - (Math.PI / 2);
    
    const ascDegree = ascendant.longitude || ascendant.degree || 0;
    // Rotate so ascendant is at left (270°)
    const adjustedDegree = (degree - ascDegree + 90 + 360) % 360;
    return (adjustedDegree * Math.PI / 180) - (Math.PI / 2);
  };

  // Get house cusp position
  const getHouseCuspAngle = (houseIndex) => {
    if (houses.length > houseIndex && houses[houseIndex]?.longitude !== undefined) {
      return degreeToAngle(houses[houseIndex].longitude);
    }
    const ascDegree = ascendant?.longitude || ascendant?.degree || 0;
    const houseDegree = (ascDegree + (houseIndex * 30)) % 360;
    return degreeToAngle(houseDegree);
  };

  // Get planet position
  const getPlanetPosition = (planet) => {
    const degree = planet.full_degree || planet.degree || planet.longitude || 0;
    const angle = degreeToAngle(degree);
    const x = center + planetRingRadius * Math.cos(angle);
    const y = center + planetRingRadius * Math.sin(angle);
    return { x, y, angle, degree };
  };

  // Calculate aspects between planets
  const aspects = useMemo(() => {
    const aspectLines = [];
    const orb = 8; // Orb tolerance in degrees
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];
        const deg1 = p1.full_degree || p1.degree || p1.longitude || 0;
        const deg2 = p2.full_degree || p2.degree || p2.longitude || 0;
        
        let angle = Math.abs(deg1 - deg2);
        if (angle > 180) angle = 360 - angle;
        
        // Check for major aspects
        const aspectAngles = {
          'conjunction': 0,
          'opposition': 180,
          'trine': 120,
          'square': 90,
          'sextile': 60
        };
        
        for (const [aspectName, aspectAngle] of Object.entries(aspectAngles)) {
          if (Math.abs(angle - aspectAngle) <= orb) {
            const pos1 = getPlanetPosition(p1);
            const pos2 = getPlanetPosition(p2);
            
            // Determine color: red for challenging, blue for harmonious
            const isChallenging = aspectName === 'opposition' || aspectName === 'square';
            const color = isChallenging ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.6)';
            
            aspectLines.push({
              x1: pos1.x,
              y1: pos1.y,
              x2: pos2.x,
              y2: pos2.y,
              color,
              type: aspectName
            });
            break;
          }
        }
      }
    }
    return aspectLines;
  }, [planets]);

  // Get which house a planet is in
  const getPlanetHouse = (planetDegree) => {
    if (!houses.length) return null;
    
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      const currentDegree = currentHouse.longitude || 0;
      let nextDegree = nextHouse.longitude || 0;
      
      if (nextDegree < currentDegree) nextDegree += 360;
      
      if (planetDegree >= currentDegree && planetDegree < nextDegree) {
        return i + 1;
      }
      if (currentDegree > 330 && planetDegree < 30) {
        return i + 1;
      }
    }
    return 1;
  };

  return (
    <div className="flex justify-center items-center w-full">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[800px] h-auto"
      >
        {/* Background circle with cosmic theme */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="rgba(5,5,5,0.8)"
          stroke="rgba(168,85,247,0.3)"
          strokeWidth="2"
        />
        
        {/* Inner glow effect */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius - 5}
          fill="none"
          stroke="rgba(168,85,247,0.1)"
          strokeWidth="1"
        />

        {/* Outer ring: Degree markings (0-29 for each sign) */}
        {signs.map((sign, signIdx) => {
          return Array.from({ length: 30 }, (_, degIdx) => {
            const degree = signIdx * 30 + degIdx;
            const angle = degreeToAngle(degree);
            const isMajorMark = degIdx % 5 === 0;
            const markLength = isMajorMark ? 15 : 8;
            const markRadius = outerRadius - markLength;
            
            return (
              <line
                key={`deg-${sign}-${degIdx}`}
                x1={center + outerRadius * Math.cos(angle)}
                y1={center + outerRadius * Math.sin(angle)}
                x2={center + markRadius * Math.cos(angle)}
                y2={center + markRadius * Math.sin(angle)}
                stroke={isMajorMark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isMajorMark ? 1.5 : 0.5}
              />
            );
          });
        })}

        {/* Middle ring: Zodiac signs */}
        {signs.map((sign, i) => {
          const signCenterDegree = i * 30 + 15; // Center of each sign
          const angle = degreeToAngle(signCenterDegree);
          const x = center + signRingRadius * Math.cos(angle);
          const y = center + signRingRadius * Math.sin(angle);
          
          return (
            <g key={sign}>
              {/* Sign symbol */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(168,85,247,0.9)"
                fontSize="28"
                fontWeight="bold"
                fontFamily="serif"
              >
                {signSymbols[sign]}
              </text>
              {/* Sign name */}
              <text
                x={x}
                y={y + 25}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize="11"
                fontWeight="500"
              >
                {sign.substring(0, 3).toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Inner ring: House numbers and cusps */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = getHouseCuspAngle(i);
          const x1 = center + outerRadius * Math.cos(angle);
          const y1 = center + outerRadius * Math.sin(angle);
          const x2 = center + innerRadius * Math.cos(angle);
          const y2 = center + innerRadius * Math.sin(angle);
          
          const house = houses[i];
          const houseSign = house?.sign || 'Unknown';
          const houseDeg = house ? Math.floor((house.longitude || 0) % 30) : 0;
          const houseMin = house ? Math.floor(((house.longitude || 0) % 1) * 60) : 0;
          
          // House number position
          const houseNumAngle = getHouseCuspAngle(i);
          const houseNumRadius = houseRingRadius;
          const houseNumX = center + houseNumRadius * Math.cos(houseNumAngle);
          const houseNumY = center + houseNumRadius * Math.sin(houseNumAngle);
          
          return (
            <g key={`house-${i}`}>
              {/* House dividing line */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
              />
              {/* House number */}
              <circle
                cx={houseNumX}
                cy={houseNumY}
                r="18"
                fill="rgba(5,5,5,0.9)"
                stroke="rgba(168,85,247,0.8)"
                strokeWidth="2"
              />
              <text
                x={houseNumX}
                y={houseNumY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(168,85,247,1)"
                fontSize="14"
                fontWeight="bold"
              >
                {i + 1}
              </text>
              {/* House cusp degree */}
              <text
                x={houseNumX + 25 * Math.cos(houseNumAngle)}
                y={houseNumY + 25 * Math.sin(houseNumAngle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="9"
              >
                {houseDeg}°{String(houseMin).padStart(2, '0')}'
              </text>
            </g>
          );
        })}

        {/* Aspect lines (drawn first so planets appear on top) */}
        {aspects.map((aspect, idx) => (
          <line
            key={`aspect-${idx}`}
            x1={aspect.x1}
            y1={aspect.y1}
            x2={aspect.x2}
            y2={aspect.y2}
            stroke={aspect.color}
            strokeWidth="2"
            opacity="0.7"
          />
        ))}

        {/* Planets */}
        {planets.map((planet) => {
          const pos = getPlanetPosition(planet);
          const degree = pos.degree;
          const deg = Math.floor(degree % 30);
          const min = Math.floor((degree % 1) * 60);
          const planetHouse = getPlanetHouse(degree);
          const sign = planet.sign || 'Unknown';
          
          return (
            <g key={planet.name}>
              {/* Planet circle with glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="22"
                fill="rgba(5,5,5,0.9)"
                stroke="rgba(168,85,247,0.6)"
                strokeWidth="2.5"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill="rgba(5,5,5,0.95)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
              />
              {/* Planet symbol */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.95)"
                fontSize="20"
                fontWeight="bold"
                fontFamily="serif"
              >
                {planetSymbols[planet.name] || planet.name[0]}
              </text>
              {/* Planet degree and house */}
              <text
                x={pos.x}
                y={pos.y + 30}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="10"
                fontWeight="600"
              >
                {deg}°{String(min).padStart(2, '0')}' {sign.substring(0, 3)}
              </text>
              {/* House number below planet */}
              {planetHouse && (
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(168,85,247,0.9)"
                  fontSize="9"
                  fontWeight="bold"
                >
                  H{planetHouse}
                </text>
              )}
            </g>
          );
        })}

        {/* Cardinal points */}
        {ascendant && (
          <>
            {/* Ascendant (ASC) - at left */}
            <g>
              <line
                x1={center}
                y1={center}
                x2={center + outerRadius * Math.cos(degreeToAngle(ascendant.longitude || ascendant.degree || 0))}
                y2={center + outerRadius * Math.sin(degreeToAngle(ascendant.longitude || ascendant.degree || 0))}
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <text
                x={center + (outerRadius + 30) * Math.cos(degreeToAngle(ascendant.longitude || ascendant.degree || 0))}
                y={center + (outerRadius + 30) * Math.sin(degreeToAngle(ascendant.longitude || ascendant.degree || 0))}
                textAnchor="middle"
                fill="#3b82f6"
                fontSize="14"
                fontWeight="bold"
              >
                ASC
              </text>
            </g>
            
            {/* Descendant (DSC) - opposite ASC */}
            <g>
              <line
                x1={center}
                y1={center}
                x2={center + outerRadius * Math.cos(degreeToAngle((ascendant.longitude || ascendant.degree || 0) + 180))}
                y2={center + outerRadius * Math.sin(degreeToAngle((ascendant.longitude || ascendant.degree || 0) + 180))}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <text
                x={center + (outerRadius + 30) * Math.cos(degreeToAngle((ascendant.longitude || ascendant.degree || 0) + 180))}
                y={center + (outerRadius + 30) * Math.sin(degreeToAngle((ascendant.longitude || ascendant.degree || 0) + 180))}
                textAnchor="middle"
                fill="#3b82f6"
                fontSize="12"
                fontWeight="bold"
              >
                DSC
              </text>
            </g>
          </>
        )}
        
        {/* Midheaven (MC) and IC */}
        {houses.length > 9 && houses[9].longitude && (
          <>
            <g>
              <line
                x1={center}
                y1={center}
                x2={center + outerRadius * Math.cos(degreeToAngle(houses[9].longitude))}
                y2={center + outerRadius * Math.sin(degreeToAngle(houses[9].longitude))}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <text
                x={center + (outerRadius + 30) * Math.cos(degreeToAngle(houses[9].longitude))}
                y={center + (outerRadius + 30) * Math.sin(degreeToAngle(houses[9].longitude))}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize="12"
                fontWeight="bold"
              >
                MC
              </text>
            </g>
            {/* IC (opposite MC) */}
            {houses.length > 3 && houses[3].longitude && (
              <g>
                <line
                  x1={center}
                  y1={center}
                  x2={center + outerRadius * Math.cos(degreeToAngle(houses[3].longitude))}
                  y2={center + outerRadius * Math.sin(degreeToAngle(houses[3].longitude))}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <text
                  x={center + (outerRadius + 30) * Math.cos(degreeToAngle(houses[3].longitude))}
                  y={center + (outerRadius + 30) * Math.sin(degreeToAngle(houses[3].longitude))}
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="bold"
                >
                  IC
                </text>
              </g>
            )}
          </>
        )}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="rgba(5,5,5,0.9)"
          stroke="rgba(168,85,247,0.4)"
          strokeWidth="2"
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="12"
          fontWeight="500"
        >
          EARTH
        </text>
      </svg>
    </div>
  );
};

export default NatalChartWheel;
