// Test astronomical formulas directly

function getZodiacSignFromDegree(degree) {
  let norm = degree % 360;
  if (norm < 0) norm += 360;
  const signIndex = Math.floor(norm / 30);
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[signIndex % 12];
}

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

function calcGMST(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const JD0 = Math.floor(JD + 0.5) - 0.5;
  const UT1 = (JD - JD0) * 86400.0;
  const gmst = 67310.54841 + 
    (876600.0 * 3600.0 + 8640184.812866) * T +
    0.093104 * T * T -
    6.2e-6 * T * T * T;
  const gmstSec = (gmst + 1.00273790935 * UT1) % 86400;
  return gmstSec / 3600.0;
}

function calcAscendant(JD, latitude, longitude) {
  const gmst = calcGMST(JD);
  const lmst = (gmst + longitude / 15.0) % 24.0;
  const ramc = (lmst * 15.0) % 360.0;
  
  const lat = latitude * Math.PI / 180.0;
  const ramc_rad = ramc * Math.PI / 180.0;
  
  let ascRA = Math.atan2(-Math.cos(ramc_rad), Math.sin(ramc_rad) * Math.tan(lat)) * 180.0 / Math.PI;
  
  if (ascRA < 0) ascRA += 360;
  
  let ascendantDegree = ascRA;
  if (ascendantDegree < 0) ascendantDegree += 360;
  
  return ((ascendantDegree % 360) + 360) % 360;
}

function calcSunLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001536 * T * T;
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000029 * Math.sin(3 * Mrad);
  const sunLng = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = sunLng - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  return ((lambda % 360) + 360) % 360;
}

function calcMoonLongitude(JD) {
  const T = (JD - 2451545.0) / 36525.0;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  const D = 297.8501921 + 445267.1142695 * T - 0.0016802 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  const Drad = D * Math.PI / 180;
  const M = 357.52910918 + 35999.0502909 * T - 0.0001536667 * T * T + T * T * T / 24490000;
  const Mrad = M * Math.PI / 180;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  const Mprad = Mp * Math.PI / 180;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  const Frad = F * Math.PI / 180;
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

// Test: July 6, 2006 5:00 PM LOCAL TIME (17:00)
// Tirana, Albania: 41.3275°N, 19.8187°E
const JD = calcJD(2006, 7, 6, 17, 0);  // 17:00 local
const sunLng = calcSunLongitude(JD);
const moonLng = calcMoonLongitude(JD);
const ascDegree = calcAscendant(JD, 41.3275, 19.8187);

console.log('Birth: July 6, 2006 5:00 PM LOCAL (17:00 Tirana)');
console.log('Location: 41.3275°N, 19.8187°E');
console.log('Julian Date:', JD.toFixed(4));
console.log('\nSun longitude:', sunLng.toFixed(2), '°');
console.log('Sun Sign:', getZodiacSignFromDegree(sunLng));
console.log('\nMoon longitude:', moonLng.toFixed(2), '°');
console.log('Moon Sign:', getZodiacSignFromDegree(moonLng));
console.log('\nAscendant degree:', ascDegree.toFixed(2), '°');
console.log('Ascendant Sign:', getZodiacSignFromDegree(ascDegree));
