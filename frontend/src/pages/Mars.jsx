import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Flame, Sword, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const marsData = {
  Aries: {
    description: "The Primal Combatant", drive: "Fierce", action: "Instant", will: "Unstoppable",
    essence: "Mars is the natural ruler of Aries, operating here with unadulterated velocity. Your drive is a sudden, explosive release of intent that bypasses the hesitation of the mind. You do not wait for the 'perfect moment'—you seize the void and fill it with your presence. This is the energy of the pioneer who clears the path by walking it, fueled by a primal, burning need to dominate your own limitations and be the first to touch the horizon.",
    conflict: "When challenged, you respond with the Aries frequency—total authenticity and direct, frontal engagement. You have no interest in the shadows of passive-aggression; you strike quickly to clear the air. Your anger is a summer storm: intense, loud, and transformative, but it leaves as quickly as it arrived, leaving no room for grudges or bitterness.",
    energy: "Your vitality is high-octane but burns with a short fuse. You possess a 'sprint' physiology that regenerates through high-intensity physical challenge, competitive sports, and the pursuit of goals that demand immediate, courageous effort. To stay vital, you must always have a new 'front' to conquer."
  },
  Taurus: {
    description: "The Iron Bull", drive: "Enduring", action: "Deliberate", will: "Resolute",
    essence: "Mars in Taurus is the warrior of attrition and the master of the long game. Your drive is slow to spark, but once in motion, it possesses the unstoppable momentum of a landslide. You seek tangible, material results—wealth, legacy, and physical security. Your power is rooted deep in the earth, giving you a legendary stamina that allows you to outlast even the most explosive opponents through sheer refusal to quit.",
    conflict: "You avoid conflict with a profound, peaceful patience, but when pushed past your ironclad boundaries, you become a force of nature. You don't win through agility; you win through stubbornness and the absolute refusal to move an inch until your ground is secure. Your 'bellow' is rare, but it shakes the foundations of those who provoked it.",
    energy: "Your energy is steady, rhythmic, and deeply sensual. You regenerate through physical contact with the earth, heavy resistance training, and the indulgence of the senses. Slow, methodical movement and the accumulation of physical strength are your primary sources of power."
  },
  Gemini: {
    description: "The Verbal Tactician", drive: "Restless", action: "Agile", will: "Flexible",
    essence: "Your drive is entirely cerebral and multi-directional. You assert your will through the mastery of information, quick wit, and the ability to pivot faster than your shadow. For you, the greatest weapon is the Word, and the battlefield is the mind. You find power in being a 'jack-of-all-trades,' navigating obstacles by simply rethinking them into opportunities or talking your way through locked doors.",
    conflict: "In battle, you utilize logic, distraction, and wit. You out-talk and out-think your opposition, often winning a conflict by changing the rules of the argument mid-stream before the other person realizes the game has even started. You fight with your tongue, and your weapon of choice is a sharp, precise irony.",
    energy: "Your energy is nervous, electric, and requires constant variety. You regenerate through mental stimulation, debate, and engaging in multiple simultaneous projects. Boredom is your only true weakness; you need the 'wind' of new ideas to keep your internal engine turning."
  },
  Cancer: {
    description: "The Protective Guardian", drive: "Intuitive", action: "Indirect", will: "Tenacious",
    essence: "Mars in Cancer asserts itself through the tidal pull of the heart. Your drive is fueled by the visceral need to protect your tribe, your home, and your emotional inner sanctum. You operate like the sea—ebbing and flowing, appearing soft until the moment of impact. You don't attack; you defend with a ferocity that catches others off guard, asserting your will through emotional intelligence and an uncanny sense of timing.",
    conflict: "Your conflict style is defensive, sidestepping, and deeply intuitive. You prefer to protect your flank, but if a loved one is threatened, you display a 'crustacean' tenacity—once you latch onto an objective or an enemy, you do not let go. You win by making the other person feel the emotional weight of their actions.",
    energy: "Your energy is tied to your internal moon-cycles and moods. You regenerate through proximity to water, the safety of a domestic sanctuary, and the act of nurturing others. Your vitality is highest when you feel emotionally aligned with your mission."
  },
  Leo: {
    description: "The Solar Commander", drive: "Glorious", action: "Dramatic", will: "Sovereign",
    essence: "Your drive is fueled by a solar desire for recognition, creative immortality, and the pursuit of joy. You don't just want to achieve; you want to achieve with a flourish that inspires awe. You assert your will with a warm, commanding presence that naturally draws others into your orbit. For you, life is a performance, and you play the role of the hero with a noble, unwavering heart.",
    conflict: "You fight for your honor, your reputation, and your creative vision. You despise pettiness and 'small' behavior, preferring a grand, noble duel to a back-alley scrap. You win through sheer charisma and the refusal to let your internal fire be dimmed by the doubts of the audience. You are at your most dangerous when your pride is at stake.",
    energy: "Your energy is radiant and heart-centered. You regenerate through play, romance, artistic expression, and being the center of attention. Physical activities that involve performance or 'showing off' your strength are the best ways to keep your vitality burning bright."
  },
  Virgo: {
    description: "The Precision Striker", drive: "Methodical", action: "Efficient", will: "Purifying",
    essence: "Mars in Virgo is the warrior of the workplace and the master of the ritual. Your drive is focused on mastery, craft, and the infinite perfection of detail. You find power in being indispensable and in the clinical dismantling of complex chaos into elegant, working systems. You assert your will through competence; your signature move is doing the job better than anyone else thought possible.",
    conflict: "You win through technical superiority and a 'surgical' exploitation of the opponent's flaws. Your conflict style is cool, analytical, and aimed at providing a permanent, systemic solution rather than a temporary emotional victory. You don't argue; you troubleshoot the opposition until they cease to be a problem.",
    energy: "Your energy is nervous but highly channeled. You regenerate through organized movement (like yoga or Pilates), healthy bio-hacking, and the profound psychological satisfaction of a job performed with total technical integrity. You need to feel that your actions are 'useful' to remain energized."
  },
  Libra: {
    description: "The Diplomatic Duelist", drive: "Social", action: "Balanced", will: "Relational",
    essence: "Your drive is focused on the pursuit of social justice and the alchemy of partnership. You assert your will to create harmony, often acting as the 'iron fist in a velvet glove.' You find your strength in collaboration and the pursuit of aesthetic or legal balance. You are the strategist of the social sphere, moving pieces on the board to ensure that everyone plays by the rules of fairness.",
    conflict: "You find raw conflict distasteful but will fight fiercely for a cause that is 'right.' You win through sophisticated negotiation, charm, and the ability to turn an opponent into an ally by appealing to their sense of reason and grace. You use the opponent's own momentum to bring them back into balance.",
    energy: "Your energy is highly dependent on your aesthetic and relational environment. You regenerate through beauty, fine art, and the company of people who mirror your highest ideals. You need social 'air' to keep your fire from going out."
  },
  Scorpio: {
    description: "The Subterranean Force", drive: "Intense", action: "Calculated", will: "Unyielding",
    essence: "Mars is the ancient ruler of Scorpio, granting you a drive that is bottomless, obsessive, and transmutative. You do not seek superficial victories; you seek total control and the mastery of the unseen. Your will is a surgical laser, cutting through masks and pretenses to reach the marrow of the situation. You are the warrior of the shadows, comfortable with the dark because you know how to navigate it.",
    conflict: "You are a master of psychological strategy. You rarely strike first, but you always strike last. You win through endurance, silence, and an uncanny ability to wait for the exact moment when the opponent is most vulnerable. You win by outlasting the enemy's spirit and transforming the battlefield itself.",
    energy: "Your energy is deep, private, and highly regenerative. You find vitality in the 'shadow-work'—through intense physical intimacy, occult research, and facing life-or-death situations. You are like a phoenix; you regenerate by burning your old self down and rising from the ashes.",
    
  },
  Sagittarius: {
    description: "The Adventurous Archer", drive: "Expansive", action: "Bold", will: "Philosophical",
    essence: "Your drive is a sacred quest for truth, freedom, and the 'Big Picture.' You assert your will through expansion—traveling, learning, and preaching your personal gospel. You are a warrior for the Truth, fueled by an infectious, optimistic belief that the universe is a vast playground designed for your growth. Your 'arrow' is always aimed at the furthest possible point on the horizon.",
    conflict: "You fight for your beliefs with a blunt, honest, and sometimes tactless intensity. You have no patience for cages, lies, or small-minded dogmas. You win by out-pacing the opposition and maintaining a philosophical perspective that makes their arguments seem insignificant in the face of the Infinite.",
    energy: "Your energy is boundless and requires vast, open spaces to thrive. You regenerate through outdoor movement, long-distance travel, and the thrill of the hunt for a new experience. You need a 'higher purpose' to feel physically strong."
  },
  Capricorn: {
    description: "The Strategic General", drive: "Disciplined", action: "Practical", will: "Authoritative",
    essence: "Mars is exalted in Capricorn, making this perhaps the most effective placement for material success. Your drive is clinical, patient, and long-term. You seek status, legacy, and the absolute mastery of the physical world. You treat your life like a military campaign or a mountain to be climbed, prioritizing the 'Objective' over your own temporary comfort or emotional whims.",
    conflict: "You win through superior planning and the attrition of the opponent. You do not waste energy on useless skirmishes; you wait for the strategic advantage and strike only when victory is guaranteed by the laws of logic and structure. You win because you are the one still standing when the winter comes.",
    energy: "Your energy is enduring, high-pressure, and crystalline. You regenerate through solitude, the accomplishment of difficult milestones, and physical activities that demand extreme discipline and resilience (like mountaineering or distance running)."
  },
  Aquarius: {
    description: "The Rebel Catalyst", drive: "Electric", action: "Unconventional", will: "Collective",
    essence: "Your drive is focused on the future and the liberation of the collective. You assert your will by breaking traditions, shocking the status quo, and advocating for radical, systemic change. You are the warrior of the Network, finding power in decentralization and the 'glitch' in the machine. Your actions are often unpredictable because they are guided by a logic that is twenty years ahead of its time.",
    conflict: "You win by changing the game entirely so the old rules no longer apply. You use your emotional detachment to remain cool and analytical while others lose their tempers. You win through innovation, group organizing, and the power of an idea whose time has come.",
    energy: "Your energy is erratic, electric, and high-frequency. You regenerate through collaborative projects, technological tinkering, and breaking away from any routine that feels like a prison. You are fueled by the 'shock' of the new and the 'buzz' of the crowd."
  },
  Pisces: {
    description: "The Mystical Warrior", drive: "Infinite", action: "Fluid", will: "Surrendered",
    essence: "Mars in Pisces asserts itself through the invisible and the imaginal. Your drive is fueled by the spiritual, the creative, and the collective subconscious. You move through obstacles like water—either dissolving them through sheer persistence over time or simply flowing around them to reach the sea. You are the 'Silent Warrior' who wins by surrendering to the Flow, using the universe’s own momentum to achieve your ends.",
    conflict: "You win through non-resistance, empathy, and the power of the soul. Your conflict style is elusive; you are hard to hit because you have no ego for the opponent to target. You win by transforming the enemy's heart or by simply making yourself 'invisible' until the conflict dissolves of its own accord.",
    energy: "Your energy is oceanic and sensitive to the environment. You regenerate through art, music, deep meditation, and proximity to the sea. You must 'drain' the world's noise from your system regularly to keep your vital life-force clear and strong."
  }
};

