import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StarMatcher = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [matched, setMatched] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);

  const constellations = [
    { name: 'Orion', symbol: '⭐', fortune: 'Courage awaits you' },
    { name: 'Leo', symbol: '🦁', fortune: 'Leadership calls' },
    { name: 'Scorpio', symbol: '🦂', fortune: 'Transformation comes' },
    { name: 'Phoenix', symbol: '🔥', fortune: 'Rise and renew' },
    { name: 'Dragon', symbol: '🐉', fortune: 'Power awakens' },
    { name: 'Swan', symbol: '🦢', fortune: 'Grace flows' }
  ];

  const [cards, setCards] = useState([]);

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const pairsCount = Math.min(3 + level, 6);
    const selectedConstellations = constellations.slice(0, pairsCount);
    const gameCards = [...selectedConstellations, ...selectedConstellations]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMessage('');
  };

  const handleCardClick = (id) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].name === cards[second].name) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setScore(score + 10);
        setMessage(`✨ Matched ${cards[first].name}!`);
        
        if (matched.length + 2 === cards.length) {
          setMessage(`🎉 Level ${level} Complete! Next level incoming...`);
          setTimeout(() => {
            setLevel(level + 1);
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setMessage('Try again!');
        }, 800);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setMessage('');
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Star Matcher</h1>
          <p className="text-gray-400">Match constellations to unlock cosmic fortunes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-purple-500/30 text-center">
            <div className="text-xs text-gray-400 uppercase">Score</div>
            <div className="text-3xl font-bold text-purple-400">{score}</div>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-blue-500/30 text-center">
            <div className="text-xs text-gray-400 uppercase">Level</div>
            <div className="text-3xl font-bold text-blue-400">{level}</div>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/30 text-center">
            <div className="text-xs text-gray-400 uppercase">Moves</div>
            <div className="text-3xl font-bold text-cyan-400">{moves}</div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="text-center mb-6 text-lg font-semibold text-yellow-300 animate-bounce">
            {message}
          </div>
        )}

        {/* Game Grid */}
        <div className={`grid gap-4 mb-8 justify-items-center mx-auto w-fit`} 
             style={{ gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 1fr)` }}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`
                w-20 h-20 rounded-lg font-bold text-2xl transition-all duration-300 transform
                ${flipped.includes(index) || matched.includes(index)
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 scale-100'
                  : 'bg-[#2a2a2a] hover:scale-110 cursor-pointer border border-gray-600'
                }
                ${matched.includes(index) ? 'opacity-60' : ''}
              `}
              disabled={matched.includes(index)}
            >
              {flipped.includes(index) || matched.includes(index) ? card.symbol : '?'}
            </button>
          ))}
        </div>

        {/* Fortune Display */}
        {matched.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-3">💫 Matched Fortunes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {matched.slice(0, matched.length / 2).map(id => (
                <div key={id} className="bg-[#1a1a1a] p-3 rounded border border-purple-500/30 text-center text-sm">
                  <div className="text-xl mb-1">{cards[id].symbol}</div>
                  <div className="font-semibold text-purple-300">{cards[id].name}</div>
                  <div className="text-xs text-gray-400 italic mt-1">"{cards[id].fortune}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto transition-all"
          >
            <RotateCcw size={20} />
            New Game
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StarMatcher;
