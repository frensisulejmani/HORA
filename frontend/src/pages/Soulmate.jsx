import React, { useEffect, useRef, useState } from 'react';
import { Heart, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Soulmate = () => {
  const canvasRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compatibility, setCompatibility] = useState(null);
  const [person1, setPerson1] = useState({ name: '', birthday: '', sign: '' });
  const [person2, setPerson2] = useState({ name: '', birthday: '', sign: '' });
  const [compatibilityDetails, setCompatibilityDetails] = useState(null);

  // Zodiac compatibility matrix (0-100)
  const compatibilityMatrix = {
    aries: {
      aries: 75, taurus: 50, gemini: 85, cancer: 55, leo: 95, virgo: 45,
      libra: 75, scorpio: 60, sagittarius: 90, capricorn: 45, aquarius: 85, pisces: 40
    },
    taurus: {
      aries: 50, taurus: 85, gemini: 55, cancer: 90, leo: 50, virgo: 95,
      libra: 65, scorpio: 85, sagittarius: 45, capricorn: 90, aquarius: 55, pisces: 80
    },
    gemini: {
      aries: 85, taurus: 55, gemini: 80, cancer: 60, leo: 80, virgo: 85,
      libra: 95, scorpio: 55, sagittarius: 85, capricorn: 60, aquarius: 95, pisces: 65
    },
    cancer: {
      aries: 55, taurus: 90, gemini: 60, cancer: 85, leo: 60, virgo: 95,
      libra: 55, scorpio: 95, sagittarius: 50, capricorn: 80, aquarius: 50, pisces: 95
    },
    leo: {
      aries: 95, taurus: 50, gemini: 80, cancer: 60, leo: 85, virgo: 60,
      libra: 80, scorpio: 65, sagittarius: 95, capricorn: 50, aquarius: 75, pisces: 55
    },
    virgo: {
      aries: 45, taurus: 95, gemini: 85, cancer: 95, leo: 60, virgo: 80,
      libra: 65, scorpio: 75, sagittarius: 50, capricorn: 95, aquarius: 65, pisces: 85
    },
    libra: {
      aries: 75, taurus: 65, gemini: 95, cancer: 55, leo: 80, virgo: 65,
      libra: 80, scorpio: 65, sagittarius: 80, capricorn: 60, aquarius: 90, pisces: 70
    },
    scorpio: {
      aries: 60, taurus: 85, gemini: 55, cancer: 95, leo: 65, virgo: 75,
      libra: 65, scorpio: 85, sagittarius: 70, capricorn: 90, aquarius: 60, pisces: 95
    },
    sagittarius: {
      aries: 90, taurus: 45, gemini: 85, cancer: 50, leo: 95, virgo: 50,
      libra: 80, scorpio: 70, sagittarius: 85, capricorn: 55, aquarius: 95, pisces: 65
    },
    capricorn: {
      aries: 45, taurus: 90, gemini: 60, cancer: 80, leo: 50, virgo: 95,
      libra: 60, scorpio: 90, sagittarius: 55, capricorn: 85, aquarius: 70, pisces: 80
    },
    aquarius: {
      aries: 85, taurus: 55, gemini: 95, cancer: 50, leo: 75, virgo: 65,
      libra: 90, scorpio: 60, sagittarius: 95, capricorn: 70, aquarius: 85, pisces: 75
    },
    pisces: {
      aries: 40, taurus: 80, gemini: 65, cancer: 95, leo: 55, virgo: 85,
      libra: 70, scorpio: 95, sagittarius: 65, capricorn: 80, aquarius: 75, pisces: 90
    }
  };

  const signDetails = {
    aries: { element: 'Fire', quality: 'Cardinal', traits: ['Passionate', 'Bold', 'Courageous'] },
    taurus: { element: 'Earth', quality: 'Fixed', traits: ['Stable', 'Reliable', 'Practical'] },
    gemini: { element: 'Air', quality: 'Mutable', traits: ['Communicative', 'Curious', 'Adaptable'] },
    cancer: { element: 'Water', quality: 'Cardinal', traits: ['Emotional', 'Nurturing', 'Intuitive'] },
    leo: { element: 'Fire', quality: 'Fixed', traits: ['Charismatic', 'Creative', 'Confident'] },
    virgo: { element: 'Earth', quality: 'Mutable', traits: ['Analytical', 'Detail-oriented', 'Helpful'] },
    libra: { element: 'Air', quality: 'Cardinal', traits: ['Diplomatic', 'Balanced', 'Artistic'] },
    scorpio: { element: 'Water', quality: 'Fixed', traits: ['Intense', 'Passionate', 'Perceptive'] },
    sagittarius: { element: 'Fire', quality: 'Mutable', traits: ['Adventurous', 'Optimistic', 'Honest'] },
    capricorn: { element: 'Earth', quality: 'Cardinal', traits: ['Ambitious', 'Disciplined', 'Practical'] },
    aquarius: { element: 'Air', quality: 'Fixed', traits: ['Innovative', 'Independent', 'Intellectual'] },
    pisces: { element: 'Water', quality: 'Mutable', traits: ['Creative', 'Compassionate', 'Mystical'] }
  };

  const getZodiacSign = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const zodiacSigns = [
      { name: 'capricorn', start: [12, 22], end: [1, 19] },
      { name: 'aquarius', start: [1, 20], end: [2, 18] },
      { name: 'pisces', start: [2, 19], end: [3, 20] },
      { name: 'aries', start: [3, 21], end: [4, 19] },
      { name: 'taurus', start: [4, 20], end: [5, 20] },
      { name: 'gemini', start: [5, 21], end: [6, 20] },
      { name: 'cancer', start: [6, 21], end: [7, 22] },
      { name: 'leo', start: [7, 23], end: [8, 22] },
      { name: 'virgo', start: [8, 23], end: [9, 22] },
      { name: 'libra', start: [9, 23], end: [10, 22] },
      { name: 'scorpio', start: [10, 23], end: [11, 21] },
      { name: 'sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (let sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }
    return null;
  };

  const getCompatibilityDetails = (sign1, sign2, name1, name2) => {
    const score = compatibilityMatrix[sign1]?.[sign2] || 50;
    const details1 = signDetails[sign1];
    const details2 = signDetails[sign2];
    
    let strongPoints = [];
    let weakPoints = [];

    // Determine compatibility dynamics
    if (details1.element === details2.element) {
      strongPoints.push(`Shared ${details1.element} element creates natural understanding`);
    } else if (
      (details1.element === 'Fire' && details2.element === 'Air') ||
      (details1.element === 'Air' && details2.element === 'Fire') ||
      (details1.element === 'Earth' && details2.element === 'Water') ||
      (details1.element === 'Water' && details2.element === 'Earth')
    ) {
      strongPoints.push('Complementary elements enhance mutual support');
    } else {
      weakPoints.push('Different elements may require understanding and compromise');
    }

    if (details1.quality === details2.quality) {
      weakPoints.push(`Both ${details1.quality} quality signs can struggle with flexibility`);
    } else {
      strongPoints.push('Different qualities bring balance and variety');
    }

    // Add trait-based insights
    strongPoints.push(`${name1}'s ${details1.traits[0]} nature complements ${name2}'s ${details2.traits[0]} spirit`);
    
    if (score >= 80) {
      strongPoints.push('Exceptional romantic and emotional alignment');
      strongPoints.push('Great potential for deep commitment and growth together');
    } else if (score >= 60) {
      strongPoints.push('Solid foundation for a meaningful relationship');
      weakPoints.push('May need effort to overcome occasional misunderstandings');
    } else {
      weakPoints.push('Different approaches to love and life may create friction');
      weakPoints.push('Requires patience, communication, and genuine effort');
    }

    return {
      score,
      strongPoints,
      weakPoints,
      sign1Details: details1,
      sign2Details: details2
    };
  };

  const getCompatibilityDescription = (score) => {
    if (score >= 90) return "The stars align perfectly! This is a cosmic soulmate connection with exceptional harmony and understanding.";
    if (score >= 80) return "Excellent compatibility! You share deep cosmic resonance and natural harmony in your connection.";
    if (score >= 70) return "Strong connection! There's genuine compatibility and good potential for a meaningful relationship.";
    if (score >= 60) return "Decent compatibility. You have potential, though it may require effort and understanding to flourish.";
    if (score >= 50) return "Moderate compatibility. You can make it work with communication and mutual respect.";
    return "Challenging connection. The stars suggest you may face obstacles, but love can transcend any chart!";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    class Star {
      constructor() {
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

    const initStars = () => {
      stars = [];
      const count = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < count; i++) stars.push(new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCalculate = () => {
    // Get input values
    const nameInput1 = document.getElementById('name1');
    const dateInput1 = document.getElementById('date1');
    const nameInput2 = document.getElementById('name2');
    const dateInput2 = document.getElementById('date2');

    if (!nameInput1?.value || !dateInput1?.value || !nameInput2?.value || !dateInput2?.value) {
      alert('Please fill in all fields (names and birthdays)');
      return;
    }

    const name1 = nameInput1.value;
    const name2 = nameInput2.value;
    const sign1 = getZodiacSign(dateInput1.value);
    const sign2 = getZodiacSign(dateInput2.value);

    if (!sign1 || !sign2) {
      alert('Invalid birthdate format');
      return;
    }

    setPerson1({ name: name1, birthday: dateInput1.value, sign: sign1 });
    setPerson2({ name: name2, birthday: dateInput2.value, sign: sign2 });

    setLoading(true);
    
    // Simulate a cosmic calculation
    setTimeout(() => {
      const details = getCompatibilityDetails(sign1, sign2, name1, name2);
      
      setCompatibility(details.score);
      setCompatibilityDetails(details);
      setLoading(false);
      setShowResult(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-pink-500/30">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white via-pink-400 to-purple-500 bg-clip-text text-transparent">
          Soulmate Compatibility
        </h1>
        <p className="text-white/60 mb-12 max-w-2xl mx-auto">
          Compare your cosmic vibrations to discover the depth of your connection.
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          {/* Person 1: You */}
          <CompatibilityCard label="Person 1" color="border-purple-500/30" personId="1" />

          {/* Animated Heart Center */}
          <div className="flex flex-col items-center justify-center w-32 shrink-0 lg:rotate-0 rotate-90 my-8 lg:my-0">
            <div className="relative">
              <Heart 
                size={64} 
                className="text-pink-500 animate-[heartBeat_1.5s_infinite] drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]" 
                fill="currentColor" 
              />
            </div>
            <span className="text-[10px] tracking-[0.2em] text-white/40 mt-4 uppercase font-semibold">
              Synastry
            </span>
          </div>

          {/* Person 2: Partner */}
          <CompatibilityCard label="Person 2" color="border-pink-500/30" personId="2" />
        </div>

        <button 
          onClick={handleCalculate}
          disabled={loading}
          className="mt-16 bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(244,114,182,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Aligning Stars..." : "Check Cosmic Bond"}
        </button>

        {/* Result Area */}
        {showResult && compatibilityDetails && (
          <div className="mt-20 space-y-8">
            {/* Main Score */}
            <div className="p-8 rounded-3xl bg-white/5 border border-pink-500/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <h2 className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">{compatibility}% Match</h2>
              <p className="text-lg text-purple-400 mb-4">
                {person1.name} ({person1.sign.charAt(0).toUpperCase() + person1.sign.slice(1)}) & {person2.name} ({person2.sign.charAt(0).toUpperCase() + person2.sign.slice(1)})
              </p>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                {getCompatibilityDescription(compatibility)}
              </p>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strong Points */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-green-400 mb-4">💚 Strong Points</h3>
                <ul className="space-y-3">
                  {compatibilityDetails.strongPoints.map((point, idx) => (
                    <li key={idx} className="text-white/80 flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weak Points */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">⚠️ Areas to Work On</h3>
                <ul className="space-y-3">
                  {compatibilityDetails.weakPoints.map((point, idx) => (
                    <li key={idx} className="text-white/80 flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sign Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20 backdrop-blur-md">
                <h3 className="text-xl font-bold text-purple-400 mb-4">{person1.name}'s Sign: {person1.sign.charAt(0).toUpperCase() + person1.sign.slice(1)}</h3>
                <div className="space-y-2 text-white/80">
                  <p><span className="text-purple-300 font-semibold">Element:</span> {compatibilityDetails.sign1Details.element}</p>
                  <p><span className="text-purple-300 font-semibold">Quality:</span> {compatibilityDetails.sign1Details.quality}</p>
                  <p><span className="text-purple-300 font-semibold">Traits:</span> {compatibilityDetails.sign1Details.traits.join(', ')}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-pink-500/20 backdrop-blur-md">
                <h3 className="text-xl font-bold text-pink-400 mb-4">{person2.name}'s Sign: {person2.sign.charAt(0).toUpperCase() + person2.sign.slice(1)}</h3>
                <div className="space-y-2 text-white/80">
                  <p><span className="text-pink-300 font-semibold">Element:</span> {compatibilityDetails.sign2Details.element}</p>
                  <p><span className="text-pink-300 font-semibold">Quality:</span> {compatibilityDetails.sign2Details.quality}</p>
                  <p><span className="text-pink-300 font-semibold">Traits:</span> {compatibilityDetails.sign2Details.traits.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes heartBeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.2); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Sub-component for the Input Boxes
const CompatibilityCard = ({ label, color, personId }) => (
  <div className={`flex-1 w-full min-w-75 bg-white/5 backdrop-blur-md border ${color} rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:bg-white/10`}>
    <h3 className="text-2xl font-semibold mb-8">{label}</h3>
    
    <div className="space-y-6 text-left">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Full Name</label>
        <input 
          id={`name${personId}`}
          type="text" 
          placeholder="Enter your name"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors text-white placeholder:text-white/30"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Birth Date</label>
        <input 
          id={`date${personId}`}
          type="date" 
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 invert-[0.8] brightness-200"
        />
      </div>
    </div>
  </div>
);

export default Soulmate;