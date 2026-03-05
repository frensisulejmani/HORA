import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, ArrowLeft, Lightbulb, Share, Radio } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Uranus = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Aquarius';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [uranusSign, setUranusSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  const getSymbol = (sign) => {
    const symbols = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
      Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
      Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return symbols[sign] || '♅';
  };

  useEffect(() => {
    const fetchUranusSign = async () => {
      if (signName) {
        setUranusSign(normalizeSign(signName));
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
        const planetInfo = planetaryData?.find(p => p.name === 'Uranus');
        
        if (planetInfo?.sign) {
          setUranusSign(normalizeSign(planetInfo.sign));
        }
      } catch (err) {
        console.error('Failed to fetch Uranus sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUranusSign();
  }, [user, signName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`; // Cyan tinted stars
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
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-cyan-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        <Link to="/natal" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architechture
        </Link>

        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-cyan-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
           ♅
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
               {loading ? 'Loading...' : `Uranus in ${uranusSign}`}
            </h1>
            <p className="text-cyan-400/60 italic text-lg mb-6">
               {loading ? 'Calculating...' : `The Awakener: ${getUranusDescription(uranusSign)}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Change" value={getUranusChange(uranusSign)} color="text-cyan-400" />
              <MetaItem label="Idea" value={getUranusIdea(uranusSign)} color="text-cyan-400" />
              <MetaItem label="Spirit" value={getUranusSpirit(uranusSign)} color="text-cyan-400" />
            </div>
          </div>
        </section>

        {!loading && (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-[30px] p-8 md:p-12 mb-8 shadow-2xl">
              <h2 className="text-3xl font-semibold text-cyan-100 mb-4 flex items-center gap-3">
                  <Lightbulb className="text-cyan-400" /> The Electric Soul
              </h2>
              <p className="text-lg leading-relaxed text-slate-300 font-light">
                {getUranusEssence(uranusSign)}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
              <ContentSection Icon={Radio} title="Individualism" text={getUranusIndividualism(uranusSign)} color="text-cyan-400" />
              <ContentSection Icon={Share} title="Social Change" text={getUranusSocial(uranusSign)} color="text-blue-400" />
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
    <div className={`mx-auto md:mx-0 w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center ${color} shadow-lg`}>
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

// Data for Uranus
const uranusData = {
  Aries: {
    description: "The Revolutionary Catalyst", change: "Explosive", idea: "Impulsive", spirit: "Warrior",
    essence: "Uranus in Aries marks a generation of fierce, uncompromising independence. You are the architect of the sudden breakthrough, driven by a primal, electric need to smash through both personal and systemic barriers. You don’t just invite change; you ignite it, acting as a cosmic lightning rod that strikes the status quo to reveal the raw potential hidden beneath layers of stagnation.",
    individualism: "You express freedom through radical self-assertion and the courage to be the 'first.' You refuse to wait for consensus or permission, carving out entirely new archetypes of identity through sheer force of will. Your liberation is found in the heat of the moment, where your pioneer’s spirit rejects any form of limitation on your personal autonomy.",
    social: "You catalyze progress by inciting direct, often jarring action and challenging the very concept of authority. Your presence acts as a high-frequency spark that ignites the fire of rebellion in others, pushing the collective toward a future where individual courage is the primary engine of societal evolution."
  },
  Taurus: {
    description: "The Earth Shaker", change: "Structural", idea: "Concrete", spirit: "Persistent",
    essence: "Uranus in Taurus revolutionizes the tangible world and the very frequency of the Earth. This generation awakens through a total overhaul of financial systems, environmental values, and the ancient concepts of security. You are here to decouple the human spirit from the fossilized greed of the past, teaching the collective that true stability is found in internal frequency rather than external hoarding.",
    individualism: "You find freedom by radically detaching from traditional concepts of ownership and material entrapment. You express your uniqueness through unconventional ways of sustaining the body and the planet, often leading the charge in decentralized finance, self-sufficiency, and the digital transformation of physical assets.",
    social: "You break down the structures of environmental exploitation and rigid economic hierarchies. You lead the collective toward a future that is technologically integrated yet biologically respectful, proving that the most radical revolution can be one that returns us to a high-tech relationship with nature."
  },
  Gemini: {
    description: "The Cognitive Disruptor", change: "Fluid", idea: "Brilliant", spirit: "Versatile",
    essence: "Uranus in Gemini electrifies the collective mind and the architecture of communication. You are part of a cycle that redefines learning, language, and the exchange of data through sudden, erratic flashes of insight. You don't just process information; you reorganize it into entirely new neural pathways that bypass the slow, linear logic of previous generations.",
    individualism: "You express your freedom through a kaleidoscopic intellect that refuses to be anchored to a single ideology. You find liberation in the constant flux of information, viewing your mind as a high-speed processor capable of holding contradictory truths simultaneously without the need for traditional resolution.",
    social: "You catalyze progress by disrupting the gatekeepers of media and education. You break down silos of information, ensuring that radical, liberating ideas circulate with lightning speed. Your role is to weave the digital and intellectual threads of the future into a decentralized web of total transparency."
  },
  Cancer: {
    description: "The Domestic Rebel", change: "Emotional", idea: "Nurturing", spirit: "Protective",
    essence: "Uranus in Cancer shakes the foundations of ancestry, heritage, and the domestic sphere. You are here to liberate the collective from suffocating traditionalism and the heavy 'ghosts' of the past. Your generation redefines what it means to belong, shifting the concept of 'home' from a physical location to a shared emotional frequency.",
    individualism: "You find freedom by creating 'chosen' families and tribe-based structures that transcend bloodlines. Your independence is rooted in your refusal to let ancestral trauma, outdated patriotic ideals, or domestic expectations define your safety. You are a pioneer of emotional autonomy.",
    social: "You catalyze progress by revolutionizing the way we care for one another. You break down the walls of the traditional nuclear family to build inclusive, technologically supported communities where the nurturing instinct is applied to the global village rather than just the private home."
  },
  Leo: {
    description: "The Creative Iconoclast", change: "Dramatic", idea: "Radiant", spirit: "Noble",
    essence: "Uranus in Leo electrifies the heart and the egoic expression of the soul. This is a generation of radical self-expression, breaking the rules of art, romance, and leadership with theatrical, high-voltage intensity. You are here to prove that the individual heart is the ultimate source of revolution, and that joy is the most rebellious act of all.",
    individualism: "You express freedom through the unapologetic display of your unique genius and creative fire. You are a pioneer of the self, refusing to let the grey, conformist demands of the collective dampen your inner sun. Your liberation is found in the spotlight of your own authenticity.",
    social: "You catalyze progress by dismantling the archaic 'cult of personality' and replacing it with the empowerment of the many. You show the collective that leadership isn't about power over others, but about the noble radiation of one’s own truth, inspiring everyone to become the monarch of their own life."
  },
  Virgo: {
    description: "The Technical Innovator", change: "Systemic", idea: "Analytical", spirit: "Efficient",
    essence: "Uranus in Virgo revolutionizes the concept of work, health, and service through the lens of high technology. You are part of a cycle that seeks to automate the mundane and the repetitive, not to replace humans, but to liberate our potential for higher analytical and creative pursuits. You find the 'ghost in the machine' and optimize it for the benefit of all.",
    individualism: "You find freedom through technical mastery and absolute holistic autonomy. You express your uniqueness through your radical approach to bio-hacking, wellness, and the refinement of systems. To you, a liberated life is one that is perfectly tuned and free from the friction of inefficiency.",
    social: "You catalyze progress by breaking down bloated, inefficient bureaucracies and toxic work cultures. You lead the collective toward a future where technology serves the biological body and the ecosystem with surgical, high-frequency precision, making service an act of genius rather than a chore."
  },
  Libra: {
    description: "The Relational Architect", change: "Harmonious", idea: "Fair", spirit: "Diplomatic",
    essence: "Uranus in Libra shakes up the dynamics of 'the other' and the mirrors we use to see ourselves. This generation redefines marriage, legal contracts, and social justice through an electric need for radical equality. You are the architect of a new social contract, one that prioritizes individual freedom within the context of a balanced union.",
    individualism: "You express freedom through unconventional partnerships and fluid social identities. You refuse to follow the dusty scripts of traditional relating, finding liberation in the electric balance between intense connection and absolute personal independence.",
    social: "You catalyze progress by dismantling unjust laws and rigid social hierarchies. You break down the structures of inequality to reveal a higher, more electric version of justice—one that doesn't just seek 'peace,' but seeks a dynamic, evolving harmony based on total transparency."
  },
  Scorpio: {
    description: "The Alchemical Phoenix", change: "Subterranean", idea: "Profound", spirit: "Intense",
    essence: "Uranus is exalted in Scorpio, producing a generation of profound, tectonic transformation. You awaken the world through the sudden, clinical destruction of secrets, taboos, and hidden power structures. You are the deep-sea diver of the zodiac, using the lightning of Uranus to illuminate the darkest corners of the human psyche.",
    individualism: "You find freedom in the depths. Your independence is forged in the fires of psychological death and rebirth, detaching from the paralyzing fear of loss to find an absolute, unshakable power within. Your liberation is found in your ability to survive the impossible.",
    social: "You catalyze progress by exposing the rotten, hidden cores of society. You break down the structures of secret control and financial manipulation, leading the collective through the necessary crisis of evolution to ensure that what rises from the ashes is honest and indestructible."
  },
  Sagittarius: {
    description: "The Philosophical Voyager", change: "Expansive", idea: "Visionary", spirit: "Global",
    essence: "Uranus in Sagittarius electrifies faith, higher education, and the boundaries of the known world. You are part of a cycle that shatters religious dogmas and redefines the limits of human expansion. You don't just seek the truth; you seek the 'upgrade' to truth, viewing philosophy as a code that must be constantly rewritten for a space-age consciousness.",
    individualism: "You express freedom through intellectual and physical nomadism. You refuse to be bound by a single country, creed, or academic box, finding your liberation in the vast, electric landscape of the unknown and the borderless exchange of radical ideas.",
    social: "You catalyze progress by dismantling xenophobia and closed-minded ideologies. You lead the collective toward a global, technologically integrated understanding of universal law, proving that the further we travel from our origins, the closer we get to the cosmic truth."
  },
  Capricorn: {
    description: "The Structural Genius", change: "Tectonic", idea: "Strategic", spirit: "Ambitious",
    essence: "Uranus in Capricorn revolutionizes the very bones of civilization. You are here to bring lightning-fast innovation to the most fossilized institutions of government, corporate power, and tradition. You are the 'hacker' of the establishment, using your genius to build structures that are both ancient in integrity and futuristic in function.",
    individualism: "You find freedom through the creation of new authorities and self-made hierarchies. You express your uniqueness by climbing the mountain of success in ways that completely bypass the old guard, proving that true power comes from innovation rather than inheritance.",
    social: "You catalyze progress by forcing the collapse of structures that have become too rigid to breathe. You build the digital and physical foundations of the future on the ruins of the obsolete past, ensuring that the new world is built for efficiency, transparency, and longevity."
  },
  Aquarius: {
    description: "The Cosmic Humanitarian", change: "Sudden", idea: "Radical", spirit: "Rebellious",
    essence: "Uranus is home in Aquarius, operating at its peak frequency. You are the primary architect of the future, driven by a higher genius that prioritizes the total liberation of mankind. You are a creature of the networks, seeing the world as a giant circuit that must be rewired for maximum freedom, equality, and technological enlightenment.",
    individualism: "You express freedom through being a true 'citizen of the universe.' You are the ultimate pioneer of the unconventional, finding your tribe among the misfits, the scientists, and the visionaries. Your liberation is found in your refusal to be anything other than an original anomaly.",
    social: "You catalyze progress by creating decentralized, horizontal networks of power. You break down the walls of tribalism and outdated hierarchy, ensuring that the light of truth and the power of technology are shared equally by the collective without the need for middlemen."
  },
  Pisces: {
    description: "The Mystic Visionary", change: "Ethereal", idea: "Dreamy", spirit: "Compassionate",
    essence: "Uranus in Pisces electrifies the collective subconscious and the spiritual currents of the universe. This is a generation that awakens through the sudden dissolution of boundaries and the rise of a new, digital mysticism. You are here to bridge the gap between the ghost in the machine and the soul in the body.",
    individualism: "You find freedom in the infinite. Your independence is expressed through your refusal to be anchored to the heavy, material world, finding liberation in the electric flow of dreams, art, and the universal field of consciousness. You are the pioneer of the inner space.",
    social: "You catalyze progress by breaking down the walls of separation between 'us' and 'them.' You lead the collective toward a future where empathy is enhanced by technology, healing the psychic wounds of the past through a radical, high-vibe compassion that recognizes our fundamental unity."
  }
};

const getUranusDescription = (s) => uranusData[s]?.description || "The Celestial Profile";
const getUranusChange = (s) => uranusData[s]?.change || "Sudden";
const getUranusIdea = (s) => uranusData[s]?.idea || "Radical";
const getUranusSpirit = (s) => uranusData[s]?.spirit || "Rebellious";
const getUranusEssence = (s) => uranusData[s]?.essence || "Your drive for liberation and innovation.";
const getUranusIndividualism = (s) => uranusData[s]?.individualism || "How you express your unique freedom.";
const getUranusSocial = (s) => uranusData[s]?.social || "How you catalyze change in the collective.";

export default Uranus;