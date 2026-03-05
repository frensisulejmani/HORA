import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Flower2, Coins, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Venus = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();
  
  // Normalize signName: "gemini" -> "Gemini"
  const formatSign = (name) => {
    if (!name) return 'Libra';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [venusSign, setVenusSign] = useState(formatSign(signName));
  const [loading, setLoading] = useState(true);

  const getSymbol = (sign) => {
    const symbols = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
      Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
      Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return symbols[sign] || '✨';
  };

  useEffect(() => {
    const fetchVenusSign = async () => {
      // If URL has a sign, prioritize it and normalize it
      if (signName) {
        setVenusSign(formatSign(signName));
        setLoading(false);
        return;
      }

      // Fallback to User Data if no URL param
      if (!user?.birth?.date) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await astroAPI.getNatal({
          date: user.birth.date,
          month: user.birth.month,
          year: user.birth.year,
          hour: user.birth.hour || 0,
          minute: user.birth.minute || 0,
          latitude: user.birth.latitude || 0,
          longitude: user.birth.longitude || 0,
          timezone: user.birth.timezone || 0
        });

        const planetaryData = response.data?.data?.planets;
        const venusInfo = planetaryData?.find(p => p.name === 'Venus');
        
        if (venusInfo?.sign) {
          setVenusSign(formatSign(venusInfo.sign));
        }
      } catch (err) {
        console.error('Failed to fetch Venus sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenusSign();
  }, [user, signName]); // Re-run when the URL signName changes

  // Canvas Star Background Effect
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

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-500/30">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        
        <Link to="/natal" className="inline-flex items-center gap-2 text-white/40 hover:text-orange-400 transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-[#ffd8a8] via-[#ffa94d] to-[#d9480f] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(253,126,20,0.4)]">
            ♀
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
              {loading ? 'Loading...' : `Venus in ${venusSign}`}
            </h1>
            <p className="text-orange-400/60 italic text-lg mb-6">
              {loading ? 'Calculating...' : `The Muse: ${getVenusDescription(venusSign)}`}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Affection" value={getVenusAffection(venusSign)} />
              <MetaItem label="Values" value={getVenusValues(venusSign)} />
              <MetaItem label="Magnetism" value={getVenusMagnetism(venusSign)} />
            </div>
          </div>
        </section>

        {!loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-orange-500/30 rounded-[30px] p-8 md:p-12 mb-8 hover:border-orange-500/50 transition-colors shadow-2xl">
            <h2 className="text-3xl font-semibold text-orange-200 mb-4">The Language of Desire</h2>
            <p className="text-lg leading-relaxed text-white/80 font-light">
              {getVenusEssence(venusSign)}
            </p>
          </div>
        )}

        {!loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
            <ContentSection 
              Icon={Heart} 
              title="Romance & Connection" 
              text={getVenusLove(venusSign)} 
            />
            <ContentSection 
              Icon={Flower2} 
              title="Aesthetic & Style" 
              text={getVenusAesthetic(venusSign)} 
            />
            <ContentSection 
              Icon={Coins} 
              title="Wealth & Worth" 
              text={getVenusWealth(venusSign)} 
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// --- Helper Components ---
const MetaItem = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center transition-colors hover:bg-white/10">
    <span className="block text-[10px] uppercase tracking-widest text-orange-400 font-bold mb-1">{label}</span>
    <span className="text-base font-semibold">{value}</span>
  </div>
);

const ContentSection = ({ Icon, title, text }) => (
  <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-8 group">
    <div className="mx-auto md:mx-0 w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(251,146,60,0.2)]">
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

// --- Venus Sign Data ---
const venusSignData = {
  Aries: {
    description: "The Impulsive Lover", affection: "Direct", values: "Novelty", magnetism: "Fiery",
    essence: "Venus in Aries loves with a fierce, independent spark. You are the hunter of affection, preferring the thrill of the chase and honest, high-energy connections. You don't just 'fall' in love; you pursue it with the heat of a cosmic ignition, seeking a partner who is both a companion and a worthy competitor.",
    love: "In partnership, you lean into radical directness. You have no patience for mind games or subtle hints; for you, love is a battlefield of passion and absolute transparency. You need a partner who possesses their own gravity—someone who can stand firm against the gale-force winds of your affection without losing their own identity.",
    aesthetic: "Your style is bold, athletic, and often pioneering. You gravitate toward clean lines, striking silhouettes, and colors that signal your readiness for action. You prefer an 'armor' of fashion—pieces that are functional yet undeniably powerful, reflecting your identity as the zodiac’s trailblazer.",
    wealth: "You find value in courage and the 'first strike.' Prosperity comes to you when you take decisive initiative and bet on your own instincts. You view money as a fuel for adventure rather than a static hoard, often finding success in high-stakes environments where speed and bravery are rewarded."
  },
  Taurus: {
    description: "The Sensualist", affection: "Physical", values: "Quality", magnetism: "Steadfast",
    essence: "Venus is home in Taurus, its most grounded domicile. You seek sensory delight, physical touch, and a love that feels like a solid foundation. You perceive beauty through the five senses—the scent of a garden, the texture of silk, the weight of fine jewelry—and you seek a love that is as enduring as the earth itself.",
    love: "You value loyalty above all else. Your relational style is slow, steady, and deeply rooted in the physical realm. You show love through consistent presence, gourmet meals, and the creation of a shared sanctuary. For you, intimacy is built brick-by-brick through years of unwavering devotion and sensory pleasure.",
    aesthetic: "You have a refined, tactile taste for luxury. You prefer organic materials, high-quality fabrics like cashmere and linen, and deep earth tones. Your environment is a curated masterpiece of comfort, where every object is chosen for its longevity and its ability to soothe the spirit.",
    wealth: "You attract abundance by cultivating quality. You are the master of the long game, valuing assets that stand the test of time. Wealth flows to you through patience and the appreciation of tangible value, making you an expert at turning resources into a legacy of lasting security."
  },
  Gemini: {
    description: "The Sapio-Romantic", affection: "Mental", values: "Variety", magnetism: "Playful",
    essence: "Venus in Gemini finds beauty in the architecture of the mind. Love is a conversation, a game of wit, and a constant exchange of kaleidoscopic ideas. You are attracted to the brilliance of a quick tongue and a curious spirit, viewing romance as an intellectual adventure that must never become stagnant.",
    love: "You need constant mental stimulation to stay engaged. You value a partner who is your best friend, your debate rival, and your local explorer all in one. Love is found in the 'in-between' spaces—the late-night texts, the shared jokes, and the ability to talk about everything from quantum physics to pop culture.",
    aesthetic: "Your style is eclectic, light, and ever-shifting. You love accessories that tell a story and pieces that allow you to shift your persona on a whim. Your wardrobe is as versatile as your personality, often featuring patterns, prints, and layers that reflect your multifaceted nature.",
    wealth: "Your wealth lies in information and social networking. You attract prosperity through your ability to communicate and bridge gaps between people. You are a 'multi-hyphenate' by nature, often finding that your most significant financial gains come from your social intelligence and your talent for juggling diverse interests."
  },
  Cancer: {
    description: "The Nurturing Heart", affection: "Soulful", values: "Safety", magnetism: "Gentle",
    essence: "Venus in Cancer seeks emotional depth and a sense of 'home' within the hearts of others. You love with a protective, moon-led sensitivity that creates a profound safety net. You are the emotional alchemist of the zodiac, capable of turning a cold house into a warm sanctuary through the sheer power of your care.",
    love: "You are deeply intuitive in love, often knowing what your partner needs before they do. You value emotional security and create a sacred container for those you hold dear. You show love through care-taking, emotional loyalty, and the preservation of shared memories that form the heritage of your relationship.",
    aesthetic: "You prefer a cozy, nostalgic, and romantic style. Soft fabrics, vintage heirlooms, and environments that feel like a warm embrace are where you feel most beautiful. You are drawn to silver, pearlescent tones, and decor that holds deep sentimental value.",
    wealth: "You value family, history, and the security of the domestic sphere. Abundance flows to you when you listen to your gut instincts and protect your inner peace. You treat your finances with a protective instinct, ensuring that your 'nest egg' is always secure enough to provide for your loved ones."
  },
  Leo: {
    description: "The Radiant Muse", affection: "Grand", values: "Honor", magnetism: "Golden",
    essence: "Venus in Leo loves out loud. You seek a grand, cinematic romance and find beauty in self-expression, creative fire, and the warmth of the spotlight. You do not just love; you adore, viewing your partner as a fellow royal in a life that is meant to be a masterpiece.",
    love: "You are generous, fiercely loyal, and protective. You value a partner who celebrates your light and joins you in life's grandest celebrations. You express love through theatrical gestures, golden-hearted devotion, and a requirement that respect and admiration be the foundation of any union.",
    aesthetic: "Your style is dramatic, regal, and unapologetically bold. You love gold, vibrant patterns, and anything that allows your natural charisma to take center stage. You dress to be seen, viewing fashion as a form of performance art that announces your presence to the world.",
    wealth: "You value luxury and the fruits of your creative labor. Prosperity comes to you when you lead with your heart and own your star power. You are not afraid to spend on high-profile experiences, understanding that a life well-lived is its own form of currency."
  },
  Virgo: {
    description: "The Devoted Refiner", affection: "Practical", values: "Purity", magnetism: "Understated",
    essence: "Venus in Virgo finds beauty in the divinity of the details. To you, love is a verb—it is shown through acts of quiet service, the refinement of the self, and the humble desire to help a partner grow. You seek a love that is pure, functional, and grounded in the reality of daily life.",
    love: "You seek a love that is an oasis of order in a chaotic world. You value a partner who appreciates the small gestures—the made coffee, the organized desk, the thoughtful advice. You show love by making your partner's life run more smoothly, believing that true devotion is found in the small, consistent acts of care.",
    aesthetic: "Your style is clean, organized, and perfectly tailored. You prefer a 'less is more' approach, investing in high-quality basics and timeless pieces that signal intelligence and hygiene. Your environment is a reflection of your mind: minimalist, functional, and impeccably curated.",
    wealth: "You value health, efficiency, and the mastery of your craft. You attract abundance through your attention to detail and your ability to be of service. You are the ultimate strategist with your resources, finding wealth in the optimization of every dollar and every hour.",
  },
  Libra: {
    description: "The Harmonizer", affection: "Graceful", values: "Justice", magnetism: "Elegant",
    essence: "Venus is the ruler of Libra, and here it seeks the architecture of peace. You are the diplomat of the zodiac, seeking aesthetic perfection and an equal partnership that feels like a true mirror. You find beauty in symmetry, fairness, and the sophisticated dance of social grace.",
    love: "You are the ultimate romantic strategist. You value grace, fairness, and a shared vision of a balanced life. You show love through compromise, active listening, and the constant effort to keep the 'scales' of your relationship in perfect equilibrium. To you, a relationship is a work of art that requires two equal artists.",
    aesthetic: "You have an innate, impeccable sense of balance. Your look is always harmonious, favoring soft palettes, symmetrical designs, and a look that is polished yet effortless. Your home is a gallery of light and flow, where every guest feels instantly at ease.",
    wealth: "You value art, social justice, and the power of connection. Abundance is found through partnerships and the creation of beautiful, high-vibe environments. You attract wealth by being a mediator and an influencer, understanding that social capital is often as valuable as liquid gold."
  },
  Scorpio: {
    description: "The Alchemist", affection: "Intense", values: "Truth", magnetism: "Dark",
    essence: "Venus in Scorpio seeks a love that transforms the soul. You are not interested in the surface or the superficial; you crave soul-merging intensity and absolute psychological honesty. You find beauty in the shadows, the secrets, and the profound power of total vulnerability.",
    love: "Your love is all-or-nothing, a 'til death' level of commitment. You value loyalty, privacy, and an intimacy that touches the deepest parts of the psyche. You show love through unwavering protection and the courage to walk with your partner through their darkest nights, seeking a bond that is truly unbreakable.",
    aesthetic: "Your style is mysterious, powerful, and magnetic. You favor deep reds, blacks, and leather—pieces that feel like psychological armor. Your presence is often felt before it is seen, and your aesthetic reflects a soul that is unafraid of its own power and depth.",
    wealth: "You value power, control, and the uncovering of hidden truths. Abundance comes to you through investigative work, strategic investments, and understanding the 'shadow side' of the market. You are the master of transformation, able to turn lead into gold through sheer force of will."
  },
  Sagittarius: {
    description: "The Adventurer", affection: "Expansive", values: "Truth", magnetism: "Free",
    essence: "Venus in Sagittarius finds beauty in the widening of the horizon. Love is a grand adventure, a quest for higher truth, and a way to expand your understanding of the universe. You are attracted to the exotic, the philosophical, and the partner who can be both your lover and your fellow wanderer.",
    love: "You need space to breathe, grow, and explore. You value a partner who is a fellow traveler—someone who won't try to cage your spirit but will instead run alongside you toward the next frontier. Love, for you, is a shared journey of discovery that must always remain optimistic and free.",
    aesthetic: "Your style is global, comfortable, and nomadic. You love patterns from other cultures, functional pieces that allow for movement, and a look that says you are ready to hop on a plane at a moment's notice. You find beauty in the authentic and the unpolished.",
    wealth: "You value experience over possessions. Prosperity flows to you through teaching, travel, and taking big, visionary risks. You have a 'Jupiter-led' faith that the universe will always provide, and this optimism often attracts the very abundance you need to keep exploring."
  },
  Capricorn: {
    description: "The Architect", affection: "Serious", values: "Legacy", magnetism: "Authoritative",
    essence: "Venus in Capricorn takes love seriously, viewing it as a sacred structure to be built over time. You seek a partner with ambition and value the beauty of a legacy forged through effort, integrity, and discipline. You find beauty in the mountain peak—the result of years of steady climbing.",
    love: "You are reserved, but your commitment is absolute. You value a relationship that acts as a 'power-couple' dynamic, built on mutual respect and long-term strategic goals. You show love through material security, reliable support, and the patient building of a life that commands respect from the world.",
    aesthetic: "Your style is professional, classic, and timelessly elegant. You prefer investment pieces—tailored blazers, structured bags, and heritage brands—that signal status and reliability. Your environment is a reflection of your achievement: understated, high-end, and perfectly composed.",
    wealth: "You value integrity and long-term results. Abundance is built through iron-clad discipline and strategic planning. You view wealth as a tool for security and authority, and you have the patience to build a fortune that will last for generations."
  },
  Aquarius: {
    description: "The Visionary", affection: "Unique", values: "Freedom", magnetism: "Electric",
    essence: "Venus in Aquarius loves in a way that is brilliantly unique and intellectually detached. You find beauty in the unconventional, the avant-garde, and the collective good. You seek a 'meeting of the minds' first, valuing a love that feels like a radical friendship and a shared vision for the future.",
    love: "You value freedom and individuality above all. You need a partner who respects your quirks and won't try to force you into a traditional mold. Love is a partnership of two independent souls working together to innovate and improve the world around them.",
    aesthetic: "Your style is avant-garde, experimental, and often futuristic. You love being the first to wear something unconventional, often mixing high-fashion with tech-wear or vintage finds. You dress to express your rebellion against the status quo.",
    wealth: "You value progress, technology, and humanitarian goals. You attract abundance by being ahead of the curve and helping the community. You find value in the 'new economy' and are often the first to identify the worth of a radical, world-changing idea."
  },
  Pisces: {
    description: "The Dreamer", affection: "Infinite", values: "Spirit", magnetism: "Ethereal",
    essence: "Venus is exalted in Pisces, reaching its highest spiritual expression. Your love is unconditional, poetic, and transcendental. You see the divine beauty in everyone and everything, seeking a soul-connection that goes far beyond the physical boundaries of this world.",
    love: "You are the romantic mystic. You value a love that feels like a fated, spiritual union. You show love through infinite compassion, artistic devotion, and the ability to see your partner's soul rather than just their human flaws. To you, love is a form of prayer.",
    aesthetic: "Your style is flowing, soft, and slightly otherworldly. You love iridescent fabrics, shimmering details, and anything that feels like a walking dream. Your presence is ethereal, often favoring sea-foam greens, lavenders, and fabrics that move like water.",
    wealth: "You value art, music, and the healing of the world. Abundance flows to you through your intuition and your ability to manifest the impossible. You attract wealth when you follow your creative spirit and trust in the invisible currents of the universe."
  }
};

const getVenusDescription = (sign) => venusSignData[sign]?.description || "Celestial Profile";
const getVenusAffection = (sign) => venusSignData[sign]?.affection || "N/A";
const getVenusValues = (sign) => venusSignData[sign]?.values || "N/A";
const getVenusMagnetism = (sign) => venusSignData[sign]?.magnetism || "N/A";
const getVenusEssence = (sign) => venusSignData[sign]?.essence || "Data unavailable.";
const getVenusLove = (sign) => venusSignData[sign]?.love || "Data unavailable.";
const getVenusAesthetic = (sign) => venusSignData[sign]?.aesthetic || "Data unavailable.";
const getVenusWealth = (sign) => venusSignData[sign]?.wealth || "Data unavailable.";

export default Venus;