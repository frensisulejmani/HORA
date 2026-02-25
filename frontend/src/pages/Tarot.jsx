import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Tarot = () => {
  const [drawnCards, setDrawnCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);
  const canvasRef = useRef(null);
  const interpretationRef = useRef(null);

  const tarotCards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];

  const cardMeanings = {
    "The Fool": "innocence, new beginnings, free spirit",
    "The Magician": "power, skill, concentration, action",
    "The High Priestess": "intuition, subconscious, mystery",
    "The Empress": "fertility, nurturing, abundance",
    "The Emperor": "authority, structure, control",
    "The Hierophant": "tradition, guidance, spiritual wisdom",
    "The Lovers": "relationships, choices, harmony",
    "The Chariot": "willpower, victory, determination",
    "Strength": "courage, compassion, inner strength",
    "The Hermit": "solitude, introspection, guidance",
    "Wheel of Fortune": "cycles, destiny, turning points",
    "Justice": "fairness, truth, law",
    "The Hanged Man": "sacrifice, new perspective, surrender",
    "Death": "endings, transformation, transition",
    "Temperance": "balance, moderation, patience",
    "The Devil": "addiction, materialism, restriction",
    "The Tower": "sudden change, upheaval, revelation",
    "The Star": "hope, inspiration, serenity",
    "The Moon": "illusion, intuition, subconscious fears",
    "The Sun": "joy, success, vitality",
    "Judgement": "reflection, awakening, inner calling",
    "The World": "completion, accomplishment, fulfillment"
  };

  // Star Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.01 + 0.002;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0.1) this.speed = -this.speed;
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: (canvas.width * canvas.height) / 8000 }, () => new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const drawCards = () => {
    setIsGenerating(true);
    setShowInterpretation(true);
    setInterpretation('Generating your cosmic insights...');
    
    const available = [...tarotCards];
    const selection = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selection.push(available.splice(idx, 1)[0]);
    }
    setDrawnCards(selection);

    // AI Simulation Delay
    setTimeout(() => {
      setIsGenerating(false);
      generateText(selection);
      // Smooth scroll to the result after it's generated
      interpretationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
  };

  const generateText = (cards) => {
    const text = (
      <div className="space-y-4">
        <p>Based on the cards drawn—<strong>{cards[0]}</strong>, <strong>{cards[1]}</strong>, and <strong>{cards[2]}</strong>—here is your personalized reading:</p>
        <p>The presence of <strong>{cards[0]}</strong> suggests a new beginning or the start of an adventure. It speaks to your potential and the unwritten path ahead.</p>
        <p>Following this, <strong>{cards[1]}</strong> indicates {cardMeanings[cards[1]]}. This card highlights introspection and hidden knowledge.</p>
        <p>Finally, <strong>{cards[2]}</strong> brings focus to {cardMeanings[cards[2]]}, representing significant change or a shift in perspective.</p>
        <p className="mt-4 italic">Together, these cards advise you to embrace the unknown and trust your intuition.</p>
      </div>
    );
    setInterpretation(text);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Layers */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className="fixed inset-0 z-1 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/15 blur-[100px] animate-pulse delay-700" />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-48 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-b from-white to-purple-500 bg-clip-text text-transparent">
          Tarot AI Reading
        </h1>
        <p className="max-w-2xl text-lg opacity-70 leading-relaxed mb-10">
          Focus on your question or intention, then click "Draw Cards" to receive a personalized tarot reading interpreted by our advanced AI.
        </p>

        <button 
          onClick={drawCards}
          disabled={isGenerating}
          className={`bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] transform hover:-translate-y-1 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGenerating ? 'Consulting the Stars...' : 'Draw Cards'}
        </button>

        {/* Card Display */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {(drawnCards.length > 0 ? drawnCards : [1, 2, 3]).map((card, i) => (
            <div key={i} className="group relative w-44 h-64 md:w-48 md:h-72 bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center p-4 shadow-2xl transition-all hover:border-purple-500">
              {drawnCards.length > 0 ? (
                <>
                  <img 
                    src={`https://placeholder.co/150x250/A855F7/FFFFFF@2x?text=${card.replace(/ /g, '+')}`} 
                    alt={card} 
                    className="w-full h-full object-contain rounded-lg mb-2"
                  />
                  <span className="text-sm font-semibold">{card}</span>
                </>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <div className="w-12 h-12 border-2 border-dashed border-purple-400/50 rounded-full mb-2" />
                  <span className="text-sm">Card {i + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Interpretation */}
        {showInterpretation && (
          <div ref={interpretationRef} className="mt-16 max-w-4xl w-full bg-white/5 backdrop-blur-lg border border-purple-500/30 rounded-4xl p-8 md:p-12 text-left shadow-2xl transition-all duration-700">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-6 text-center">Your AI Tarot Interpretation</h3>
            <div className="text-lg leading-relaxed opacity-90">
              {interpretation}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tarot;