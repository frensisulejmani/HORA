function sumDigits(str) {
  return String(str).split('').filter((c) => /\d/.test(c)).reduce((acc, d) => acc + parseInt(d, 10), 0);
}

function reduceToCore(num) {
  const masters = new Set([11, 22, 33]);
  while (num > 9 && !masters.has(num)) {
    num = sumDigits(String(num));
  }
  return num;
}

function computeLifePathNumber({ year, month, date }) {
  const total = sumDigits(year) + sumDigits(month) + sumDigits(date);
  return reduceToCore(total);
}

function computeExpressionNumber(fullName) {
  if (!fullName) return null;
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const value = letters.split('').reduce((acc, ch) => acc + ((ch.charCodeAt(0) - 64 - 1) % 9) + 1, 0);
  return reduceToCore(value);
}

function computeSoulUrgeNumber(fullName) {
  if (!fullName) return null;
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = letters
    .split('')
    .filter((c) => vowels.has(c))
    .reduce((acc, ch) => acc + ((ch.charCodeAt(0) - 64 - 1) % 9) + 1, 0);
  return reduceToCore(total);
}

function computePersonalityNumber(fullName) {
  if (!fullName) return null;
  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = letters
    .split('')
    .filter((c) => !vowels.has(c))
    .reduce((acc, ch) => acc + ((ch.charCodeAt(0) - 64 - 1) % 9) + 1, 0);
  return reduceToCore(total);
}

function computeBirthdayNumber({ date }) {
  return reduceToCore(sumDigits(date));
}

function buildDigitGrid({ year, month, date }) {
  // Simple Pythagorean grid: count digits 1..9 from ddmmyyyy
  const s = String(date).padStart(2, '0') + String(month).padStart(2, '0') + String(year);
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ch of s) {
    if (/[1-9]/.test(ch)) counts[ch] += 1;
  }
  return counts;
}

// Calculate additional matrix numbers
function computeMatrixNumbers({ year, month, date, name }) {
  const lifePath = computeLifePathNumber({ year, month, date });
  const expression = computeExpressionNumber(name);
  const soulUrge = computeSoulUrgeNumber(name);
  const personality = computePersonalityNumber(name);
  const birthday = computeBirthdayNumber({ date });
  
  // Calculate outer octagon numbers (8 positions)
  // These are derived from various combinations
  const outerOctagon = [
    reduceToCore(lifePath + expression), // Top
    reduceToCore(lifePath + soulUrge),  // Top-right
    reduceToCore(expression + personality), // Right
    reduceToCore(soulUrge + personality), // Bottom-right
    reduceToCore(lifePath + birthday), // Bottom
    reduceToCore(expression + birthday), // Bottom-left
    reduceToCore(personality + birthday), // Left
    reduceToCore(lifePath + personality) // Top-left
  ];
  
  // Calculate inner square numbers (4 positions)
  const innerSquare = [
    reduceToCore(lifePath + expression + soulUrge), // Top
    reduceToCore(expression + personality + soulUrge), // Right
    reduceToCore(lifePath + birthday + personality), // Bottom
    reduceToCore(soulUrge + birthday + lifePath) // Left
  ];
  
  // Calculate money line numbers
  const moneyLine = [
    reduceToCore(expression + personality),
    reduceToCore(expression + birthday),
    reduceToCore(personality + birthday)
  ];
  
  // Calculate love line numbers
  const loveLine = [
    reduceToCore(soulUrge + personality),
    reduceToCore(soulUrge + birthday),
    reduceToCore(personality + birthday)
  ];
  
  // Calculate generation lines
  const maleGenLine = reduceToCore(year + month);
  const femaleGenLine = reduceToCore(month + date);
  
  // Calculate age range numbers (simplified - would need more complex calculation for full ranges)
  const ageRanges = [];
  for (let age = 0; age <= 70; age += 10) {
    const ageNumber = reduceToCore(lifePath + age);
    ageRanges.push({
      age: age,
      number: ageNumber,
      ranges: [
        { start: age, end: age + 2.5, number: reduceToCore(ageNumber + 1) },
        { start: age + 2.5, end: age + 3.5, number: reduceToCore(ageNumber + 2) },
        { start: age + 3.5, end: age + 4, number: reduceToCore(ageNumber + 3) },
        { start: age + 6, end: age + 7.5, number: reduceToCore(ageNumber + 4) },
        { start: age + 7.5, end: age + 8.5, number: reduceToCore(ageNumber + 5) },
        { start: age + 8.5, end: age + 9, number: reduceToCore(ageNumber + 6) }
      ]
    });
  }
  
  return {
    outerOctagon,
    innerSquare,
    moneyLine,
    loveLine,
    maleGenLine,
    femaleGenLine,
    ageRanges
  };
}

function calculateDestinyMatrix({ name, birthDateISO }) {
  const d = new Date(birthDateISO);
  const payload = {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    date: d.getUTCDate()
  };
  const lifePath = computeLifePathNumber(payload);
  const expression = computeExpressionNumber(name);
  const soulUrge = computeSoulUrgeNumber(name);
  const personality = computePersonalityNumber(name);
  const birthday = computeBirthdayNumber(payload);
  const grid = buildDigitGrid(payload);
  
  // Calculate all matrix numbers
  const matrixNumbers = computeMatrixNumbers({ ...payload, name });

  return {
    lifePathNumber: lifePath,
    expressionNumber: expression,
    soulUrgeNumber: soulUrge,
    personalityNumber: personality,
    birthdayNumber: birthday,
    gridCounts: grid,
    inputs: payload,
    matrixNumbers: matrixNumbers
  };
}

module.exports = { calculateDestinyMatrix };