// Helpers
const getMarsData = (sign) => marsData[sign] || marsData.Aries;

const Mars = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Aries';
    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return marsData[formatted] ? formatted : 'Aries';
  };

  const [marsSign, setMarsSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarsSign = async () => {
      if (signName) {
        setMarsSign(normalizeSign(signName));
        setLoading(false);
        return;
      }
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
        const planetInfo = planetaryData?.find(p => p.name === 'Mars');
        if (planetInfo?.sign) setMarsSign(normalizeSign(planetInfo.sign));
      } catch (err) {
        console.error('Failed to fetch Mars sign:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarsSign();
  }, [user, signName]);

  // Rising Ember Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      draw() {
        ctx.fillStyle = `rgba(220, 38, 38, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.002;
        if (this.y < -10 || this.opacity <= 0) this.reset();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize(); animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentData = getMarsData(marsSign);

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-red-600/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-red-500 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-red-500 via-red-600 to-red-900 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            ♂
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Mars in ${marsSign}`}
            </h1>
            <p className="text-red-500/60 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Warrior: ${currentData.description}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Drive" value={currentData.drive} color="text-red-500" />
              <MetaItem label="Action" value={currentData.action} color="text-red-500" />
              <MetaItem label="Will" value={currentData.will} color="text-red-500" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-red-100 mb-4 flex items-center gap-3">
                  <Flame className="text-red-500" /> The Internal Engine
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {currentData.essence}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={Sword} title="Conflict Style" text={currentData.conflict} color="text-red-500" />
              <ContentSection Icon={Zap} title="Physical Energy" text={currentData.energy} color="text-red-400" />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

const MetaItem = ({ label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
    <span className={`block text-[10px] uppercase tracking-widest ${color} font-bold mb-1`}>{label}</span>
    <span className="text-base font-semibold">{value}</span>
  </div>
);

const ContentSection = ({ Icon, title, text, color }) => (
  <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 group">
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-red-600/10 border border-red-600 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

export default Mars;