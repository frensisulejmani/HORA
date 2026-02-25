const quizBank = [
  {
    id: 'planet-energy-today',
    title: 'Which planet rules your energy today?',
    questions: [
      { id: 'q1', text: 'How do you feel this morning?', options: ['Driven', 'Sensitive', 'Social', 'Focused'] },
      { id: 'q2', text: 'What do you crave?', options: ['Action', 'Connection', 'Comfort', 'Learning'] },
      { id: 'q3', text: 'Pick a color', options: ['Red', 'Silver', 'Yellow', 'Blue'] }
    ]
  }
];

function getDailyQuiz(req, res) {
  const quiz = quizBank[0];
  res.json({ message: 'OK', quiz });
}

function submitQuiz(req, res) {
  const { id, answers } = req.body;
  const quiz = quizBank.find((q) => q.id === id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  // Simple scoring heuristic
  const counts = { Mars: 0, Moon: 0, Venus: 0, Mercury: 0 };
  (answers || []).forEach((a) => {
    if (!a) return;
    if (a === 'Driven' || a === 'Action' || a === 'Red') counts.Mars++;
    if (a === 'Sensitive' || a === 'Comfort' || a === 'Silver') counts.Moon++;
    if (a === 'Social' || a === 'Connection' || a === 'Yellow') counts.Venus++;
    if (a === 'Focused' || a === 'Learning' || a === 'Blue') counts.Mercury++;
  });
  const planet = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  res.json({ message: 'OK', result: { planet, counts } });
}

module.exports = { getDailyQuiz, submitQuiz };


