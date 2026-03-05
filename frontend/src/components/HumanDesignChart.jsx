import React, { useEffect, useState } from 'react';

// Coordinates calibrated to align with the standard Silhouette layout
const centerLayout = {
  Head: { x: 399, y: 127, colorKey: 'transparent', shape: 'triangle-up' },
  Ajna: { x: 398, y: 255, colorKey: 'transparent', shape: 'triangle-down' },
  Throat: { x: 398, y: 435, colorKey: 'transparent', shape: 'square' },
  G: { x: 398, y: 591, colorKey: 'transparent', shape: 'diamond' },
  Heart: { x: 528, y: 650, colorKey: 'transparent', shape: 'triangle-new' },
  Spleen: { x: 167, y: 785, colorKey: 'transparent', shape: 'triangle-old' },
  Sacral: { x: 398, y: 785, colorKey: 'transparent', shape: 'square' },
  SolarPlexus: { x: 635, y: 775, colorKey: 'transparent', shape: 'triangle-right' },
  Root: { x: 398, y: 933, colorKey: 'transparent', shape: 'square' }
};

// Colors based on the 'Genetic Matrix' and standard blueprint style
const definedColors = {
  transparent: 'rgba(0, 0, 0, 0)'
};

const getShapePath = (type, x, y, fill) => {
  const common = `fill="${fill}" stroke="rgba(0, 0, 0, 0)" stroke-width="1.5" class="transition-all duration-700"`;
  switch (type) {
    case 'triangle-up': return `<polygon points="${x},${y-45} ${x+60},${y+40} ${x-60},${y+40}" ${common}/>`;
    case 'triangle-down': return `<polygon points="${x-60},${y-40} ${x+60},${y-40} ${x},${y+60}" ${common}/>`;
    case 'square': return `<rect x="${x-55}" y="${y-50}" width="110" height="100" rx="10" ${common}/>`;
    case 'diamond': return `<path d="M${x},${y-65} L${x+65},${y} L${x},${y+65} L${x-65},${y} Z" ${common}/>`;
    case 'heart': return `<path d="M${x},${y+45} L${x-45},${y-15} A25,25 0 0,1 ${x},${y-15} A25,25 0 0,1 ${x+45},${y-15} Z" ${common}/>`;
    case 'triangle-left': return `<polygon points="${x-30},${y-70} ${x+70},${y} ${x-30},${y+70}" ${common}/>`;
    case 'triangle-right': return `<polygon points="${x+30},${y-70} ${x-70},${y} ${x+30},${y+70}" ${common}/>`;
    case 'triangle-new': return `<polygon points="${x},${y-30} ${x+40},${y+35} ${x-40},${y+30}" ${common}/>`;
    case 'triangle-old': return `<polygon points="${x-30},${y-70} ${x+70},${y} ${x-30},${y+50}" ${common}/>`;
    default: return '';
  }
};

const HumanDesignChart = ({ hdData }) => {
  const [chartSvg, setChartSvg] = useState('');

  useEffect(() => {
    if (!hdData) return;

    let svg = `<svg viewBox="0 0 800 1050" xmlns="http://www.w3.org/2000/svg">`;

    // 1. Background Image (The standard silhouette and channel paths)
    svg += `<image 
      href="https://substackcdn.com/image/fetch/$s_!V7HX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F80a50683-ea8c-4eae-8798-61f72fd19395_1920x1080.jpeg" 
      x="0" y="0" width="800" height="1050" 
      preserveAspectRatio="xMidYMid slice"
    />`;

    // 2. Dynamic Overlay with gate numbers
    Object.entries(centerLayout).forEach(([name, data]) => {
      // Logic: Only color if defined in hdData. Otherwise, use white with low opacity.
      const isDefined = hdData.definedCenters?.[name];
      const fill = isDefined ? definedColors[data.colorKey] : 'rgba(255, 255, 255, 0.7)';
      
      svg += getShapePath(data.shape, data.x, data.y, fill);

      // Add gate and line numbers if center is defined
      if (hdData) {
        // prefer specific activations (gatesInCenters), otherwise fall back to full static list
        const centerGatesRaw = (hdData.gatesInCenters && hdData.gatesInCenters[name]) || (hdData.allGatesByCenter && hdData.allGatesByCenter[name]) || [];

        if (centerGatesRaw.length > 0) {
          // render every gate entry; entries may be numbers (static list) or objects {gate,line,planet}
          centerGatesRaw.forEach((entry, idx) => {
            let label = '';
            if (typeof entry === 'number') {
              label = String(entry);
            } else if (entry && typeof entry === 'object') {
              const g = entry.gate ?? entry;
              const l = entry.line;
              label = l ? `${g}.${l}` : String(g);
            } else {
              label = String(entry);
            }

            // position items vertically centered around the center point
            const spacing = 14; // px between labels
            const offsetIndex = idx - Math.floor((centerGatesRaw.length - 1) / 2);
            const textX = data.x;
            const textY = data.y + offsetIndex * spacing;

            svg += `<text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="600" fill="black" class="pointer-events-none">${label}</text>`;
          });
        }
      }
    });

    svg += `</svg>`;
    setChartSvg(svg);
  }, [hdData]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-150 bg-[#fdfdfd] rounded-[3rem] overflow-hidden shadow-xl border border-gray-200">
        <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
      </div>
    </div>
  );
};

export default HumanDesignChart;