import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Gem, ArrowLeft, Skull, Flame, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Pluto = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Scorpio';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [plutoSign, setPlutoSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  // Logic to fetch user's natal Pluto if no sign is in URL
  useEffect(() => {
    const fetchPlutoSign = async () => {
      if (signName) {
        setPlutoSign(normalizeSign(signName));
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
        const planetInfo = planetaryData?.find(p => p.name === 'Pluto');
        
        if (planetInfo?.sign) {
          setPlutoSign(normalizeSign(planetInfo.sign));
        }
      } catch (err) {
        console.error('Failed to fetch Pluto sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlutoSign();
  }, [user, signName]);

  // Background Ember Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let embers = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initEmbers();
    };

    class Ember {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.005 + 0.002;
      }
      draw() {
        ctx.fillStyle = `rgba(127, 29, 29, ${this.opacity})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 0.8 || this.opacity < 0.1) this.speed = -this.speed;
      }
    }

    const initEmbers = () => {
      embers = [];
      const count = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < count; i++) embers.push(new Ember());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((e) => { e.update(); e.draw(); });
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
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-red-900/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-orange-700 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-[#7f1d1d] via-[#f59e0b] to-[#4b5563] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(127,29,29,0.5)]">
            ♇
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Pluto in ${plutoSign}`}
            </h1>
            <p className="text-orange-700/60 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Alchemist: ${getPlutoDescription(plutoSign)}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Power" value={getPlutoPower(plutoSign)} color="text-orange-600" />
              <MetaItem label="Shift" value={getPlutoShift(plutoSign)} color="text-orange-600" />
              <MetaItem label="Core" value={getPlutoCore(plutoSign)} color="text-orange-600" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-red-900/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-orange-200 mb-4 flex items-center gap-3">
                  <RefreshCw className="text-orange-600" /> The Phoenix Rising
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {getPlutoEssence(plutoSign)}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={Flame} title="Internal Combustion" text={getPlutoCombustion(plutoSign)} color="text-orange-700" />
              <ContentSection Icon={Skull} title="Total Rebirth" text={getPlutoRebirth(plutoSign)} color="text-slate-400" />
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
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-red-900/10 border border-red-900 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

const plutoData = {
  Aries: {
    description: "The Primal Disruptor", power: "Violent", shift: "Instant", core: "Raw",
    essence: "Pluto in Aries (last seen 1823–1851) represents the absolute destruction of the old self to make way for the ultimate pioneer. This is a generation of atomic-level self-will, where the soul finds its power by standing completely alone in a landscape it has scorched clean of competitors. There is no room for tradition here; only the raw, white-hot spark of new beginnings.",
    combustion: "Your internal drive is a volcanic eruption. You do not simmer or wait for permission; you explode into being. Your power comes from the courage to face existential conflict directly, using the heat of your own survival instinct to forge an identity that answers to no one and nothing but the present moment.",
    rebirth: "Total rebirth occurs through the annihilation of hesitation. You rise from the ashes not as a polished version of your past self, but as a singular force of nature. You find liberation by burning away every attachment to the past until only the unyielding strength of your 'I AM' remains."
  },
  Taurus: {
    description: "The Material Transformer", power: "Solid", shift: "Tectonic", core: "Wealth",
    essence: "Pluto in Taurus (last seen 1852–1884) revolutionizes the very concept of value and the physical earth. This placement represents the alchemical process of turning lead into gold through sheer persistence. It is the mastery of matter, where power is grown from the deep roots of the soil and the transformation of the global economy through the weight of physical reality.",
    combustion: "Your drive is slow, heavy, and inescapable. Like the movement of tectonic plates, you build pressure beneath the surface until the entire landscape of your life must shift to accommodate your growth. You process power through the radical transformation of security and the grit required to build something eternal.",
    rebirth: "You rise by letting go of the need to possess. Your true power is found when you realize that stability is not found in what you own, but in your ability to survive the total loss of everything tangible. You are reborn as the master of value, knowing that your worth is an internal, indestructible asset."
  },
  Gemini: {
    description: "The Information Overlord", power: "Cerebral", shift: "Vibrational", core: "Data",
    essence: "Pluto in Gemini (last seen 1884–1914) marks the death of the singular truth. This is the generation that dismantled old ways of thinking and replaced them with the rapid-fire exchange of hidden knowledge. It is the alchemist of the word, finding power in the manipulation of ideas, language, and the unseen threads that connect all information.",
    combustion: "Your drive is a high-frequency vibration. You process power through the lens of intelligence and the ability to out-think your environment. You do not fear the complexity of a dual nature; you use your 'twin' selves as a weapon to navigate multiple realities at once, burning through secrets with the light of pure logic.",
    rebirth: "Rebirth is a mental evolution. You shed old ideologies like a dry skin, finding power in the realization that reality is a construct built of language. You rise when you stop being a consumer of information and start becoming the architect of the narrative, controlling the very airwaves of your own consciousness."
  },
  Cancer: {
    description: "The Ancestral Phoenix", power: "Genetic", shift: "Tidal", core: "Lineage",
    essence: "Pluto in Cancer (1914–1939) represents the profound transformation of the home, the nation, and the DNA itself. This generation was born to dredge up ancestral secrets and heal the collective lineage. Power here is found in the protection of the tribe and the deep, often painful process of nurturing a new world out of the wreckage of the old.",
    combustion: "Your drive is a subterranean tide. You are fueled by a fierce, protective instinct that will burn down the world to save the 'nest.' You find fuel in the emotional deep, where the past and future meet, using your vulnerability as a sensor for the hidden dangers lurking in the shadows of the family tree.",
    rebirth: "Rebirth occurs through the healing of inherited trauma. By facing the ghosts of your ancestors, you transform the vulnerability of 'belonging' into an impenetrable fortress of emotional sovereignty. You rise as the keeper of the gate, knowing that true safety comes from a heart that has survived its own breaking."
  },
  Leo: {
    description: "The Sovereign Catalyst", power: "Egoic", shift: "Dramatic", core: "Genius",
    essence: "Pluto in Leo (1939–1958) is the generation of the 'Atomic Ego.' It represents a profound shift in how the individual expresses authority through creative genius. This is the power of the Sun turned inward, a solar flare of self-expression that demands to be seen, recognized, and followed as a source of life-giving power.",
    combustion: "Your drive is a radiant, sometimes overwhelming need to be the center of your own universe. You possess an indestructible selfhood that feeds on the drama of creation. You find fuel in the act of performance, using your personal charisma to command the attention of the collective and transform the very concept of leadership.",
    rebirth: "Total rebirth involves the death of the ego for the sake of the spirit. You find your absolute power when you stop performing for the applause of the world and start radiating your truth as a service. You rise when your personal 'royalty' is no longer a mask, but a natural state of being."
  },
  Virgo: {
    description: "The Systemic Healer", power: "Holistic", shift: "Molecular", core: "Purification",
    essence: "Pluto in Virgo (1958–1971) revolutionizes work, health, and the micro-details of existence. This is the generation of the systemic hacker, finding power in the perfection of the mechanism and the clinical destruction of inefficiency. You are the alchemist of the mundane, transforming the world through the precision of your service.",
    combustion: "Your drive is a cold, focused laser. You process power through analysis and the ruthless removal of anything that is 'broken.' You find strength in the mastery of your own body and the ethics of labor, building pressure through the constant refinement of your own internal systems.",
    rebirth: "Rebirth occurs through the purification of the self. By letting go of the paralyzing need for perfect control, you tap into a molecular level of healing. You rise when you realize that your power lies not in being 'perfect,' but in being an essential, functional part of the cosmic machine."
  },
  Libra: {
    description: "The Relational Destroyer", power: "Social", shift: "Balanced", core: "Justice",
    essence: "Pluto in Libra (1971–1984) marks the total transformation of relationships and social contracts. This generation was born to destroy the masks we wear to keep the peace. Power is found in the 'Other,' and in the radical evolution of how two souls interact. You are here to build a new justice based on the ashes of old compromise.",
    combustion: "Your drive is a diplomatic storm. You process power through the mirrors of your partnerships, seeking the absolute truth beneath the surface of 'harmony.' You do not fear the end of a union if it leads to a higher truth, using your relationships as the primary crucible for your own evolution.",
    rebirth: "Total rebirth involves the evolution of equality. You find power when you stop compromising your soul for the sake of 'we' and start building connections based on radical honesty. You rise as a master of balance, knowing that true peace is only possible when the shadow of the relationship is fully integrated."
  },
  Scorpio: {
    description: "The Sovereign Shadow", power: "Absolute", shift: "Visceral", core: "Unyielding",
    essence: "Pluto is at home in Scorpio (1984–1995), operating at its most lethal and transformative frequency. You are the generation of the Phoenix, born to face the taboos of sex, death, and power without blinking. You are the masters of the shadow, turning the darkest parts of the human experience into the fuel for your own ascent.",
    combustion: "Your internal drive is a subterranean pressure. You possess a visceral intensity that others can feel but rarely describe. You find power in the 'all or nothing,' preferring the total burn of truth to the safety of a lie. You use your psychic depth to navigate the world's hidden currents like a predator in the deep.",
    rebirth: "Rebirth is your natural state. You find absolute power in your ability to 'die' a thousand deaths in one lifetime, emerging each time with a more piercing gaze. You rise from the ashes not just restored, but evolved—a version of yourself that is armored by its own vulnerability."
  },
  Sagittarius: {
    description: "The Truth Hunter", power: "Expansive", shift: "Philosophical", core: "Global",
    essence: "Pluto in Sagittarius (1995–2008) transforms the landscape of faith and the global horizon. You are part of a generation born to burn down dogmas and cleanse religion and law of their hypocrisy. Your power is found in the destruction of mental borders and the quest for a space-age truth that transcends history.",
    combustion: "Your drive is an unquenchable fire. You are fueled by the need to explore the furthest reaches of the human experience. You process power through intellectual nomadism, constantly expanding your boundaries until the cage of your previous identity simply ceases to exist under the heat of your curiosity.",
    rebirth: "Rebirth occurs through the discovery of a universal law. You shed old belief systems like obsolete maps, finding power in the realization that the journey into the unknown is the only true destination. You rise as a global citizen, tethered only to the truth."
  },
  Capricorn: {
    description: "The Institutional Hacker", power: "Structural", shift: "Tectonic", core: "Legacy",
    essence: "Pluto in Capricorn (2008–2024) represents the clinical dismantling of the world's bones—government, finance, and corporate power. You find strength in the mastery of the mountain and the patience of the architect, rebuilding the world's foundations on the ruins of systems that were too rigid to survive.",
    combustion: "Your drive is a slow-motion tectonic shift. You do not seek temporary status; you seek a legacy that can withstand the test of time. You find fuel in the responsibility of leadership and the clinical dismantling of the obsolete, building your power through endurance and tactical integrity.",
    rebirth: "Total rebirth involves the transformation of authority. You find your true power when you realize that authority is not something granted by a title, but something grown through the integrity of your own hard-won survival. You rise as the sovereign of your own destiny, built on a foundation that can never be shaken."
  },
  Aquarius: {
    description: "The Network Alchemist", power: "Electric", shift: "Collective", core: "Evolutionary",
    essence: "Pluto in Aquarius (2024–2044) marks the transformation of the collective, technology, and the very concept of humanity. Power is found in the decentralized network and the liberation of the mind. You are the architect of a future that has no center, where the power of the circuit replaces the power of the king.",
    combustion: "Your drive is a high-frequency vibration. You process power through the group and the radical innovation that breaks the status quo. You find fuel in the 'weird' and the fringe, using the power of the network to shock the system into its next evolutionary state, acting as a lightning rod for the future.",
    rebirth: "Rebirth is a collective experience. You find power when you stop trying to be the hero and start being the circuit—realizing that true transformation is a collaborative event. You rise when you liberate your mind from the social architecture of the past, becoming a beacon of evolutionary freedom."
  },
  Pisces: {
    description: "The Spiritual Empath", power: "Infinite", shift: "Dissolving", core: "Sacrifice",
    essence: "Pluto in Pisces (last seen 1797–1823) represents the total dissolution of the material world for the sake of the spirit. Power is found in the invisible, the mystical, and the ability to surrender to the cosmic flow. It is the end of the ego's reign, where the soul must face the vast ocean of the collective unconscious.",
    combustion: "Your drive is a nebulous, oceanic force. You do not fight power; you dissolve it. You find fuel in the spiritual depths, using the power of empathy and art to transmute the suffering of the world into divine light. You process power through the act of surrender, letting the waves of change wash away all that is not eternal.",
    rebirth: "Total rebirth is the ultimate surrender. You find absolute power in the realization that you are not the drop, but the entire ocean. You rise from the 'dark night of the soul' with a heart that encompasses all things, knowing that death is merely the final transformation into pure consciousness."
  }
};

const getPlutoDescription = (s) => plutoData[s]?.description || "The Deep Transformer";
const getPlutoPower = (s) => plutoData[s]?.power || "Atomic";
const getPlutoShift = (s) => plutoData[s]?.shift || "Profound";
const getPlutoCore = (s) => plutoData[s]?.core || "Untouched";
const getPlutoEssence = (s) => plutoData[s]?.essence || "Your path of transformation and power.";
const getPlutoCombustion = (s) => plutoData[s]?.combustion || "You possess a volcanic drive fueled by your core intensity.";
const getPlutoRebirth = (s) => plutoData[s]?.rebirth || "By letting go of control, you tap into a source of power that is generational.";

export default Pluto;