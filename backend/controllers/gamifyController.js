const User = require('../models/User');

function isSameUTCDate(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

async function dailyCheckin(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    const last = user.gamification?.lastCheckinAt ? new Date(user.gamification.lastCheckinAt) : null;
    let streak = user.gamification?.streakCount || 0;
    let points = user.gamification?.points || 0;

    if (last && isSameUTCDate(last, now)) {
      return res.json({ message: 'Already checked in today', streakCount: streak, points });
    }

    // If last checkin was yesterday, increment streak, else reset
    let expectedPrev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
    if (last && isSameUTCDate(last, expectedPrev)) streak += 1; else streak = 1;

    const earned = 10 + Math.min(streak, 20); // simple bonus by streak
    points += earned;

    user.gamification = { streakCount: streak, lastCheckinAt: now, points };
    await user.save();

    res.json({ message: 'Check-in successful', streakCount: streak, points, earned });
  } catch (err) {
    console.error('dailyCheckin error:', err.message);
    res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
}

module.exports = { dailyCheckin };


