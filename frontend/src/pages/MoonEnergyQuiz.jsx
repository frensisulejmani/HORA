import React, { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MoonEnergyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ emotional: 0, intuitive: 0, nurturing: 0, protective: 0 });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: 'When faced with conflict, you typically:',
      answers: [
        { text: 'Feel deeply and need time to process', archetype: 'emotional', value: 1 },
        { text: 'Trust your gut instinct immediately', archetype: 'intuitive', value: 1 },
        { text: 'Focus on comfort and harmony', archetype: 'nurturing', value: 1 },
        { text: 'Become defensive of those you care for', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'Your ideal evening involves:',
      answers: [
        { text: 'Deep conversations about feelings', archetype: 'emotional', value: 1 },
        { text: 'Following intuitive adventures', archetype: 'intuitive', value: 1 },
        { text: 'Cozy time with loved ones', archetype: 'nurturing', value: 1 },
        { text: 'Protecting boundaries and solitude', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'In relationships, you are known for:',
      answers: [
        { text: 'Experiencing intense emotions', archetype: 'emotional', value: 1 },
        { text: 'Reading people\'s unspoken needs', archetype: 'intuitive', value: 1 },
        { text: 'Offering support and care', archetype: 'nurturing', value: 1 },
        { text: 'Being fiercely loyal and defensive', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'When stressed, you typically:',
      answers: [
        { text: 'Feel overwhelmed with emotions', archetype: 'emotional', value: 1 },
        { text: 'Sense what you need to do', archetype: 'intuitive', value: 1 },
        { text: 'Reach out to comfort others', archetype: 'nurturing', value: 1 },
        { text: 'Withdraw to protect yourself', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'What matters most to you:',
      answers: [
        { text: 'Authentic emotional expression', archetype: 'emotional', value: 1 },
        { text: 'Trusting divine timing', archetype: 'intuitive', value: 1 },
        { text: 'Creating safe spaces for others', archetype: 'nurturing', value: 1 },
        { text: 'Keeping loved ones secure', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'Your greatest challenge is:',
      answers: [
        { text: 'Managing emotional floods', archetype: 'emotional', value: 1 },
        { text: 'Doubting your intuition', archetype: 'intuitive', value: 1 },
        { text: 'Setting healthy boundaries', archetype: 'nurturing', value: 1 },
        { text: 'Trusting others\' intentions', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'You feel most fulfilled when:',
      answers: [
        { text: 'Your feelings are validated', archetype: 'emotional', value: 1 },
        { text: 'You follow your inner knowing', archetype: 'intuitive', value: 1 },
        { text: 'You help someone feel better', archetype: 'nurturing', value: 1 },
        { text: 'Your tribe feels protected', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'Your ideal friend is someone who:',
      answers: [
        { text: 'Understands your feelings deeply', archetype: 'emotional', value: 1 },
        { text: 'Gets your unspoken signals', archetype: 'intuitive', value: 1 },
        { text: 'Shares nurturing energy', archetype: 'nurturing', value: 1 },
        { text: 'Has your back no matter what', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'In groups, you are the one who:',
      answers: [
        { text: 'Feels everyone\'s emotional energy', archetype: 'emotional', value: 1 },
        { text: 'Knows what\'s unsaid', archetype: 'intuitive', value: 1 },
        { text: 'Makes sure everyone feels included', archetype: 'nurturing', value: 1 },
        { text: 'Watches out for group safety', archetype: 'protective', value: 1 }
      ]
    },
    {
      question: 'Your superpower is:',
      answers: [
        { text: 'Deep emotional wisdom', archetype: 'emotional', value: 1 },
        { text: 'Psychic sensitivity', archetype: 'intuitive', value: 1 },
        { text: 'Unconditional compassion', archetype: 'nurturing', value: 1 },
        { text: 'Fierce protectiveness', archetype: 'protective', value: 1 }
      ]
    }
  ];

  const archetypes = {
    emotional: {
      title: '🌊 Emotional Moon',
      color: 'from-blue-500 to-cyan-500',
      description: 'Your moon craves authentic emotional connection and expression. You are a feeling entity with deep wells of sensitivity and wisdom. Your journey is learning to navigate your rich inner world.'
    },
    intuitive: {
      title: '🔮 Intuitive Moon',
      color: 'from-purple-500 to-pink-500',
      description: 'Your moon speaks in whispers and signs. You are naturally psychic with strong gut instincts. Your gift is trusting what you sense before your mind catches up.'
    },
    nurturing: {
      title: '🌸 Nurturing Moon',
      color: 'from-green-500 to-emerald-500',
      description: 'Your moon finds purpose in caring and creating comfort. You are the nurturer, the healer, the safe space. Your challenge is remembering to nurture yourself too.'
    },
    protective: {
      title: '🛡️ Protective Moon',
      color: 'from-red-500 to-orange-500',
      description: 'Your moon is a guardian. You fiercely protect those you love and stand firm against threats. Your strength lies in unwavering loyalty and boundaries.'
    }
  };

  const handleAnswer = (archetype) => {
    setScores({
      ...scores,
      [archetype]: scores[archetype] + 1
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getMoonArchetype = () => {
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ emotional: 0, intuitive: 0, nurturing: 0, protective: 0 });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🌙 Moon Energy Quiz</h1>
          <p className="text-gray-400">Discover your moon archetype</p>
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
                  className="bg-linear-to-r from-blue-400 to-purple-400 h-full transition-all duration-500"
                  style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-purple-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].question}</h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer.archetype)}
                    className="w-full text-left p-4 rounded-lg border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all bg-[#0a0a0a]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{answer.text}</span>
                      <ChevronRight size={20} className="text-purple-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const result = archetypes[getMoonArchetype()];
              return (
                <>
                  <div className={`bg-linear-to-br ${result.color} bg-opacity-20 border border-current rounded-lg p-8 text-center`}>
                    <div className="text-6xl mb-4">{result.title.charAt(0)}</div>
                    <h2 className="text-3xl font-bold mb-4">{result.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{result.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    {Object.entries(scores).map(([key, score]) => (
                      <div key={key} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                        <div className="text-xs text-gray-400 uppercase mb-1">{archetypes[key].title.split(' ')[0]}</div>
                        <div className="text-3xl font-bold text-purple-400">{score}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={resetQuiz}
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-3 rounded-lg font-bold transition-all"
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

export default MoonEnergyQuiz;
