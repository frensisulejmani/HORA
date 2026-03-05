import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, ArrowLeft, MessageSquare, Brain, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Mercury = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Gemini';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [mercurySign, setMercurySign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMercurySign = async () => {
      if (signName) {
        setMercurySign(normalizeSign(signName));
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
        const planetInfo = planetaryData?.find(p => p.name === 'Mercury');
        
        if (planetInfo?.sign) {
          setMercurySign(normalizeSign(planetInfo.sign));
        }
      } catch (err) {
        console.error('Failed to fetch Mercury sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMercurySign();
  }, [user, signName]);

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
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.01 + 0.005;
      }
      draw() {
        ctx.fillStyle = `rgba(148, 163, 184, ${this.opacity})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 0.7 || this.opacity < 0.1) this.speed = -this.speed;
      }
    }

    const initParticles = () => {
      particles = [];
      const count = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
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
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-slate-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-slate-300 via-slate-500 to-slate-700 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(148,163,184,0.3)]">
            ☿
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Mercury in ${mercurySign}`}
            </h1>
            <p className="text-slate-400 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Messenger: ${getMercuryDescription(mercurySign)}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Mind" value={getMercuryMind(mercurySign)} color="text-slate-400" />
              <MetaItem label="Voice" value={getMercuryVoice(mercurySign)} color="text-slate-400" />
              <MetaItem label="Logic" value={getMercuryLogic(mercurySign)} color="text-slate-400" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-slate-500/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-slate-200 mb-4 flex items-center gap-3">
                  <Brain className="text-slate-400" /> The Cognitive Blueprint
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {getMercuryEssence(mercurySign)}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={MessageSquare} title="Communication Style" text={getMercuryComm(mercurySign)} color="text-slate-400" />
              <ContentSection Icon={Share2} title="Information Flow" text={getMercuryFlow(mercurySign)} color="text-slate-300" />
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
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-slate-500/10 border border-slate-500 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

