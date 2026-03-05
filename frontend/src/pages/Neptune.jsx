import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ghost, ArrowLeft, Waves, Eye, Moon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Neptune = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Pisces';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [neptuneSign, setNeptuneSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeptuneSign = async () => {
      if (signName) {
        setNeptuneSign(normalizeSign(signName));
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
        const planetInfo = planetaryData?.find(p => p.name === 'Neptune');
        
        if (planetInfo?.sign) {
          setNeptuneSign(normalizeSign(planetInfo.sign));
        }
      } catch (err) {
        console.error('Failed to fetch Neptune sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNeptuneSign();
  }, [user, signName]);

  // Oceanic/Mist background animation
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
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.2 - 0.1;
      }
      draw() {
        ctx.fillStyle = `rgba(52, 211, 153, ${this.opacity})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
    }

    const initParticles = () => {
      particles = [];
      const count = (canvas.width * canvas.height) / 15000;
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
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-emerald-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-[#a7f3d0] via-[#34d399] to-[#065f46] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            ♆
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Neptune in ${neptuneSign}`}
            </h1>
            <p className="text-emerald-400/60 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Mystic: ${getNeptuneDescription(neptuneSign)}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Vision" value={getNeptuneVision(neptuneSign)} color="text-emerald-400" />
              <MetaItem label="Depth" value={getNeptuneDepth(neptuneSign)} color="text-emerald-400" />
              <MetaItem label="Soul" value={getNeptuneSoul(neptuneSign)} color="text-emerald-400" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-emerald-100 mb-4 flex items-center gap-3">
                  <Waves className="text-emerald-400" /> The Veil of Illusion
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {getNeptuneEssence(neptuneSign)}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={Eye} title="Intuitive Reach" text={getNeptuneReach(neptuneSign)} color="text-emerald-400" />
              <ContentSection Icon={Moon} title="Spiritual Escape" text={getNeptuneEscape(neptuneSign)} color="text-emerald-300" />
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
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

