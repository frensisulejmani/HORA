import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Horoscope = () => {
  const [selectedSign, setSelectedSign] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [reading, setReading] = useState(null);
  const canvasRef = useRef(null);
  const readingRef = useRef(null);

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const horoscopeData = {
    aries: {
      symbol: "♈",
      element: "Fire",
      ruling: "Mars",
      Daily: {
        overall: "Your ruling planet Mars energizes your ventures today. Bold action meets cosmic favor.",
        love: "Passion runs high. A flirty encounter could spark something meaningful.",
        career: "Take charge of that project you've been hesitant about. Your confidence is your superpower.",
        health: "High energy drives you forward, but pace yourself.",
        finance: "An unexpected opportunity could boost your earnings.",
        luckyNumber: 9,
        luckyColor: "Red"
      },
      Monthly: {
        overall: "January brings transformation and new beginnings. You're in the spotlight.",
        love: "Romance deepens through genuine conversations. Single? Someone intriguing enters your orbit.",
        career: "This is your month to lead. Promotions and recognition are possible.",
        health: "Channel your boundless energy into fitness routines you'll love.",
        finance: "Investments show promise. Play smart but don't take unnecessary risks.",
        luckyNumber: 1,
        luckyColor: "Gold"
      },
      Yearly: {
        overall: "2026 is YOUR year, Aries. With Mars energized, expect major breakthroughs and personal power.",
        love: "If single, you'll attract admirers. Coupled? Relationships deepen into new territories.",
        career: "Career advancement is written in the stars. New opportunities align with your ambitions.",
        health: "Your vitality peaks. This is the year to start that fitness goal.",
        finance: "Financial growth through bold moves and strategic planning.",
        luckyNumber: 1,
        luckyColor: "Crimson"
      }
    },
    taurus: {
      symbol: "♉",
      element: "Earth",
      ruling: "Venus",
      Daily: {
        overall: "Stability and comfort take center stage. A good day for grounding yourself.",
        love: "Sensual pleasures call. Enjoy time with loved ones in cozy settings.",
        career: "Steady progress beats rushing. Finish what you start today.",
        health: "Nurture yourself with comfort foods and relaxation.",
        finance: "A solid day for financial planning. Review budgets.",
        luckyNumber: 6,
        luckyColor: "Emerald"
      },
      Monthly: {
        overall: "This month invites you to create and build. Your resources expand.",
        love: "Relationships stabilize and deepen. Quality time strengthens bonds.",
        career: "Long-term projects show progress. Your patience pays dividends.",
        health: "Focus on routines that ground you. Yoga or meditation suit you.",
        finance: "Income remains steady. A good month to save for future goals.",
        luckyNumber: 2,
        luckyColor: "Green"
      },
      Yearly: {
        overall: "2026 offers stability and sensual pleasures. You'll create lasting beauty in your life.",
        love: "Partnerships flourish. Single Tauruses attract stable, grounded partners.",
        career: "Building something meaningful that lasts is your focus.",
        health: "Prioritize rest and recovery. Your body needs consistency.",
        finance: "Steady financial growth through patience and wise choices.",
        luckyNumber: 6,
        luckyColor: "Rose Gold"
      }
    },
    gemini: {
      symbol: "♊",
      element: "Air",
      ruling: "Mercury",
      Daily: {
        overall: "Mercury energizes your mind. Communication flows beautifully today.",
        love: "Witty banter sparks connections. Share your authentic thoughts.",
        career: "Meetings and collaborations shine. Your ideas are gold.",
        health: "Mental clarity peaks. A good day for learning something new.",
        finance: "Short trips or sales opportunities bring gains.",
        luckyNumber: 5,
        luckyColor: "Yellow"
      },
      Monthly: {
        overall: "Communication breakthroughs lead the way. Express yourself boldly.",
        love: "Singles meet intriguing minds. Couples explore deeper conversations.",
        career: "Networking opens doors. Your adaptability is an asset.",
        health: "Mental stimulation matters most. Stay curious and active.",
        finance: "Multiple income streams possible. Diversify wisely.",
        luckyNumber: 3,
        luckyColor: "Bright Blue"
      },
      Yearly: {
        overall: "2026 is your year of connection and communication mastery.",
        love: "Love finds you through shared interests and meaningful dialogue.",
        career: "Collaborations and partnerships accelerate your success.",
        health: "Mental wellness is key. Meditation and journaling help.",
        finance: "Communication skills lead to financial gains through writing or speaking.",
        luckyNumber: 5,
        luckyColor: "Silver"
      }
    },
    cancer: {
      symbol: "♋",
      element: "Water",
      ruling: "Moon",
      Daily: {
        overall: "Emotional intuition guides you. Trust your gut feelings today.",
        love: "Deep emotional connections draw near. Vulnerability strengthens bonds.",
        career: "Nurturing others at work builds loyalty and respect.",
        health: "Honor your emotional needs. Self-care is productive.",
        finance: "Trust your instincts about money matters.",
        luckyNumber: 2,
        luckyColor: "Silver"
      },
      Monthly: {
        overall: "Family and home take precedence. Create your sacred sanctuary.",
        love: "Relationships deepen through emotional honesty. Home matters.",
        career: "Building a career foundation that feels secure.",
        health: "Prioritize rest and emotional processing.",
        finance: "Real estate or home investments show promise.",
        luckyNumber: 7,
        luckyColor: "White"
      },
      Yearly: {
        overall: "2026 brings emotional growth and deeper connections to what matters.",
        love: "True intimacy flourishes. Home and partnership merge beautifully.",
        career: "Building legacy work that serves others emotionally.",
        health: "Emotional wellness directly impacts physical health.",
        finance: "Protecting and growing assets for your family's future.",
        luckyNumber: 2,
        luckyColor: "Pearl"
      }
    },
    leo: {
      symbol: "♌",
      element: "Fire",
      ruling: "Sun",
      Daily: {
        overall: "The Sun fuels your creativity and confidence. Shine brightly.",
        love: "Romantic gestures work wonders. Express your love boldly.",
        career: "Leadership opportunities emerge. Step into your power.",
        health: "Your vitality is magnetic. Use it positively.",
        finance: "Risk-taking ventures show potential. Go for it.",
        luckyNumber: 1,
        luckyColor: "Gold"
      },
      Monthly: {
        overall: "January celebrates your creative spirit. Time to pursue your passion projects.",
        love: "Romance is your stage. Date nights sparkle with magic.",
        career: "Recognition comes to those who stand out. Be yourself.",
        health: "Channel your confidence into wellness goals.",
        finance: "Creative pursuits could generate income.",
        luckyNumber: 5,
        luckyColor: "Orange"
      },
      Yearly: {
        overall: "2026 is your personal renaissance. Creative expression takes center stage.",
        love: "Love finds the confident, authentic version of you.",
        career: "Career advancement through visibility and bold moves.",
        health: "Confidence transforms your health journey.",
        finance: "Personal projects and ventures flourish.",
        luckyNumber: 1,
        luckyColor: "Bronze"
      }
    },
    virgo: {
      symbol: "♍",
      element: "Earth",
      ruling: "Mercury",
      Daily: {
        overall: "Attention to detail serves you well. Organize and refine.",
        love: "Show love through thoughtful gestures and practical care.",
        career: "Perfect execution brings recognition today.",
        health: "Focus on nutrition and wellness routines.",
        finance: "Review your financial details. Improvements are clear.",
        luckyNumber: 3,
        luckyColor: "Green"
      },
      Monthly: {
        overall: "This month rewards your meticulous planning and service.",
        love: "Deep bonds form through acts of kindness and reliability.",
        career: "Your analytical skills solve important problems.",
        health: "Health optimization through proven methods.",
        finance: "Budgeting and savings strategies pay off.",
        luckyNumber: 6,
        luckyColor: "Mint"
      },
      Yearly: {
        overall: "2026 invites mastery and refinement in all areas of life.",
        love: "Deep, stable love builds on trust and consistency.",
        career: "Excellence in your field brings rewards.",
        health: "Healing through wellness practices and mindfulness.",
        finance: "Financial security through smart planning.",
        luckyNumber: 3,
        luckyColor: "Sage"
      }
    },
    libra: {
      symbol: "♎",
      element: "Air",
      ruling: "Venus",
      Daily: {
        overall: "Balance and beauty guide your day. Seek harmony.",
        love: "Charm flows naturally. Connections deepen beautifully.",
        career: "Diplomacy and aesthetics serve you well in negotiations.",
        health: "Beauty and balance in your wellness routine matter.",
        finance: "Fair dealings bring good karma and gain.",
        luckyNumber: 6,
        luckyColor: "Pink"
      },
      Monthly: {
        overall: "Relationships and partnerships flourish this month.",
        love: "Romance blooms. Couples reconnect; singles attract.",
        career: "Teamwork and collaborations advance your goals.",
        health: "Social wellness and connection support health.",
        finance: "Shared ventures and partnerships show promise.",
        luckyNumber: 7,
        luckyColor: "Lavender"
      },
      Yearly: {
        overall: "2026 emphasizes harmony, partnerships, and artistic expression.",
        love: "True partnership forms with someone who complements you.",
        career: "Collaborations and creative partnerships accelerate success.",
        health: "Balance in all things supports well-being.",
        finance: "Shared investments and business partnerships thrive.",
        luckyNumber: 6,
        luckyColor: "Copper"
      }
    },
    scorpio: {
      symbol: "♏",
      element: "Water",
      ruling: "Pluto",
      Daily: {
        overall: "Intensity and intuition are your superpowers today.",
        love: "Deep, transformative emotions surface. Embrace them.",
        career: "Probe beneath surface issues. Find hidden solutions.",
        health: "Healing happens through emotional release.",
        finance: "Strategic financial moves work in your favor.",
        luckyNumber: 8,
        luckyColor: "Burgundy"
      },
      Monthly: {
        overall: "Transformation and renewal mark this month.",
        love: "Relationships transform into deeper commitment.",
        career: "Hidden talents emerge. Use your power wisely.",
        health: "Detox and renewal rituals serve you.",
        finance: "Other people's resources or inheritance luck.",
        luckyNumber: 4,
        luckyColor: "Black"
      },
      Yearly: {
        overall: "2026 brings profound transformation and rebirth.",
        love: "Soulmate connections form through authenticity.",
        career: "Rise into your true power and authority.",
        health: "Deep healing becomes possible.",
        finance: "Shared resources and strategic moves build wealth.",
        luckyNumber: 8,
        luckyColor: "Deep Red"
      }
    },
    sagittarius: {
      symbol: "♐",
      element: "Fire",
      ruling: "Jupiter",
      Daily: {
        overall: "Adventure and expansion call. Take the leap today.",
        love: "Optimism attracts love. Share your enthusiasm.",
        career: "Big-picture thinking brings opportunities.",
        health: "Movement and exploration fuel your wellness.",
        finance: "Luck smiles on bold ventures.",
        luckyNumber: 3,
        luckyColor: "Purple"
      },
      Monthly: {
        overall: "This month is about growth, travel, and new horizons.",
        love: "Romance arrives through adventure and spontaneity.",
        career: "Expansion and new opportunities emerge.",
        health: "Physical activity and outdoor time call.",
        finance: "Investment in education or travel pays off.",
        luckyNumber: 9,
        luckyColor: "Turquoise"
      },
      Yearly: {
        overall: "2026 is your year of expansion, travel, and wisdom.",
        love: "Love finds you through shared adventures.",
        career: "International opportunities and rapid growth.",
        health: "Adventure as wellness—travel heals.",
        finance: "Luck and abundance flow from taking risks.",
        luckyNumber: 3,
        luckyColor: "Royal Blue"
      }
    },
    capricorn: {
      symbol: "♑",
      element: "Earth",
      ruling: "Saturn",
      Daily: {
        overall: "Discipline and ambition are your allies today.",
        love: "Show love through commitment and reliability.",
        career: "Hard work manifests visible results.",
        health: "Structure in routines supports wellness.",
        finance: "Strategic planning increases wealth.",
        luckyNumber: 8,
        luckyColor: "Charcoal"
      },
      Monthly: {
        overall: "Career and status take the spotlight.",
        love: "Stable, serious relationships develop.",
        career: "Recognition and promotion possibilities.",
        health: "Long-term health goals become clear.",
        finance: "Savings accumulate through discipline.",
        luckyNumber: 1,
        luckyColor: "Navy"
      },
      Yearly: {
        overall: "2026 is about climbing your mountain and reaching your peak.",
        love: "Mature, grounded love relationships form.",
        career: "Career pinnacle and authority achieved.",
        health: "Longevity through consistent wellness practices.",
        finance: "Building lasting wealth and legacy.",
        luckyNumber: 8,
        luckyColor: "Midnight Blue"
      }
    },
    aquarius: {
      symbol: "♒",
      element: "Air",
      ruling: "Uranus",
      Daily: {
        overall: "Innovation and individuality shine today.",
        love: "Connect on intellectual and unique levels.",
        career: "Unconventional ideas gain traction.",
        health: "Tech-based wellness or unique approaches appeal.",
        finance: "Group investments or tech ventures.",
        luckyNumber: 4,
        luckyColor: "Electric Blue"
      },
      Monthly: {
        overall: "Community and vision take center stage.",
        love: "Friendships deepen; romance sparks through connection.",
        career: "Teams and group projects advance rapidly.",
        health: "Community wellness activities support you.",
        finance: "Collective ventures and networking open doors.",
        luckyNumber: 11,
        luckyColor: "Cyan"
      },
      Yearly: {
        overall: "2026 is about revolution, innovation, and your true vision.",
        love: "Find love with someone who honors your uniqueness.",
        career: "Groundbreaking work brings recognition.",
        health: "Cutting-edge wellness methods suit you.",
        finance: "Tech investments and innovation ventures thrive.",
        luckyNumber: 4,
        luckyColor: "Silver"
      }
    },
    pisces: {
      symbol: "♓",
      element: "Water",
      ruling: "Neptune",
      Daily: {
        overall: "Intuition and creativity flow through you today.",
        love: "Romantic dreams become touchable reality.",
        career: "Creative or healing work brings fulfillment.",
        health: "Meditation and spiritual practices serve you.",
        finance: "Trust your instincts with money.",
        luckyNumber: 7,
        luckyColor: "Sea Green"
      },
      Monthly: {
        overall: "Creativity and spiritual awakening bloom.",
        love: "Soulmate connections form through empathy.",
        career: "Creative projects receive recognition.",
        health: "Holistic and spiritual healing.",
        finance: "Dreams turn to reality; follow intuition.",
        luckyNumber: 3,
        luckyColor: "Lilac"
      },
      Yearly: {
        overall: "2026 is your spiritual awakening and creative renaissance.",
        love: "Soulmate love finds the open-hearted.",
        career: "Creative or spiritual calling fulfills.",
        health: "Holistic healing and transformation.",
        finance: "Creative ventures and dreams manifest.",
        luckyNumber: 7,
        luckyColor: "Mauve"
      }
    }
  };

  // Star Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: (canvas.width * canvas.height) / 8000 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.01 + 0.002
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0.1) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
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

  // Update Reading logic
  useEffect(() => {
    if (selectedSign && selectedPeriod) {
      const signData = horoscopeData[selectedSign.toLowerCase()];
      if (signData) {
        setReading(signData[selectedPeriod]);
        // Scroll to reading after a tiny delay for render
        setTimeout(() => {
          readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSign, selectedPeriod]);

  const getLuckyColorCode = (colorName) => {
    const colorMap = {
      'Red': '#DC2626',
      'Gold': '#FCD34D',
      'Emerald': '#10B981',
      'Green': '#34D399',
      'Yellow': '#FBBF24',
      'Bright Blue': '#3B82F6',
      'Silver': '#D1D5DB',
      'White': '#FFFFFF',
      'Orange': '#FB923C',
      'Purple': '#A855F7',
      'Turquoise': '#14B8A6',
      'Charcoal': '#36454F',
      'Navy': '#000080',
      'Electric Blue': '#0080FF',
      'Cyan': '#00FFFF',
      'Sea Green': '#2E8B57',
      'Lilac': '#C8A2C8',
      'Mauve': '#E0B0FF',
      'Burgundy': '#800020',
      'Black': '#000000',
      'Deep Red': '#8B0000',
      'Rose Gold': '#B76E79',
      'Lavender': '#E6E6FA',
      'Copper': '#B87333',
      'Pink': '#FF69B4',
      'Mint': '#98FF98',
      'Sage': '#9DC183',
      'Midnight Blue': '#191970'
    };
    return colorMap[colorName] || '#9333EA';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none" />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[5%] -right-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-b from-white to-cosmic-primary bg-clip-text text-transparent mb-4">
          Horoscope
        </h1>
        <p className="text-white/60 max-w-2xl mb-12">
          Select your zodiac sign and choose a timeframe to reveal what the stars have aligned for you.
        </p>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-6xl mb-12">
          {signs.map((sign) => (
            <button
              key={sign}
              onClick={() => setSelectedSign(sign)}
              className={`flex flex-col items-center p-4 rounded-3xl border transition-all duration-300 ${
                selectedSign === sign 
                ? "bg-cosmic-primary/20 border-cosmic-primary scale-105 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-l font-medium">{sign}</span>
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["Daily", "Monthly", "Yearly"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-8 py-3 rounded-full font-semibold border transition-all duration-300 ${
                selectedPeriod === period
                ? "bg-cosmic-primary border-cosmic-primary shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "bg-transparent border-cosmic-primary hover:bg-cosmic-primary/10"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Results Box */}
        {reading && (
          <div 
            ref={readingRef}
            className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8 md:p-12 text-left animate-in fade-in slide-in-from-bottom-5 duration-500"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 text-cosmic-primary">
              <Sparkles className="animate-pulse" size={32} />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {selectedSign} {selectedPeriod} Horoscope
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  {horoscopeData[selectedSign.toLowerCase()].element} • Ruled by {horoscopeData[selectedSign.toLowerCase()].ruling}
                </p>
              </div>
            </div>

            {/* Overall */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h4 className="text-lg font-semibold text-pink-400 mb-3 flex items-center gap-2">
                <Sparkles size={20} />
                Overall
              </h4>
              <p className="text-lg leading-relaxed text-white/80">
                {reading.overall}
              </p>
            </div>

            {/* Grid Layout for Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Love */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20">
                <h4 className="text-lg font-semibold text-pink-400 mb-3 flex items-center gap-2">
                  <Heart size={20} />
                  Love & Relationships
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {reading.love}
                </p>
              </div>

              {/* Career */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Briefcase size={20} />
                  Career & Growth
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {reading.career}
                </p>
              </div>

              {/* Health */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Health & Wellness
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {reading.health}
                </p>
              </div>

              {/* Finance */}
              <div className="p-6 rounded-2xl bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Finances & Abundance
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {reading.finance}
                </p>
              </div>
            </div>

            {/* Lucky Numbers and Colors */}
            <div className="bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-wrap gap-8">
              <div>
                <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-2">Lucky Number</p>
                <p className="text-3xl font-bold text-pink-400">{reading.luckyNumber}</p>
              </div>
              <div>
                <p className="text-pink-300 text-sm font-semibold uppercase tracking-widest mb-2">Lucky Color</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-lg"
                    style={{ 
                      backgroundColor: getLuckyColorCode(reading.luckyColor)
                    }}
                  />
                  <span className="text-white/80 font-semibold">{reading.luckyColor}</span>
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

export default Horoscope;