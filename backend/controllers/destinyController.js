const { calculateDestinyMatrix } = require('../utils/destinyMatrix');

async function computeDestinyMatrix(req, res) {
  try {
    const { name, birthDateISO, year, month, date } = req.body;
    
    let iso = birthDateISO;
    if (!iso && year && month && date) {
      iso = new Date(Date.UTC(year, month - 1, date)).toISOString();
    }
    
    if (!iso || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields: name and birthDateISO (or year, month, date)' 
      });
    }

    const result = calculateDestinyMatrix({ name, birthDateISO: iso });
    
    return res.json({
      message: 'OK',
      data: result
    });
  } catch (err) {
    console.error('computeDestinyMatrix error:', err.message);
    return res.status(500).json({ message: 'Destiny Matrix calculation error', error: err.message });
  }
}

module.exports = { computeDestinyMatrix };
