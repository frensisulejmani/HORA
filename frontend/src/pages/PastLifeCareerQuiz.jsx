import React, { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PastLifeCareerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ 
    artist: 0, 
    healer: 0, 
    warrior: 0, 
    scholar: 0,
    mystic: 0,
    diplomat: 0
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: 'What has always fascinated you most:',
      answers: [
        { text: 'Creating beauty and expression', career: 'artist', value: 1 },
        { text: 'Helping and healing others', career: 'healer', value: 1 },
        { text: 'Standing up for what\'s right', career: 'warrior', value: 1 },
        { text: 'Understanding how things work', career: 'scholar', value: 1 },
        { text: 'Mysteries and hidden truths', career: 'mystic', value: 1 },
        { text: 'Bringing people together', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'Your natural talent is:',
      answers: [
        { text: 'Artistic expression and vision', career: 'artist', value: 1 },
        { text: 'Intuitive understanding', career: 'healer', value: 1 },
        { text: 'Leadership and courage', career: 'warrior', value: 1 },
        { text: 'Research and analysis', career: 'scholar', value: 1 },
        { text: 'Seeing beyond the veil', career: 'mystic', value: 1 },
        { text: 'Conflict resolution', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'When you imagine your purpose, it involves:',
      answers: [
        { text: 'Inspiring souls through art', career: 'artist', value: 1 },
        { text: 'Mending broken hearts', career: 'healer', value: 1 },
        { text: 'Fighting injustice', career: 'warrior', value: 1 },
        { text: 'Discovering profound knowledge', career: 'scholar', value: 1 },
        { text: 'Guiding spiritual seekers', career: 'mystic', value: 1 },
        { text: 'Building bridges', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'In past lives, you were probably:',
      answers: [
        { text: 'A renowned painter or musician', career: 'artist', value: 1 },
        { text: 'A medicine woman or priest', career: 'healer', value: 1 },
        { text: 'A knight or revolutionary', career: 'warrior', value: 1 },
        { text: 'A philosopher or librarian', career: 'scholar', value: 1 },
        { text: 'A wise oracle or shaman', career: 'mystic', value: 1 },
        { text: 'A peace negotiator or sovereign', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'What brings you closest to transcendence:',
      answers: [
        { text: 'Creating or witnessing art', career: 'artist', value: 1 },
        { text: 'Healing and service', career: 'healer', value: 1 },
        { text: 'Standing in your power', career: 'warrior', value: 1 },
        { text: 'Learning and contemplation', career: 'scholar', value: 1 },
        { text: 'Spiritual practice and ritual', career: 'mystic', value: 1 },
        { text: 'Union and harmony', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'Your deepest frustration is:',
      answers: [
        { text: 'World not appreciating beauty', career: 'artist', value: 1 },
        { text: 'People suffering unnecessarily', career: 'healer', value: 1 },
        { text: 'Injustice going unchallenged', career: 'warrior', value: 1 },
        { text: 'Ignorance and closed minds', career: 'scholar', value: 1 },
        { text: 'Spiritual disconnection', career: 'mystic', value: 1 },
        { text: 'Division and conflict', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'People seek you for:',
      answers: [
        { text: 'Inspiration and beauty', career: 'artist', value: 1 },
        { text: 'Comfort and guidance', career: 'healer', value: 1 },
        { text: 'Strength and protection', career: 'warrior', value: 1 },
        { text: 'Wisdom and answers', career: 'scholar', value: 1 },
        { text: 'Spiritual awakening', career: 'mystic', value: 1 },
        { text: 'Mediation and unity', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'Your legacy should be:',
      answers: [
        { text: 'Enduring beauty and art', career: 'artist', value: 1 },
        { text: 'Countless people healed', career: 'healer', value: 1 },
        { text: 'Positive change through action', career: 'warrior', value: 1 },
        { text: 'Revolutionary knowledge', career: 'scholar', value: 1 },
        { text: 'Spiritual transformation', career: 'mystic', value: 1 },
        { text: 'Peace and understanding', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'What scares you most:',
      answers: [
        { text: 'Losing your creative spark', career: 'artist', value: 1 },
        { text: 'Being unable to help', career: 'healer', value: 1 },
        { text: 'Powerlessness against evil', career: 'warrior', value: 1 },
        { text: 'Never finding truth', career: 'scholar', value: 1 },
        { text: 'Spiritual emptiness', career: 'mystic', value: 1 },
        { text: 'Irreparable conflict', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'The world needs you to be a:',
      answers: [
        { text: 'Creator and visionary', career: 'artist', value: 1 },
        { text: 'Healer and guide', career: 'healer', value: 1 },
        { text: 'Champion of justice', career: 'warrior', value: 1 },
        { text: 'Seeker of truth', career: 'scholar', value: 1 },
        { text: 'Spiritual messenger', career: 'mystic', value: 1 },
        { text: 'Builder of peace', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'Your greatest accomplishment would involve:',
      answers: [
        { text: 'Creating timeless beauty', career: 'artist', value: 1 },
        { text: 'Transforming lives through care', career: 'healer', value: 1 },
        { text: 'Overcoming great obstacles', career: 'warrior', value: 1 },
        { text: 'Discovering hidden wisdom', career: 'scholar', value: 1 },
        { text: 'Awakening mass consciousness', career: 'mystic', value: 1 },
        { text: 'Uniting opposing forces', career: 'diplomat', value: 1 }
      ]
    },
    {
      question: 'When serving humanity, you feel:',
      answers: [
        { text: 'Inspired and alive', career: 'artist', value: 1 },
        { text: 'Compassionate and fulfilled', career: 'healer', value: 1 },
        { text: 'Powerful and righteous', career: 'warrior', value: 1 },
        { text: 'Enlightened and clear', career: 'scholar', value: 1 },
        { text: 'Connected to something greater', career: 'mystic', value: 1 },
        { text: 'Bringing light to darkness', career: 'diplomat', value: 1 }
      ]
    }
  ];

  const careers = {
    artist: {
      title: '🎨 The Artist',
      color: 'from-pink-500 to-red-500',
      description: 'In your past life, you were a master of beauty and expression. A painter, musician, poet, or visionary who created works that moved souls and transcended time. You left the world more beautiful than you found it.',
      gifts: ['Vision', 'Creativity', 'Expression', 'Inspiration', 'Beauty'],
      message: 'Your ancient creative spirit still burns. The world awaits your unique vision.'
    },
    healer: {
      title: '💚 The Healer',
      color: 'from-green-500 to-teal-500',
      description: 'You were a medicine woman, priest, or counselor dedicating your life to mending broken bodies and souls. Your touch brought comfort, your words brought hope, your presence brought healing.',
      gifts: ['Compassion', 'Intuition', 'Wisdom', 'Empathy', 'Transformation'],
      message: 'Your healing hands transcended lifetimes. Your gift is still needed.'
    },
    warrior: {
      title: '⚔️ The Warrior',
      color: 'from-red-500 to-orange-500',
      description: 'You were a knight, leader, or champion who stood against darkness. Brave, strategic, and unwavering in your convictions. You fought so others could be free.',
      gifts: ['Courage', 'Leadership', 'Strength', 'Conviction', 'Protection'],
      message: 'Your warrior spirit echoes through time. Awaken to your power.'
    },
    scholar: {
      title: '📚 The Scholar',
      color: 'from-blue-500 to-indigo-500',
      description: 'You were a philosopher, researcher, or sage seeking truth. In libraries, laboratories, and ancient texts, you uncovered wisdom that changed how humanity understood itself.',
      gifts: ['Wisdom', 'Analysis', 'Knowledge', 'Clarity', 'Understanding'],
      message: 'Your ancient knowledge still whispers through you. Listen.'
    },
    mystic: {
      title: '🔮 The Mystic',
      color: 'from-purple-500 to-pink-500',
      description: 'You were a mystic, oracle, or spiritual guide. Connected to realms beyond the veil, you channeled divine wisdom and guided souls on their journeys. You held the secrets of the universe.',
      gifts: ['Intuition', 'Spirituality', 'Vision', 'Connection', 'Transcendence'],
      message: 'Your mystical connection remains unbroken. Trust what you see.'
    },
    diplomat: {
      title: '🕊️ The Diplomat',
      color: 'from-cyan-500 to-blue-500',
      description: 'You were a peace negotiator, ambassador, or bridge-builder. Through grace and wisdom, you brought opposing forces together and created harmony from chaos.',
      gifts: ['Harmony', 'Communication', 'Wisdom', 'Balance', 'Unity'],
      message: 'Your peace-making gift transcends time. The world needs you to unite.'
    }
  };

  const handleAnswer = (career) => {
    setScores({
      ...scores,
      [career]: scores[career] + 1
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getPastLifeCareer = () => {
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ artist: 0, healer: 0, warrior: 0, scholar: 0, mystic: 0, diplomat: 0 });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">✨ Past Life Career</h1>
          <p className="text-gray-400">Discover your soul's ancient calling</p>
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
                  className="bg-linear-to-r from-purple-400 to-pink-400 h-full transition-all duration-500"
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
                    onClick={() => handleAnswer(answer.career)}
                    className="w-full text-left p-4 rounded-lg border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all bg-[#0a0a0a]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{answer.text}</span>
                      <ChevronRight size={20} className="text-purple-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const result = careers[getPastLifeCareer()];
              return (
                <>
                  <div className={`bg-linear-to-br ${result.color} bg-opacity-20 border border-current rounded-lg p-8`}>
                    <div className="text-6xl mb-4 text-center">{result.title.charAt(0)}</div>
                    <h2 className="text-3xl font-bold mb-4 text-center">{result.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{result.description}</p>
                    
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      {result.gifts.map((gift, idx) => (
                        <div key={idx} className="bg-white/10 rounded px-3 py-2 text-center text-sm font-medium">
                          {gift}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center bg-black/30 rounded-lg p-4">
                      <p className="text-lg font-bold italic text-yellow-300">{result.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {Object.entries(scores).map(([key, score]) => (
                      <div key={key} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3">
                        <div className="text-gray-400 mb-1 capitalize">{key}</div>
                        <div className="text-2xl font-bold text-purple-400">{score}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={resetQuiz}
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-bold transition-all"
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

export default PastLifeCareerQuiz;
