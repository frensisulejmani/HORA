import React, { useState, useEffect } from 'react';
import { Sword, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ZodiacQuest = () => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [currentScene, setCurrentScene] = useState(0);
  const [health, setHealth] = useState(100);
  const [wisdom, setWisdom] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [choiceHistory, setChoiceHistory] = useState([]);

  const scenes = [
    {
      title: 'The Cosmic Awakening',
      description: 'You find yourself in a mystical realm. The zodiac wheel spins above you, each sign glowing with divine energy.',
      choices: [
        { text: '🦁 Embrace the Leo fire (Bold & Courageous)', action: 'addWisdom', value: 10, next: 1, flavor: 'Your courage awakens' },
        { text: '♏ Channel Scorpio power (Deep & Mysterious)', action: 'addWisdom', value: 15, next: 1, flavor: 'You sense hidden truths' }
      ]
    },
    {
      title: 'The Guardian\'s Test',
      description: 'A celestial guardian blocks your path. She asks: "What is your greatest strength?"',
      choices: [
        { text: '♓ Compassion and intuition', action: 'addWisdom', value: 10, next: 2, flavor: 'The guardian smiles' },
        { text: '♈ Raw determination', action: 'addWisdom', value: 12, next: 2, flavor: 'The guardian nods' }
      ]
    },
    {
      title: 'The Cosmic Trial',
      description: 'Three trials await. Choose your path:',
      choices: [
        { text: '🌙 Moon Trial (Emotions & Intuition)', action: 'addWisdom', value: 15, next: 3, flavor: 'You understand your heart' },
        { text: '☀️ Sun Trial (Will & Purpose)', action: 'addWisdom', value: 15, next: 3, flavor: 'Your purpose clarifies' },
        { text: '⭐ Ascendant Trial (Transformation)', action: 'addWisdom', value: 20, next: 3, flavor: 'You transcend limitations' }
      ]
    },
    {
      title: 'Alignment Achieved',
      description: 'The cosmic forces recognize your alignment. You have proven yourself worthy.',
      choices: [
        { text: '✨ View Your Cosmic Reading', action: 'end' }
      ]
    }
  ];

  const handleChoice = (choice) => {
    setChoiceHistory([...choiceHistory, choice]);

    if (choice.action === 'addWisdom') {
      setWisdom(wisdom + choice.value);
      setInventory([...inventory, choice.flavor]);
      
      if (choice.next !== undefined && choice.next < scenes.length) {
        setTimeout(() => setCurrentScene(choice.next), 1000);
      }
    } else if (choice.action === 'end') {
      setGameState('result');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScene(0);
    setHealth(100);
    setWisdom(0);
    setInventory([]);
    setChoiceHistory([]);
  };

  const resetGame = () => {
    setGameState('intro');
    setCurrentScene(0);
    setHealth(100);
    setWisdom(0);
    setInventory([]);
    setChoiceHistory([]);
  };

  const getCosmicReading = () => {
    const readings = [
      { min: 0, max: 30, title: '🌙 Dreamer', desc: 'You are awakening to your cosmic potential. Trust your intuition.' },
      { min: 31, max: 50, title: '⭐ Seeker', desc: 'You are actively pursuing spiritual growth. Keep asking the right questions.' },
      { min: 51, max: 70, title: '✨ Aligned', desc: 'You have found harmony with your cosmic nature. Share your light.' },
      { min: 71, max: 100, title: '🌟 Ascended', desc: 'You embody cosmic consciousness. You are ready to guide others.' }
    ];
    return readings.find(r => wisdom >= r.min && wisdom <= r.max);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Zodiac Quest</h1>
          <p className="text-gray-400">A narrative adventure based on cosmic alignment</p>
        </div>

        {/* INTRO STATE */}
        {gameState === 'intro' && (
          <div className="space-y-6">
            <div className="bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">🌌 Your Journey Begins</h2>
              <p className="text-gray-300 mb-4">
                Step into a mystical realm where the zodiac wheel guides your destiny. Make choices aligned with your cosmic nature and unlock cosmic wisdom.
              </p>
              <p className="text-sm text-gray-400">
                Your decisions will shape your path. There are no wrong answers—only different destinies.
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Begin Your Quest
            </button>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-purple-500/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold">Cosmic Wisdom</span>
                <span className="text-lg font-bold text-purple-400">{wisdom}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(wisdom / 100 * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Scene */}
            <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-purple-500/30 rounded-lg p-8 space-y-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">
                {scenes[currentScene].title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {scenes[currentScene].description}
              </p>

              {/* Inventory */}
              {inventory.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Journey So Far</p>
                  <div className="flex flex-wrap gap-2">
                    {inventory.map((item, idx) => (
                      <span key={idx} className="bg-blue-500/20 border border-blue-500/50 px-3 py-1 rounded text-sm text-blue-300">
                        ✨ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {scenes[currentScene].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 rounded-lg border border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/20 transition-all bg-[#1a1a1a] hover:translate-x-2"
                >
                  <div className="font-semibold text-purple-300">{choice.text}</div>
                  <div className="text-xs text-gray-500 mt-1">+{choice.value} Wisdom • {choice.flavor}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {gameState === 'result' && (
          <div className="space-y-8">
            {(() => {
              const reading = getCosmicReading();
              return (
                <div className="space-y-6">
                  {/* Result Card */}
                  <div className="bg-linear-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/50 rounded-lg p-8 text-center">
                    <div className="text-5xl mb-4">{reading.title.split(' ')[0]}</div>
                    <h2 className="text-3xl font-bold mb-2">{reading.title}</h2>
                    <p className="text-gray-300 text-lg mb-4">{reading.desc}</p>
                    <div className="inline-block bg-purple-500/20 border border-purple-500/50 px-6 py-3 rounded-lg">
                      <p className="text-xs text-gray-400 uppercase">Total Wisdom Gained</p>
                      <p className="text-4xl font-bold text-purple-300">{wisdom}</p>
                    </div>
                  </div>

                  {/* Journey Summary */}
                  <div className="bg-[#1a1a1a] border border-blue-500/30 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4">🌟 Your Journey</h3>
                    <div className="space-y-2">
                      {inventory.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid gap-4">
                    <button
                      onClick={resetGame}
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-lg font-bold transition-all"
                    >
                      <RotateCcw size={20} />
                      New Quest
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ZodiacQuest;
