import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, LucideRotateCcw, Eye } from 'lucide-react';

// Import all 22 images manually
import c1 from '../assets/cards/c1.png';
import c2 from '../assets/cards/c2.png';
import c3 from '../assets/cards/c3.png';
import c4 from '../assets/cards/c4.png';
import c5 from '../assets/cards/c5.png';
import c6 from '../assets/cards/c6.png';
import c7 from '../assets/cards/c7.png';
import c8 from '../assets/cards/c8.png';
import c9 from '../assets/cards/c9.png';
import c10 from '../assets/cards/c10.png';
import c11 from '../assets/cards/c11.png';
import c12 from '../assets/cards/c12.png';
import c13 from '../assets/cards/c13.png';
import c14 from '../assets/cards/c14.png';
import c15 from '../assets/cards/c15.png';
import c16 from '../assets/cards/c16.png';
import c17 from '../assets/cards/c17.png';
import c18 from '../assets/cards/c18.png';
import c19 from '../assets/cards/c19.png';
import c20 from '../assets/cards/c20.png';
import c21 from '../assets/cards/c21.png';
import c22 from '../assets/cards/c22.png';

const Tarot = () => {
  const [drawnCards, setDrawnCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);
  const canvasRef = useRef(null);
  const interpretationRef = useRef(null);

  // FIX: Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tarotCards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];

  const cardImages = {
    "The Fool": c1, "The Magician": c2, "The High Priestess": c3, "The Empress": c4,
    "The Emperor": c5, "The Hierophant": c6, "The Lovers": c7, "The Chariot": c8,
    "Strength": c9, "The Hermit": c10, "Wheel of Fortune": c11, "Justice": c12,
    "The Hanged Man": c13, "Death": c14, "Temperance": c15, "The Devil": c16,
    "The Tower": c17, "The Star": c18, "The Moon": c19, "The Sun": c20,
    "Judgement": c21, "The World": c22
  };

  const cardMeanings = {
    "The Fool": "innocence and new beginnings.", "The Magician": "manifestation and power.",
    "The High Priestess": "intuition and mystery.", "The Empress": "creativity and abundance.",
    "The Emperor": "structure and authority.", "The Hierophant": "tradition and belief.",
    "The Lovers": "choices and alignment.", "The Chariot": "willpower and victory.",
    "Strength": "courage and compassion.", "The Hermit": "solitude and guidance.",
    "Wheel of Fortune": "change and destiny.", "Justice": "truth and cause/effect.",
    "The Hanged Man": "surrender and perspective.", "Death": "transformation and endings.",
    "Temperance": "patience and balance.", "The Devil": "attachment and shadow.",
    "The Tower": "sudden upheaval.", "The Star": "hope and inspiration.",
    "The Moon": "illusion and anxiety.", "The Sun": "vitality and joy.",
    "Judgement": "rebirth and calling.", "The World": "completion and travel."
  };

  // Cosmic Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.005 + 0.002;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
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
      stars.forEach(star => { star.update(); star.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    init(); animate();
    window.addEventListener('resize', init);
    return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationFrameId); };
  }, []);

  const drawCards = async () => {
    setIsGenerating(true);
    setShowInterpretation(false);
    
    const available = [...tarotCards];
    const selection = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selection.push(available.splice(idx, 1)[0]);
    }
    setDrawnCards(selection);

    try {
      // 1. ATTEMPT AI READING
      const response = await fetch('http://localhost:5000/api/ai/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cards: selection,
          context: "detailed mystical reading" // Used by backend to trigger longer prompt
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();

      setInterpretation(
        <div className="space-y-8">
          <div className="p-4 border-l-2 border-purple-500 bg-purple-500/10 rounded-r-xl">
            <p className="text-xl font-light italic text-purple-200">"The digital ether has aligned these symbols for you..."</p>
          </div>
          <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
            {data.reading || data.interpretation}
          </div>
          <div className="pt-4 flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-sm font-['Poppins']">
            <Sparkles size={16} /> Cosmic Insight: Trust the process.
          </div>
        </div>
      );

    } catch (error) {
      // 2. FALLBACK TO HARDCODED (BUT LONGER)
      setInterpretation(
        <div className="space-y-6">
          <div className="p-4 border-l-2 border-purple-500 bg-purple-500/10 rounded-r-xl">
            <p className="text-xl font-light italic text-purple-200">"The digital ether has aligned these symbols for you..."</p>
          </div>
          <p>Your past is mirrored by <strong>{selection[0]}</strong>, signifying {cardMeanings[selection[0]]} This energy represents the foundation upon which your current situation was built, echoing through your timeline.</p>
          <p>Your present challenge is <strong>{selection[1]}</strong>, reflecting {cardMeanings[selection[1]]} This is the core vibration you are currently navigating, demanding your full awareness and spiritual focus.</p>
          <p>Your future path leads to <strong>{selection[2]}</strong>, bringing focus to {cardMeanings[selection[2]]} As you move forward, keep this vision in your heart as a guiding light through the unknown.</p>
          <div className="pt-4 flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-sm font-['Poppins']">
            <Sparkles size={16} /> For entertainment purposes only
          </div>
        </div>
      );
    } finally {
      setIsGenerating(false);
      setShowInterpretation(true);
      setTimeout(() => {
        interpretationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-purple-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center pt-40 pb-32 px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-linear-to-b from-white via-white to-purple-500 bg-clip-text text-transparent tracking-tighter uppercase">
            Tarot AI
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-400 font-light leading-relaxed">
            Quiet your mind. Focus on your journey. Let the algorithm bridge the gap between the stars and your soul.
          </p>
        </div>

        <button 
          onClick={drawCards}
          disabled={isGenerating}
          className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center gap-3 font-black">
            {isGenerating ? (
              <> <LucideRotateCcw className="animate-spin" /> Shuffling Fate... </>
            ) : (
              <> <Eye size={20} /> Draw Your Cards </>
            )}
          </span>
          <div className="absolute inset-0 bg-purple-400 translate-y-full group-hover:translate-y-[0%] transition-transform duration-300" />
        </button>

        {/* Card Spread Grid - Original Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 max-w-6xl w-full">
          {(drawnCards.length > 0 ? drawnCards : ["", "", ""]).map((card, i) => (
            <div key={i} className="group flex flex-col items-center">
              <div 
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative w-full aspect-[2/3.3] max-w-75 rounded-[30px] transition-all duration-1000 shadow-2xl ${drawnCards.length > 0 ? 'transform-[rotateY(180deg)]' : ''}`}
              >
                {/* CARD BACK */}
                <div 
                   style={{ backfaceVisibility: 'hidden' }}
                   className="absolute inset-0 rounded-[28px] bg-[#0a0a0a] p-4 flex flex-col items-center justify-center border border-white/10 overflow-hidden"
                >
                   <div className="w-full h-full border border-purple-500/20 rounded-2xl flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-500/10 to-transparent" />
                      <Sparkles className="text-purple-500/30" size={64} />
                   </div>
                </div>

                {/* CARD FRONT - Original Styling */}
                <div 
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-[28px] bg-slate-900 overflow-hidden flex flex-col transform-[rotateY(180deg)] border border-purple-500/40 shadow-inner"
                >
                  {card && (
                    <>
                      <img 
                        src={cardImages[card]} 
                        alt={card} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/95 to-transparent pt-20 pb-8 px-6 text-center">
                        <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-2 opacity-80">
                          ARCANA
                        </span>
                        <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-none drop-shadow-xl">
                          {card}
                        </h4>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Position Labels */}
              <div className="mt-8 h-6">
                {drawnCards.length > 0 && (
                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-purple-400/80 animate-pulse">
                        {i === 0 ? "Past" : i === 1 ? "Present" : "Future"}
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Interpretation Box - Enhanced for longer text */}
        {showInterpretation && (
          <div ref={interpretationRef} className="mt-24 max-w-4xl w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="relative p-px bg-linear-to-b from-purple-500/40 to-transparent rounded-[40px]">
                <div className="bg-[#080808]/90 backdrop-blur-3xl rounded-[39px] p-10 md:p-16 border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-white">The Oracle's Vision</h3>
                    </div>
                    <div className="text-slate-300 text-lg md:text-xl font-light leading-relaxed font-['Poppins']">
                        {interpretation}
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tarot;