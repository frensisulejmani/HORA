const { getComprehensiveNatal } = require('./astroAPI');

function normalizeBirthInput({ birthDateISO, year, month, date, hour, minute, latitude, longitude, timezone }) {
  if (birthDateISO) {
    const d = new Date(birthDateISO);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      date: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      latitude,
      longitude,
      timezone: typeof timezone === 'number' ? timezone : 0
    };
  }
  return {
    year,
    month,
    date,
    hour: hour || 0,
    minute: minute || 0,
    latitude,
    longitude,
    timezone: typeof timezone === 'number' ? timezone : 0
  };
}

async function getUserAstroData(input) {
  const normalized = normalizeBirthInput(input);
  const natal = await getComprehensiveNatal(normalized);
  return { natal, birth: normalized };
}

module.exports = { getUserAstroData, normalizeBirthInput };