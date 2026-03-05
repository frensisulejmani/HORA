import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Anchor, ArrowLeft, Lock, Mountain, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const saturnData = {
  Aries: {
    description: "The Disciplined Pioneer", lesson: "Patience", legacy: "Fortified", duty: "Strategic",
    essence: "Saturn in Aries is the challenge of the 'Controlled Burn.' Your lesson is to marry your impulsive drive with a master plan. In early life, you may have felt your initiative was constantly blocked by red tape or authority figures, but these walls were designed to teach you that true power is not just starting a fire, but sustaining it through calculated effort. You are learning that the fastest way is rarely the most enduring way, and that a warrior’s greatest weapon is their restraint.",
    boundaries: "You find structure by learning to respect the limits of your own energy and the autonomy of others. Your boundaries are forged in the realization that true freedom comes from internal sovereignty rather than outward rebellion. You understand that a leader without a strategy is merely a liability to the mission.",
    mastery: "Your karmic mastery involves transforming hot-headed reactivity into the cool, focused authority of a commander. You achieve success when you learn to sit in the tension of the 'wait'—knowing exactly when the iron is hot enough to strike for a permanent victory.",
    returnManifestation: "Your Saturn Return often involves a major reality check regarding your leadership style, forcing you to build a project from the ground up without taking shortcuts."
  },
  Taurus: {
    description: "The Builder of Foundations", lesson: "Self-Worth", legacy: "Enduring", duty: "Reliable",
    essence: "Saturn in Taurus brings a heavy, grounding influence to your material world. You are here to learn the profound difference between 'accumulation' and 'value.' You may have grown up with a deep-seated fear of lack or a sense that security is fragile, which drives you to build structures that are physically and financially unbreakable. You find your greatest strength in the slow, painstaking cultivation of a life that is as beautiful as it is secure.",
    boundaries: "You define your edges through your relationship with the physical world and your own body. Your boundaries are made of stone—they are slow to build and difficult to move, but once set, they provide a sanctuary for generations. You find security in knowing exactly what belongs to you and what you owe to the earth.",
    mastery: "You master the art of material manifestation by realizing that your worth is not tied to your possessions, but to your ability to remain steadfast when the economic or emotional earth shakes. You are the architect of the 'Long Legacy,' building wealth that serves a purpose beyond mere consumption.",
    returnManifestation: "The Saturn Return for you often centers on financial independence and the stripping away of material crutches to reveal your true, internal value."
  },
  Gemini: {
    description: "The Serious Communicator", lesson: "Focus", legacy: "Intellectual", duty: "Precise",
    essence: "Saturn in Gemini is the architect of the mind. Your challenge is to filter the 'noise' of infinite information into a singular, meaningful signal. You may have faced early difficulties in being heard, or perhaps a childhood where facts were weaponized, forcing you to develop a mental discipline that is far sharper and more precise than your peers. You are here to learn that cleverness is not the same as wisdom, and that information requires a skeleton of logic to hold weight.",
    boundaries: "You find safety in the mastery of language and the iron-clad logic of facts. Your boundaries are linguistic and intellectual; you understand that 'No' is a complete sentence and that clarity is the highest form of protection against the chaos of the world.",
    mastery: "Your karmic path is the mastery of the Word. You are the one who takes flighty, ethereal ideas and gives them the structural integrity required to become reality. You achieve mastery when your communication serves as a bridge of steel rather than a thread of silk.",
    returnManifestation: "Your Saturn Return often marks a period of intense study or a significant shift in how you use your voice, moving from 'talker' to 'authority' in your field."
  },
  Cancer: {
    description: "The Stoic Protector", lesson: "Vulnerability", legacy: "Ancestral", duty: "Sacred",
    essence: "Saturn in Cancer creates a 'Shell of Protection' around the inner child. Your lesson is to learn that sensitivity is not a weakness, but a grave responsibility. You may have felt an early burden to care for your family or a sense of emotional isolation in your youth, which taught you how to be your own sanctuary. You are learning to parent yourself, building an internal foundation of safety that no external storm can reach.",
    boundaries: "Your boundaries are emotional and domestic. You are the gatekeeper of the heart, learning to let in only those who respect the sacredness of your inner home. Your boundaries are not meant to keep life out, but to ensure that the life within is nurtured by those who are worthy of its softness.",
    mastery: "You achieve mastery by building an emotional legacy that provides safety for others without sacrificing your own need for care. You become the 'Grandparent' figure of your circle—the one who holds the emotional history and the structural support for the tribe.",
    returnManifestation: "Your Saturn Return often involves a major shift in your living situation or a deep reconciliation with your heritage and childhood roots."
  },
  Leo: {
    description: "The Humble Sovereign", lesson: "Self-Approval", legacy: "Majestic", duty: "Creative",
    essence: "Saturn in Leo is the challenge of 'Inner Authority.' Your path involves a long journey away from the need for external applause toward a state of self-contained, solar dignity. Early on, your creativity may have felt stifled, criticized, or ignored, forcing you to find a source of light that doesn't depend on the audience's reaction. You are here to learn that true royalty is a matter of character, not a matter of fame.",
    boundaries: "You find structure through creative discipline and the refusal to compromise your standards. Your boundaries are based on your personal honor and the realization that you do not need to perform to be worthy of your own crown. You understand the difference between a costume and a soul.",
    mastery: "Karmic mastery for you is the ability to lead with a warm heart and a cool head. You reach your peak when you create art or leadership that serves a purpose higher than your own ego—creating a 'Golden Legacy' that inspires others to find their own light.",
    returnManifestation: "The Saturn Return often brings a 'death of the ego,' where you must choose between chasing the spotlight or standing in your true power, even if it's in the dark."
  },
  Virgo: {
    description: "The Master Craftsman", lesson: "Discernment", legacy: "Technically Perfect", duty: "Service",
    essence: "Saturn in Virgo is the ultimate 'troubleshooter' of the zodiac. Your life is a series of lessons in refinement, discernment, and the mastery of the physical body. You may struggle with a loud internal critic or paralyzing perfectionism, but your true gift is the ability to see the sacred geometry in the mundane. You are here to learn that 'perfection' is a process, not a destination, and that true mastery is found in the repetitive ritual.",
    boundaries: "You find security in routine, hygiene, and health. Your boundaries are defined by your high technical standards and your refusal to accept anything that lacks integrity. You protect your time and energy so that your work remains untainted by the chaos of others.",
    mastery: "You master the realm of the physical by realizing that service is a holy act. When you fix what is broken—be it a machine, a body, or a system—you are performing a spiritual duty. Mastery is the realization that the smallest detail, handled with total presence, can stabilize an entire universe.",
    returnManifestation: "Your Saturn Return usually involves a significant health shift or a 'Mastery Milestone' in your career that requires extreme attention to detail."
  },
  Libra: {
    description: "The Just Arbiter", lesson: "Fairness", legacy: "Diplomatic", duty: "Contractual",
    essence: "Saturn is exalted in Libra, making you a natural guardian of the Law and the Social Contract. Your life revolves around the serious, often heavy work of relationship and social balance. You may attract 'karmic' mirrors—partners who force you to define exactly who you are. You are here to learn that love is not just a feeling, but a commitment to justice and mutual growth.",
    boundaries: "You find structure through contracts, agreements, and the laws of fairness. Your boundaries are the scales of justice; you seek to ensure that every interaction is weighted correctly. You learn that the word 'No' is the most important tool in maintaining a balanced 'Yes.'",
    mastery: "Your mastery is the art of the 'Iron Fist in the Velvet Glove.' You become the mediator who can hold space for intense conflict while moving everyone toward a higher, structural peace. You achieve success when your relationships are built on shared values rather than shared convenience.",
    returnManifestation: "Your Saturn Return almost always centers on a major commitment—either a serious marriage, a business partnership, or a significant legal resolution."
  },
  Scorpio: {
    description: "The Guardian of the Abyss", lesson: "Surrender", legacy: "Transmuted", duty: "Psychic",
    essence: "Saturn in Scorpio is a journey through the underworld. You are here to master the 'Heavy' energies—sex, death, intimacy, and shared power. Your path often involves facing profound betrayals or losses in your youth that strip away everything superficial, leaving only the indestructible core of your soul. You are learning that true safety comes not from controlling the dark, but from being comfortable within it.",
    boundaries: "Your boundaries are absolute, psychic, and often hidden. You possess a 'Do Not Cross' energy that protects your deepest transformations. You learn to be discerning about who you merge with, understanding that every connection is a karmic exchange of power.",
    mastery: "You achieve karmic mastery by realizing that true power comes from the ability to walk through fire and emerge as someone entirely new. You are the Alchemist of the Zodiac, turning the 'lead' of trauma into the 'gold' of psychological authority.",
    returnManifestation: "The Saturn Return for you is often a 'Phoenix Moment'—a total collapse of an old identity to make room for a version of you that is truly powerful."
  },
  Sagittarius: {
    description: "The Ethical Scholar", lesson: "Truth", legacy: "Philosophical", duty: "Principled",
    essence: "Saturn in Sagittarius is the 'Reality Check' for the spirit. Your lesson is to turn abstract beliefs into lived principles. You may have faced early limitations regarding your education, travel, or freedom, which taught you that true expansion is not about how far you go, but how deep your integrity runs. You are here to learn that a philosophy that cannot survive the real world is merely a fantasy.",
    boundaries: "You find structure through your personal code of ethics. Your boundaries are intellectual and moral; you refuse to entertain any belief or person that cannot stand up to the test of reality. You understand that true freedom is only possible within a framework of truth.",
    mastery: "Your mastery involves becoming a teacher who doesn't just preach the truth, but embodies it. You build a legacy of wisdom that serves as a lighthouse for other seekers. You achieve mastery when your optimism is tempered by experience, making you a grounded visionary.",
    returnManifestation: "Your Saturn Return often involves a major 'Crisis of Faith' or a significant academic/publishing achievement that cements your worldview."
  },
  Capricorn: {
    description: "The Architect of the Mountain", lesson: "Legacy", legacy: "Indestructible", duty: "Ancestral",
    essence: "Saturn is at home in Capricorn, at its peak of structural power. You are born with the weight of the world on your shoulders and a 'Benjamin Button' soul—serious as a child, only finding your youth as you grow older. Your life is a long-distance climb toward a summit only you can see. You are here to master the material world and to prove that time is your greatest ally, not your enemy.",
    boundaries: "You are the boundary personified. You find security in hierarchy, tradition, and the physical laws of success. Your edges are defined by your achievements and your iron-clad sense of duty to your future self. You learn that discipline is the highest form of self-love.",
    mastery: "You master the dimension of Time. You understand that nothing worth having is built quickly, and you have the patience to outlast every obstacle. Your legacy is etched in stone, providing a foundation for those who follow to build upon.",
    returnManifestation: "Your Saturn Return is your 'Coronation.' It marks the moment you step into your true authority and receive the rewards for the hard work of your 20s."
  },
  Aquarius: {
    description: "The Systematic Rebel", lesson: "Contribution", legacy: "Future-Proof", duty: "Collective",
    essence: "Saturn in Aquarius is the 'Network Architect.' Your lesson is to learn how to be a radical individual within the rigid constraints of a group. You may have felt like a permanent outsider or an exile in your youth, which forced you to build your own community based on shared vision rather than shared blood. You are here to learn that true rebellion requires a better system to replace the one you are breaking.",
    boundaries: "You find structure through objectivity and intellectual detachment. Your boundaries are defined by your logic and your commitment to the greater good. You protect your mental space from the 'hive mind' so that you can remain a clear channel for the future.",
    mastery: "Your karmic mastery involves taking 'weird' or 'alien' ideas and building the social or technological systems required to integrate them into society. You are the one who ensures the future has a solid foundation to stand on.",
    returnManifestation: "Your Saturn Return often involves a shift from being a 'loner' to being the leader of a significant movement, organization, or digital community."
  },
  Pisces: {
    description: "The Compassionate Sentinel", lesson: "Boundaries", legacy: "Spiritual", duty: "Infinite",
    essence: "Saturn in Pisces is the most spiritual and challenging placement—the 'Vessel for the Infinite.' Your lesson is to give form to the formless. You may feel the weight of the world's collective suffering, and your task is to learn how to be a bridge between the dream world and the real world without drowning. You are here to learn that spiritual practice requires more discipline than any office job.",
    boundaries: "Your life's work is to *create* boundaries where there are naturally none. You find safety by realizing that you cannot save everyone, but you can create a sacred container for your own spirit. You learn that saying 'No' to others is sometimes the only way to say 'Yes' to God.",
    mastery: "You achieve mastery by turning your intuition into a reliable tool and your compassion into a disciplined force for healing. You build a bridge between the mundane and the divine, providing a structural pathway for others to find their own spiritual grounding.",
    returnManifestation: "Your Saturn Return often involves a 'Spiritual Crisis' that leads to a profound, disciplined commitment to an artistic or healing path."
  }
};