const mercuryData = {
  Aries: {
    description: "The Mental Pioneer", mind: "Impulsive", voice: "Decisive", logic: "Direct",
    essence: "Mercury in Aries possesses a mind that operates with the speed of a lightning strike. You don't just think; you launch ideas into the world with the force of a projectile. Your cognitive blueprint is designed for leadership and quick-fire problem solving, often bypassing the nuance of hesitation to reach a conclusion through sheer mental courage. You are the 'First Responder' of the intellectual world, capable of making life-altering decisions in the blink of an eye while others are still reading the instructions.",
    comm: "Your way of speaking is intrinsically linked to action. You seek clarity and speed in your exchanges, often communicating with a blunt honesty that acts as a catalyst for movement in others. You have a natural gift for 'cutting to the chase,' though your mental impatience means you might finish others' sentences if they are moving too slowly for your high-velocity brain.",
    flow: "You filter knowledge through a lens of utility and urgency. You have little patience for redundant data, preferring information that can be immediately weaponized or applied to a conquest. You learn best through challenge; if an idea doesn't spark a sense of adventure or competition, your mind likely moves on to the next frontier."
  },
  Taurus: {
    description: "The Intellectual Builder", mind: "Deliberate", voice: "Resonant", logic: "Concrete",
    essence: "Mercury in Taurus provides a mind that is grounded in the physical world. You process data through the five senses, requiring ideas to have weight and practical application before you accept them. Once you form a thought, it is as unshakeable as stone, built for longevity rather than speed. This is a mental fortress; you may take longer to absorb complex theories, but once a concept is mastered, it becomes a permanent part of your intellectual architecture that can never be demolished.",
    comm: "Your voice is measured, steady, and often possesses a soothing, resonant quality. You speak with a natural authority that comes from thorough internal vetting, often pausing to ensure every word is worth its weight in meaning. You are the person others turn to when they need a 'reality check' amidst a sea of abstract chaos.",
    flow: "Information is filtered through a lens of stability and value. You are the master of the slow-burn realization, absorbing knowledge like a sponge and retaining it for a lifetime. You excel at taking 'high-concept' ideas and breaking them down into tangible, profitable, or sustainable steps that actually work in the real world."
  },
  Gemini: {
    description: "The Cognitive Prism", mind: "Multi-threaded", voice: "Witty", logic: "Agile",
    essence: "Mercury is at home here, creating a mind that is essentially a high-speed processor running multiple programs at once. You are a natural-born translator of the world, capable of seeing every side of an argument and linking disparate ideas with effortless agility. Your brain thrives on variety and novelty; to you, the world is an infinite Wikipedia loop where every 'fact' is merely a gateway to three more questions. You possess the unique ability to maintain a 'dual-core' thought process, often holding two opposing truths simultaneously without discomfort.",
    comm: "Your communication is fast-paced, versatile, and often layered with humor. You speak to learn, using conversation as a laboratory to test new concepts and social dynamics. You are a verbal acrobat, capable of mirroring the communication style of anyone you meet, which makes you an incredibly effective—and sometimes elusive—messenger.",
    flow: "Information flows through you like a river. You filter news through a lens of objectivity and curiosity, prioritizing variety and mental stimulation over deep, singular focus. Your 'Information Flow' is wide rather than deep, making you a polymath who can speak intelligently on a thousand subjects, always staying one step ahead of the cultural zeitgeist."
  },
  Cancer: {
    description: "The Intuitive Narrator", mind: "Empathic", voice: "Soft", logic: "Subjective",
    essence: "Mercury in Cancer thinks in pictures, memories, and feelings. Your mind functions less like a calculator and more like a high-definition emotional archive. You possess a 'gut-level' intelligence that senses the unspoken subtext in any environment, often 'knowing' things before they are articulated. Your cognitive process is deeply tied to your sense of safety; you think best when you feel emotionally secure, and your thoughts are often colored by the moods of the people surrounding you.",
    comm: "Your speech is careful, nurturing, and deeply evocative. You are a storyteller by nature, using words to weave emotional safety and connect deeply with the listener's personal history. You have the rare ability to make people feel 'heard' on a soul level, though you may become silent or defensive if you sense mental aggression from others.",
    flow: "You filter knowledge through a lens of safety and sentiment. Information is only valuable to you if it feels 'right' and helps protect or nourish the things you care about most. Your memory is legendary because it is attached to emotion; you don't just remember a fact, you remember exactly how you felt the moment you learned it."
  },
  Leo: {
    description: "The Radiant Speaker", mind: "Creative", voice: "Dramatic", logic: "Fixed",
    essence: "Mercury in Leo possesses a mind colored by warmth, creative vision, and a desire for significance. You think in grand gestures and dramatic arcs, often acting as the mental 'Sun' of your social circle—irradiating ideas that inspire and command attention. Your cognitive style is 'Fixed,' meaning that once you have decided on a creative direction or a personal truth, you hold onto it with a regal confidence that is difficult for others to shake.",
    comm: "Your voice is designed for the stage, whether that stage is a boardroom or a dinner party. You don't just share information; you perform it. You seek to leave a lasting impression, using persuasive and colorful language to lead, motivate, and shine. You have a natural talent for making even the most mundane data sound like a grand manifesto.",
    flow: "Information is filtered through the lens of identity and 'Self.' You are drawn to knowledge that allows you to express your unique genius and reinforces your sense of personal authority. You learn best when you can see your own reflection in the material—when you can 'own' the idea and present it as part of your personal brand."
  },
  Virgo: {
    description: "The Analytical Master", mind: "Surgical", voice: "Precise", logic: "Detailed",
    essence: "Mercury in Virgo is the ultimate editor of the zodiac. Your mind functions like a high-resolution microscope, catching flaws, inconsistencies, and nuances that others miss. You find immense satisfaction in organizing chaos into clear, functional systems. To you, thinking is an act of service; you use your intellect to fix, refine, and improve the world around you. You are the person people call when they need a complex problem solved with clinical accuracy and zero ego.",
    comm: "Your communication is concise, helpful, and grounded in fact. You speak to clarify and assist, often offering practical advice that is meticulously researched. You value precision over flowery language, believing that the truth is most beautiful when it is articulated clearly and without unnecessary 'noise.'",
    flow: "You filter information through a lens of utility and purity. You ruthlessly discard 'fluff,' keeping only the data that is accurate and can be used to improve a system. You are the guardian of the details, knowing that if the micro-level is handled with integrity, the macro-level will take care of itself."
  },
  Libra: {
    description: "The Diplomatic Mind", mind: "Harmonious", voice: "Persuasive", logic: "Relational",
    essence: "Mercury in Libra thinks in terms of balance, symmetry, and the 'Social Contract.' Your cognitive blueprint is designed to find the middle ground, making you an incomparable negotiator. You weigh every option carefully—sometimes to the point of indecision—because you can see the validity in every perspective. Your intellect is refined and aesthetic; you are offended by intellectual 'ugliness' or aggressive, one-sided arguments that lack grace.",
    comm: "Your speech is elegant, tactful, and highly persuasive. You have a gift for saying the right thing at the right time to maintain harmony, often using your intellect to bridge the gap between opposing viewpoints. You are the master of the 'gentle correction,' able to change minds without bruising egos.",
    flow: "Information is filtered through a lens of social justice and beauty. You are drawn to ideas that promote cooperation and refine the quality of human connection. You process knowledge best through dialogue; bouncing ideas off another person helps you find the 'equilibrium' that your mind naturally craves."
  },
  Scorpio: {
    description: "The Investigative Thinker", mind: "Subterranean", voice: "Intense", logic: "Sleuth",
    essence: "Mercury in Scorpio possesses a mind that functions like an X-ray. You aren't interested in the surface; you think in terms of power, secrets, and the underlying psychological truth. Your focus is laser-like and once you set your sights on a mystery, you won't stop until you've reached the 'marrow' of the matter. You are the mental 'Alchemist,' capable of taking heavy, dark, or taboo information and transforming it into profound wisdom.",
    comm: "Your voice is often quiet but carries immense psychological weight. You speak with a penetrating honesty that can be both healing and intimidating. You have a low tolerance for trivial small talk, preferring to use your words as surgical tools to uncover what is really going on beneath the social masks of others.",
    flow: "Information is filtered through a lens of suspicion and survival. You treat every piece of data as a potential clue to a larger mystery, looking for the hidden agenda. You learn best in private; your intellectual process is often a solitary journey into the depths of a subject until you have mastered its most hidden mechanisms."
  },
  Sagittarius: {
    description: "The Philosophical Voyager", mind: "Expansive", voice: "Frank", logic: "Global",
    essence: "Mercury in Sagittarius thinks in the 'Big Picture.' Your mind is a perpetual wanderer, constantly seeking the higher meaning and the universal truth behind every fact. You possess a natural intellectual optimism and a hunger for knowledge that spans cultures, religions, and philosophies. To you, a fact is only useful if it points toward a larger Law of the Universe. You are the 'Eternal Student' who eventually becomes the 'Great Teacher.'",
    comm: "Your communication is direct, honest, and often wildly inspiring. You speak to broaden horizons and break boundaries. While your bluntness can sometimes skip over the necessary details (or hurt sensitive feelings), people are generally drawn to the infectious enthusiasm and the 'Grand Vision' you provide.",
    flow: "Information is filtered through a lens of freedom and truth. You are drawn to expansive ideas that challenge limitations. You learn best through experience and travel; for you, a book is never a substitute for standing on the ground where history was made. You filter out the 'small stuff' to keep your mental eye on the horizon."
  },
  Capricorn: {
    description: "The Strategic Architect", mind: "Disciplined", voice: "Authoritative", logic: "Pragmatic",
    essence: "Mercury in Capricorn provides a mind built for the 'Long Game.' Your thinking is structured, realistic, and highly disciplined. You don't waste mental energy on fantasies or unproven theories; you focus on what is achievable and how to build a lasting legacy. You possess a 'Mental Maturity' that allows you to remain calm under pressure, making you the person everyone looks to when a strategy needs to be executed with zero margin for error.",
    comm: "Your speech is professional, economical, and carries the authority of experience. You value clarity, brevity, and respect. You are the master of the silent power-move—you only speak when you have something of substance to contribute, ensuring that when you do talk, everyone listens.",
    flow: "Information is filtered through a lens of hierarchy and utility. You prioritize data that helps you climb the mountain and achieve tangible results. You have an incredible ability to 'silo' information, keeping your focus on the task at hand and ignoring anything that doesn't serve the overarching goal of the project or your career."
  },
  Aquarius: {
    description: "The Electric Innovator", mind: "Detached", voice: "Radical", logic: "Futuristic",
    essence: "Mercury in Aquarius thinks outside the box—or rather, ignores the box entirely. Your mind operates on a high-frequency, often coming up with flashes of insight that seem decades ahead of their time. You possess a 'Mental Detachment' that allows you to look at problems objectively, without the cloud of personal emotion. You are the architect of the revolutionary thought, often seen as a 'genius' or an 'eccentric' by those still stuck in traditional ways of thinking.",
    comm: "Your communication is unique, original, and often highly intellectualized. You speak for the collective, advocating for progress and radical change. You value objectivity and the power of the original idea above all else, often preferring to communicate with a 'global' or 'universal' audience rather than engaging in personal drama.",
    flow: "Information is filtered through a lens of social evolution and logic. You are drawn to the fringe, the scientific, and the technological. You learn through 'Zaps' of intuition—sudden breakthroughs where the entire puzzle pieces itself together in an instant. You prioritize data that has the potential to liberate the human mind."
  },
  Pisces: {
    description: "The Mystical Dreamer", mind: "Boundless", voice: "Poetic", logic: "Intuitive",
    essence: "Mercury in Pisces thinks in music, symbols, and dreams. Your mind is a porous filter for the collective unconscious, allowing you to absorb information through osmosis and pure intuition. You find the logic in the illogical and the patterns in the chaos. Your cognitive blueprint is 'Boundless,' meaning your thoughts often drift into the mystical or the artistic, seeing connections between things that a more linear mind would completely overlook.",
    comm: "Your speech is often poetic, vague, or deeply imaginative. You communicate through feeling and metaphor, often conveying more through your tone, silence, and presence than through the literal meaning of your words. You are the person who can explain the 'unexplainable' through a single, perfect image.",
    flow: "Information is filtered through a lens of compassion and transcendence. You are drawn to the mystical and the artistic, prioritizing the 'spiritual truth' over rigid, linear facts. You learn best in a quiet, imaginative environment where your mind can 'drift' into the subject until you become one with the knowledge you are seeking."
  }
};

const getMercuryDescription = (s) => mercuryData[s]?.description || "The Celestial Profile";
const getMercuryMind = (s) => mercuryData[s]?.mind || "Analytical";
const getMercuryVoice = (s) => mercuryData[s]?.voice || "Adaptable";
const getMercuryLogic = (s) => mercuryData[s]?.logic || "Sharp";
const getMercuryEssence = (s) => mercuryData[s]?.essence || "Your cognitive blueprint and way of processing the world.";
const getMercuryComm = (s) => mercuryData[s]?.comm || "How you express your thoughts to others.";
const getMercuryFlow = (s) => mercuryData[s]?.flow || "How you filter and absorb information from the cosmos.";

export default Mercury;