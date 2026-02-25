import React, { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SoulElementQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ earth: 0, water: 0, fire: 0, air: 0 });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: 'In your natural state, you are most:',
      answers: [
        { text: 'Grounded and stable', element: 'earth', value: 1 },
        { text: 'Flowing and adaptable', element: 'water', value: 1 },
        { text: 'Passionate and energetic', element: 'fire', value: 1 },
        { text: 'Free-thinking and curious', element: 'air', value: 1 }
      ]
    },
    {
      question: 'When facing change, you:',
      answers: [
        { text: 'Create a solid plan', element: 'earth', value: 1 },
        { text: 'Go with the flow', element: 'water', value: 1 },
        { text: 'Dive in headfirst', element: 'fire', value: 1 },
        { text: 'Analyze all possibilities', element: 'air', value: 1 }
      ]
    },
    {
      question: 'Your energy is best described as:',
      answers: [
        { text: 'Steady and reliable', element: 'earth', value: 1 },
        { text: 'Emotional and intuitive', element: 'water', value: 1 },
        { text: 'Bright and dynamic', element: 'fire', value: 1 },
        { text: 'Quick and innovative', element: 'air', value: 1 }
      ]
    },
    {
      question: 'You feel most alive when:',
      answers: [
        { text: 'Building something real', element: 'earth', value: 1 },
        { text: 'Connecting emotionally', element: 'water', value: 1 },
        { text: 'Taking on new challenges', element: 'fire', value: 1 },
        { text: 'Exploring new ideas', element: 'air', value: 1 }
      ]
    },
    {
      question: 'Your biggest strength is:',
      answers: [
        { text: 'Dependability', element: 'earth', value: 1 },
        { text: 'Empathy', element: 'water', value: 1 },
        { text: 'Courage', element: 'fire', value: 1 },
        { text: 'Clarity', element: 'air', value: 1 }
      ]
    },
    {
      question: 'In relationships, you:',
      answers: [
        { text: 'Provide stability and support', element: 'earth', value: 1 },
        { text: 'Feel and mirror emotions', element: 'water', value: 1 },
        { text: 'Inspire and motivate', element: 'fire', value: 1 },
        { text: 'Communicate and connect intellectually', element: 'air', value: 1 }
      ]
    },
    {
      question: 'Your ideal environment is:',
      answers: [
        { text: 'Organized and comfortable', element: 'earth', value: 1 },
        { text: 'Harmonious and peaceful', element: 'water', value: 1 },
        { text: 'Active and stimulating', element: 'fire', value: 1 },
        { text: 'Open and spacious', element: 'air', value: 1 }
      ]
    },
    {
      question: 'What matters most in life:',
      answers: [
        { text: 'Security and accomplishment', element: 'earth', value: 1 },
        { text: 'Connection and healing', element: 'water', value: 1 },
        { text: 'Impact and transformation', element: 'fire', value: 1 },
        { text: 'Truth and understanding', element: 'air', value: 1 }
      ]
    }
  ];

  const elements = {
    earth: {
      title: '🌍 Earth Element',
      color: 'from-amber-600 to-green-700',
      description: 'You are grounded, practical, and reliable. Your soul resonates with stability and tangible results. You build lasting foundations and bring others back to solid ground.',
      traits: ['Grounded', 'Practical', 'Dependable', 'Nurturing', 'Stable'],
      gift: 'Creating secure foundations for growth'
    },
    water: {
      title: '💧 Water Element',
      color: 'from-blue-500 to-teal-500',
      description: 'You are intuitive, compassionate, and deeply feeling. Your soul flows with emotional wisdom and healing power. You adapt while maintaining depth.',
      traits: ['Intuitive', 'Empathetic', 'Adaptable', 'Healing', 'Reflective'],
      gift: 'Emotional intelligence and transformation'
    },
    fire: {
      title: '🔥 Fire Element',
      color: 'from-red-500 to-orange-500',
      description: 'You are passionate, courageous, and transformative. Your soul burns with purpose and creative power. You inspire change and ignite possibility.',
      traits: ['Passionate', 'Courageous', 'Creative', 'Dynamic', 'Inspiring'],
      gift: 'Catalyzing transformation'
    },
    air: {
      title: '💨 Air Element',
      color: 'from-sky-400 to-violet-500',
      description: 'You are intellectual, curious, and communicative. Your soul soars through ideas and new perspectives. You illuminate truth and connect disparate dots.',
      traits: ['Intellectual', 'Curious', 'Communicative', 'Visionary', 'Analytical'],
      gift: 'Bringing clarity and connection'
    }
  };

  const handleAnswer = (element) => {
    setScores({
      ...scores,
      [element]: scores[element] + 1
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getPrimaryElement = () => {
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ earth: 0, water: 0, fire: 0, air: 0 });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🌀 Soul Element Quiz</h1>
          <p className="text-gray-400">Discover your elemental essence</p>
        </div>

        {!showResults ? (
          <div className="space-y-8">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-sm text-gray-400">{Math.round((currentQuestion / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-amber-400 to-green-400 h-full transition-all duration-500"
                  style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-green-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].question}</h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer.element)}
                    className="w-full text-left p-4 rounded-lg border border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all bg-[#0a0a0a]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{answer.text}</span>
                      <ChevronRight size={20} className="text-green-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const result = elements[getPrimaryElement()];
              return (
                <>
                  <div className={`bg-linear-to-br ${result.color} bg-opacity-20 border border-current rounded-lg p-8`}>
                    <div className="text-6xl mb-4 text-center">{result.title.charAt(0)}</div>
                    <h2 className="text-3xl font-bold mb-2 text-center">{result.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{result.description}</p>
                    
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      {result.traits.map((trait, idx) => (
                        <div key={idx} className="bg-white/10 rounded px-3 py-2 text-center text-sm font-medium">
                          {trait}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center bg-black/30 rounded-lg p-4">
                      <p className="text-sm text-gray-400 uppercase mb-1">Your Gift</p>
                      <p className="text-xl font-bold">{result.gift}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    {Object.entries(scores).map(([key, score]) => (
                      <div key={key} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                        <div className="text-xs text-gray-400 uppercase mb-1">{key}</div>
                        <div className="text-3xl font-bold text-green-400">{score}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={resetQuiz}
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-bold transition-all"
                    >
                      <RotateCcw size={20} />
                      Retake
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SoulElementQuiz;