const Saturn = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Capricorn';
    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return saturnData[formatted] ? formatted : 'Capricorn';
  };

  const [satSign, setSatSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaturnSign = async () => {
      if (signName) {
        setSatSign(normalizeSign(signName));
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
        const planetInfo = planetaryData?.find(p => p.name === 'Saturn');
        if (planetInfo?.sign) setSatSign(normalizeSign(planetInfo.sign));
      } catch (err) {
        console.error('Failed to fetch Saturn sign:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaturnSign();
  }, [user, signName]);

  // "Rings of Time" - Orbital Particle Animation
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
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 300 + 100;
        this.speed = (Math.random() * 0.002) + 0.0005;
        this.size = Math.random() * 1.2 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      draw() {
        const x = canvas.width / 2 + Math.cos(this.angle) * this.radius * (canvas.width / 1000);
        const y = canvas.height / 2 + Math.sin(this.angle) * (this.radius * 0.4) * (canvas.height / 800);
        
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.angle += this.speed;
      }
    }

    const initParticles = () => {
      particles = [];
      const count = 150;
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

  const currentData = saturnData[satSign];

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-amber-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-amber-500 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-[#f5e1a4] via-[#d4af37] to-[#8b5a2b] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            ♄
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Saturn in ${satSign}`}
            </h1>
            <p className="text-amber-500/60 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Taskmaster: ${currentData.description}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Lesson" value={currentData.lesson} color="text-amber-500" />
              <MetaItem label="Legacy" value={currentData.legacy} color="text-amber-500" />
              <MetaItem label="Duty" value={currentData.duty} color="text-amber-500" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-amber-100 mb-4 flex items-center gap-3">
                  <Mountain className="text-amber-500" /> The Architect of Time
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {currentData.essence}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={Lock} title="Boundaries & Limits" text={currentData.boundaries} color="text-amber-500" />
              <ContentSection Icon={Scale} title="Karmic Mastery" text={currentData.mastery} color="text-amber-400" />
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
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

export default Saturn;