const neptuneData = {
  Aries: {
    description: "The Spiritual Pioneer", vision: "Fearless", depth: "Fiery", soul: "Active",
    essence: "Neptune in Aries represents a generation that dreams of radical new beginnings and the spiritualization of the Will. Here, the boundaries of the 'Self' dissolve not into passive meditation, but into a fiery desire for spiritual conquest. You are part of a cycle that seeks to burn away stagnant religious structures to discover a raw, primal connection to the Divine. It is the mystic as the warrior, dreaming of a world where every individual is a sovereign spark of God, forging a new reality through bold, unprecedented action.",
    reach: "Your psychic sensitivity is tuned to the frequency of raw energy, kinetic potential, and impulse. You sense the 'First Spark' of change before it manifests in the physical world, often feeling a collective 'push' toward a new era of identity long before others wake up to the shift. You intuitively understand that spiritual peace is sometimes only found on the other side of a necessary conflict.",
    escape: "You find sanctuary in high-intensity, immersive experiences that blur the line between the physical body and the ethereal spirit. For you, transcendence isn't found in stillness; it is found in the 'Flow State' of movement—adrenaline-fueled adventures, the heat of a new creative spark, or the total mental absorption of starting a revolution from scratch."
  },
  Taurus: {
    description: "The Eden Architect", vision: "Earthly", depth: "Grounded", soul: "Sensual",
    essence: "Neptune in Taurus dreams of a physical paradise—a literal 'Heaven on Earth.' This generation seeks to dissolve the cold, hard reality of economics and material lack into a world of abundant, shared beauty. You represent the spiritualization of matter; you find the Divine not in the clouds, but in the soil, the touch, and the tangible stability of the natural world. Your soul’s mission is to heal the collective relationship with the Earth, turning the planet back into a sanctuary of peace and sensual delight.",
    reach: "Your psychic reach is deeply sensory and haptic. You feel the subtle vibrations of the environment and can sense the hidden worth or 'spirit' within physical objects. You are uniquely tuned into the collective's relationship with security, and you feel the tremors of the Earth’s own consciousness as if they were your own physical sensations.",
    escape: "You find sanctuary in the profound silence of the natural world—botanical gardens, ancient forests, and the rhythmic, grounding cycles of the seasons. For you, beauty is not a luxury or an ornament; it is a vital spiritual portal. You escape the chaos of the world by surrounding yourself with the high-vibrational frequencies of art, organic textures, and the profound peace of the present moment."
  },
  Gemini: {
    description: "The Etheric Weaver", vision: "Vibrational", depth: "Mental", soul: "Versatile",
    essence: "Neptune in Gemini dissolves the rigid boundaries between different schools of thought, languages, and philosophies. This generation seeks transcendence through the realization that all knowledge is a single, interconnected web of light. It is the dream of a 'Universal Language' or a global telepathy, where communication ceases to be a barrier and becomes a mystical act of bridging disparate realities. You are here to spiritualize the intellect, proving that the 'Word' is the primary tool of creation.",
    reach: "Your psychic sensitivity is tuned to the literal 'airwaves.' You pick up on the collective thought-forms, the unspoken currents of social media, and the hidden nuances behind spoken words. You often find yourself finishing others' thoughts or sensing the truth hiding in the 'white noise' between sentences. You are a natural medium for the collective's mental evolution.",
    escape: "You find sanctuary in the vast, shimmering oceans of literature, abstract poetry, and the digital ether. For you, the mind is not a cage but a gateway to infinite alternate dimensions. You escape the weight of reality by drifting through a kaleidoscope of ideas, finding a strange, airy peace in the realization that there are always a thousand different truths to explore."
  },
  Cancer: {
    description: "The Ancestral Dreamer", vision: "Nurturing", depth: "Oceanic", soul: "Protective",
    essence: "Neptune in Cancer represents a generation that seeks to merge with the collective soul of the family, the tribe, and the land. Here, the dream is one of total, unconditional emotional belonging. It is a mystical connection to the past, where the boundaries of time dissolve into a tidal pool of ancestral memory. Your soul seeks to heal the 'Mother Wound' of the world, dreaming of a reality where every living being is nurtured as if they were part of a single, sacred family lineage.",
    reach: "Your sensitivity is tuned to the frequency of home, heritage, and the 'Womb.' You feel the emotional weight of the spaces you inhabit—sensing the ghosts of history and the unspoken needs of the collective heart. You are a psychic sponge for the moods of your environment, often acting as an unconscious guardian for the vulnerable.",
    escape: "You find sanctuary in nostalgia, the literal sea, and the deep emotional fortress of the domestic sphere. Your dreams are vivid and cinematic, often populated by the archetypal figures of the Great Mother and the protective spirits of your ancestors. You escape by diving deep into the 'inner waters' of your own soul, where the past and the future meet in a warm, protective embrace."
  },
  Leo: {
    description: "The Solar Mystic", vision: "Glorious", depth: "Radiant", soul: "Expressive",
    essence: "Neptune in Leo dreams of the ultimate creative apotheosis. This generation seeks to dissolve the ego not by destroying it, but by inflating it until it encompasses the entire Universe in a grand, dramatic vision of love. It is the dream of a 'New Golden Age,' where the spirit finds its divinity through the heart’s passions, the performing arts, and the radiant power of romance. You are here to prove that 'God is Love' and that the highest form of worship is the authentic expression of one's own inner light.",
    reach: "Your psychic reach is tuned to the frequency of charisma and the collective's desire for a hero. You sense when the world is starving for inspiration and you intuitively know how to channel the 'Divine Spark' into a performance or a piece of art that heals through awe. You feel the heartbeats of others as if they were rhythmic echoes of your own.",
    escape: "You find sanctuary in the theater of the mind, in the intoxicating rush of romance, and in grand, visionary artistic projects. For you, the act of creation is a literal religious experience. You escape the mundane by stepping into your own internal palace, where you are the sovereign of a world made entirely of light, color, and infinite passion."
  },
  Virgo: {
    description: "The Sacred Servant", vision: "Precise", depth: "Atomic", soul: "Diligent",
    essence: "Neptune in Virgo dreams of a perfect, healed, and purified world. This generation seeks to dissolve the chaos of the material world through the alchemy of 'Sacred Order.' You find the Divine in the smallest details—the cellular structure of a plant, the precision of a watch, the act of sweeping a floor. It is the dream of the 'Body as a Temple,' where spirituality is not an abstract concept but a practical, daily devotion to the health and functionality of the entire system.",
    reach: "Your sensitivity is tuned to the frequency of the 'broken,' the 'unbalanced,' and the 'diseased.' You have a psychic ability to sense the subtle ailments of the collective and the hidden ways that nature can be restored to its original blueprint. You intuitively understand the link between the spirit and the micro-biological world.",
    escape: "You find sanctuary in the meditative rhythm of work, the quiet precision of craft, and the healing arts. For you, peace is found when every detail of your environment is aligned with the cosmic whole. You escape by 'cleaning' the world—finding a Zen-like state in organization, herbalism, and the quiet, humble satisfaction of being a useful part of the machine."
  },
  Libra: {
    description: "The Harmonious Veil", vision: "Idealistic", depth: "Relational", soul: "Diplomatic",
    essence: "Neptune in Libra dreams of the perfect, soul-merging union. This generation seeks to dissolve the boundaries between 'I' and 'Thou' through radical peace, aesthetic harmony, and the ideal of the 'Twin Flame.' It is the dream of a world where justice is synonymous with beauty and every social contract is a spiritual vow. You are the alchemist of the 'Mirror,' seeking to find the face of the Divine in the eyes of the partner and the grace of the social circle.",
    reach: "Your psychic reach is tuned to the frequency of social dynamics and the 'Balance of Power.' You sense the slightest undercurrent of discord in a room before a single word is spoken. You have a natural, almost mediumistic ability to mirror the soul of the person standing in front of you, making them feel as though you are a reflection of their own highest self.",
    escape: "You find sanctuary in high art, classical music, and the idealistic, rose-colored image of the 'Other.' For you, the search for the soulmate is not a romantic pursuit but a holy pilgrimage. You escape the harshness of reality by retreating into a world of perfect symmetry, refined manners, and the intoxicating perfume of an idealized relationship."
  },
  Scorpio: {
    description: "The Occult Voyager", vision: "Penetrating", depth: "Bottomless", soul: "Transmutative",
    essence: "Neptune in Scorpio represents a generation that seeks to dissolve the boundaries between Life and Death. This is the dream of total, cellular transformation through the exploration of the taboo, the hidden, and the 'Shadow.' You are here to spiritualize the dark, proving that the most profound light is found in the deepest abyss. It is a mystical descent into the underworld—an alchemical process of turning the lead of human suffering into the gold of psychic power.",
    reach: "Your psychic sensitivity is tuned to the frequency of power, secrets, and the subterranean shifts in the collective psyche. You sense the truth that lies beneath the surface of 'polite' society, often picking up on the sexual or psychological undercurrents that others are too afraid to acknowledge. You are a natural-born investigator of the soul.",
    escape: "You find sanctuary in deep psychological work, the occult, and the intense experiences of 'Ego Death.' You don't want a shallow peace; you want the peace that comes after a total purge. You escape by diving into the mysteries—researching the unknown, exploring the depths of intimacy, and finding a strange comfort in the silence of the void."
  },
  Sagittarius: {
    description: "The Cosmic Nomad", vision: "Expansive", depth: "Limitless", soul: "Philosophical",
    essence: "Neptune in Sagittarius dreams of a single, Universal Truth that transcends all borders and dogmas. This generation seeks to dissolve the boundaries of geography, race, and religion into a grand, global spirituality. It is the dream of the 'Infinite Journey,' where the spirit finds God in the foreign, the philosophical, and the far-reaching horizon. You are the architect of the 'New Faith,' dreaming of a world where the only temple is the open sky and the only scripture is the experience of the traveler.",
    reach: "Your psychic reach is tuned to the frequency of prophecy and the 'Big Picture.' You sense the direction in which the human spirit is evolving, often having flashes of insight about the future of the collective. You intuitively understand the 'Universal Law' that governs the chaos of the world, allowing you to remain optimistic even in the face of disaster.",
    escape: "You find sanctuary in the act of 'Going.' Whether through physical travel, high-level philosophy, or the vast, open spaces of the wilderness, you escape by expanding. For you, the search for meaning is a holy pilgrimage that never ends; you find your peace in the realization that the horizon is always moving and the journey itself is the destination."
  },
  Capricorn: {
    description: "The Structural Mystic", vision: "Disciplined", depth: "Crystalline", soul: "Responsible",
    essence: "Neptune in Capricorn represents the spiritualization of the 'System.' This generation dreams of a society where integrity, spirit, and reality are one and the same. You seek to dissolve the cold, heartless walls of old institutions and rebuild them as crystalline structures of light. It is the dream of the 'City on a Hill'—a reality where the material world is seen as a direct, responsible reflection of the spiritual vibration of its people. You are the mystic who builds for the next thousand years.",
    reach: "Your sensitivity is tuned to the frequency of time, history, and the 'Bones of the World.' You sense the spiritual decay in old governments and corporations before they collapse, and you intuitively feel the architecture of the 'New World' that must replace them. You have a psychic respect for the elders and the ancient wisdom of the earth.",
    escape: "You find sanctuary in the mountains, in absolute silence, and in the mastery of a difficult, long-term goal. For you, transcendence is found through the discipline of the spirit—the slow, steady climb toward excellence. You escape the chaos of the world by retreating into your own productivity and the solid, reliable reality of things that endure."
  },
  Aquarius: {
    description: "The Techno-Visionary", vision: "Electric", depth: "Networked", soul: "Humanitarian",
    essence: "Neptune in Aquarius dreams of the collective awakening—the 'Age of Enlightenment.' This generation seeks to dissolve the boundaries of the individual ego into the power of the Group and the digital ether. It is the dream of the 'Global Brain,' where technology and spirit merge to create a decentralized, utopian humanity. You are the architect of the 'New We,' dreaming of a world where hierarchy is replaced by the network and every human mind is a node in a single, brilliant circuit of light.",
    reach: "Your psychic reach is tuned to the frequency of the 'Future' and the 'Inter-connective Web.' You sense the trends of the collective mind and pick up on the revolutionary ideas floating in the cultural 'Cloud' before they are ever typed or spoken. You are a natural lightning rod for the flashes of genius that will define the next century.",
    escape: "You find sanctuary in the 'Fringe'—in science fiction, radical social movements, and the collaborative spaces of the internet. You escape the weight of the past by looking forward, finding a strange, electric peace in the company of the 'misfits' and the rebels who are building the world to come."
  },
  Pisces: {
    description: "The Infinite Empath", vision: "Dissolving", depth: "Bottomless", soul: "Universal",
    essence: "Neptune is at home in Pisces, operating at its most potent and oceanic level. Here, the dream is the total, absolute dissolution of the separate self into the Oneness of the Universe. This generation seeks the 'Great Return'—the realization that we are all drops of water in a single, infinite sea. It is the dream of pure, unadulterated compassion, where the boundaries between reality and the Divine completely disappear. You are the anchor for the collective's transition into a higher state of consciousness.",
    reach: "Your psychic reach is literally boundless. You sense the suffering and the joy of the entire world simultaneously, acting as a spiritual sponge for the collective unconscious. You are tuned to the highest frequency of Universal Love, often finding it difficult to distinguish your own feelings from the emotional tides of the ocean of humanity surrounding you.",
    escape: "You find sanctuary in the arts, in deep meditation, and in the vast, silent oceans of your own internal mind. For you, there is no 'escape' because there is no 'outside'—everything is part of the Divine Flow. You find your peace by letting go of the shore entirely and allowing the waves of the Universe to carry you wherever they will."
  }
};

const getNeptuneDescription = (s) => neptuneData[s]?.description || "The Celestial Profile";
const getNeptuneVision = (s) => neptuneData[s]?.vision || "Dreamy";
const getNeptuneDepth = (s) => neptuneData[s]?.depth || "Infinite";
const getNeptuneSoul = (s) => neptuneData[s]?.soul || "Fluid";
const getNeptuneEssence = (s) => neptuneData[s]?.essence || "Your connection to the divine and the subconscious.";
const getNeptuneReach = (s) => neptuneData[s]?.reach || "How you sense the unseen world.";
const getNeptuneEscape = (s) => neptuneData[s]?.escape || "Where your spirit finds rest and inspiration.";

export default Neptune;