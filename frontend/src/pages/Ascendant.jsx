import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, UserCheck, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const ascendantData = {
  Aries: {
    impression: "You project an aura of raw, pioneering vitality that is almost impossible to ignore. People perceive you as a kinetic force—someone who meets life head-on with a sharp, alert presence. You often give off a competitive edge and a brave spirit before you even speak, signaling to the world that you are a person of action rather than deliberation.",
    traits: ['Dynamic', 'Assertive', 'Brave'],
    social: "You enter social spheres with a 'first-responder' energy, instinctively taking the lead when environments become stagnant. You possess a transparent, high-speed approach to social interaction; people always know where they stand with you because you lack a 'hidden' agenda.",
    lesson: "To learn that true strength lies in conscious vulnerability and patience, rather than relying solely on the power of the initial strike.",
    style: "Action-Oriented Minimalism. Your aesthetic is defined by velocity and sharp edges. You gravitate toward high-performance fabrics, sleek leathers, and 'combat-ready' silhouettes that allow for total freedom of movement. You look best in bold, saturated primaries—specifically Mars-red, charcoal, and optic white. Your style isn't about decoration; it's about the power of the strike. Think tailored blazers with sharp shoulders or high-end technical streetwear."  },
  Taurus: {
    impression: "You project an immense, grounding calm that acts as a stabilizer for the room. Others perceive you as reliable, unshakeable, and deeply rooted. There is a silent strength to your presence that suggests you cannot be rushed, pushed, or intimidated into a path that doesn't feel naturally aligned with your pace.",
    traits: ['Grounded', 'Steadfast', 'Sensual'],
    social: "Your social mask is one of profound sensory observation. You act as a gravitational anchor for more scattered energies, often being the one people turn to when they need a sense of permanence or practical wisdom.",
    lesson: "To realize that your worth is an intrinsic internal frequency and does not depend on the accumulation of external material stability or 'sameness'.",
    style: "Quiet Luxury & Earthbound Sensuality. You are the master of 'touch-me' fabrics. Your wardrobe is built on the foundation of organic textures: heavy silks, high-thread-count cottons, and buttery suedes. You prefer a timeless, curated aesthetic over passing trends, sticking to a palette of moss greens, copper, and rich creams. Your silhouette is often structured but soft, emphasizing quality over quantity and a sense of permanent, unshakeable value."  },
  Gemini: {
    impression: "You radiate a restless, electric intelligence and a sparkling, multi-faceted wit. To others, you appear perpetually youthful, approachable, and mentally agile—the 'forever student' of the zodiac. You give the impression that your mind is working at twice the speed of the average person.",
    traits: ['Agile', 'Curious', 'Expressive'],
    social: "You function as the 'Social Messenger,' the vital connective tissue between disparate groups of people. You move through crowds with a light, airy touch, bridging gaps through shared information and interesting questions.",
    lesson: "To bridge the gap between scattered curiosity and the pursuit of a singular, profound Truth that transcends mere facts.",
    style: "Kinetic & Multi-Faceted Expression. Your style is a language that changes as fast as your mind. You excel at 'mix-and-match' fashion—pairing high-end labels with thrifted finds. You gravitate toward light, breathable fabrics and patterns that create visual movement, like stripes or geometric prints. Your color palette is electric and airy: bright yellows, silver, and sky blue. You love accessories that spark conversation, from statement eyewear to rings that catch the light when you gesture."  },
  Cancer: {
    impression: "You project an aura of gentle sensitivity and protective warmth that feels like a psychic balm. You appear approachable yet intuitively guarded, as if you are constantly sensing the emotional temperature of the room before fully stepping into the light. People feel a sense of 'home' in your presence.",
    traits: ['Nurturing', 'Intuitive', 'Protective'],
    social: "Your social mask is a protective, nurturing shell. You prioritize emotional safety and deep, ancestral-feeling connections, often acting as the unofficial 'caretaker' or emotional compass of your social circle.",
    lesson: "To learn the art of emotional boundaries—protecting your sensitive heart without building impossible walls that keep genuine love at a distance.",
    style: "Luminous & Protective Chic. Your wardrobe acts as a soft sanctuary. You are drawn to enveloping silhouettes—oversized knits, flowing midi-skirts, and layers that feel like a hug. You look best in 'Lunar' materials: satins that catch the light, iridescent finishes, and soft wools. Your palette consists of shimmering silvers, sea-foam greens, and pearlescent whites. You often incorporate vintage jewelry or heirloom pieces that carry a deep, emotional history."  },
  Leo: {
    impression: "You radiate a majestic, solar confidence that naturally pulls the eye toward you. There is an undeniable dramatic flair to your presence; you don't just enter a room, you 'appear' within it. Others perceive you as warm, noble, and deeply creative even before you've shared your talents.",
    traits: ['Magnetic', 'Radiant', 'Generous'],
    social: "Your social mask is radiant and performative. You naturally gravitate toward the center of the social solar system, not out of ego, but because your warmth provides a necessary light that encourages others to shine as well.",
    lesson: "To find the internal sovereignty to shine for the pure joy of existence, rather than performing for the external validation of an audience.",
    style: "Sovereign & Dramatic Presence. You dress for the spotlight, even in casual settings. Your silhouette is designed to command attention, featuring bold collars, 'look-at-me' prints, and voluminous shapes. You gravitate toward the regal: gold hardware, faux furs, and heavy brocades. Your power colors are solar-based: burnished golds, royal purples, and deep oranges. For you, fashion is a performance of the soul, and you are never afraid of being 'too much'."  },
  Virgo: {
    impression: "You project an aura of quiet precision, health-consciousness, and understated intelligence. You are perceived as exceptionally observant, analytical, and 'put-together'. There is a refreshing clarity to your presence that suggests efficiency and a keen eye for detail.",
    traits: ['Analytical', 'Refined', 'Diligent'],
    social: "Your social mask is reserved and thoughtfully helpful. You find social comfort in being useful; you are the one who notices what is missing or what needs fixing, providing solutions with a humble, clinical grace.",
    lesson: "To accept that 'perfect' is often the enemy of 'good' and to find the spiritual beauty in the inevitable messiness of the human experience.",
    style: "Meticulous & Refined Utility. Your aesthetic is the definition of 'stealth wealth.' Every seam must be perfect, and every accessory must have a function. You look best in tailored, crisp silhouettes—pencil skirts, button-down shirts with hidden plackets, and perfectly fitted trousers. Your palette is grounded and clinical: slate grey, navy, and forest green. You avoid the gaudy, preferring the quiet power of a high-quality watch or a perfectly organized, structured leather bag."  },
  Libra: {
    impression: "You project an aura of effortless grace, aesthetic balance, and sophisticated social harmony. You have a preternatural ability to mirror the best in others, making everyone you encounter feel seen and comfortable. You appear as the personification of 'the middle way'.",
    traits: ['Harmonious', 'Diplomatic', 'Graceful'],
    social: "You are an expert at social lubrication. Your primary goal is the maintenance of aesthetic and interpersonal peace, navigating complex social dynamics with a diplomat’s touch and a poet's eye for beauty.",
    lesson: "To understand that real harmony sometimes requires the courage to engage in necessary conflict and to speak your own truth regardless of the 'balance'.",
    style: "Harmonious & Artistic Symmetry. You are the architect of balance. Your style focuses on proportion and the way fabrics drape against the body. You gravitate toward romantic but balanced silhouettes: pleated skirts, wrap dresses, and tailored coats in soft suedes. Your color story is one of sophisticated pastels—dusty rose, lavender, and champagne. You have a preternatural eye for jewelry that mirrors your facial symmetry, preferring pieces that are delicate but masterfully crafted."  },
  Scorpio: {
    impression: "You project a magnetic, obsidian-like mystery that feels both protective and piercing. You are a 'detective of the soul,' possessing a gaze that suggests you see far beneath the surface of things. Others often feel a sense of 'all or nothing' intensity when they first meet you.",
    traits: ['Intense', 'Perceptive', 'Magnetic'],
    social: "You employ a 'Psychic Armor' in social settings. You are constantly, silently analyzing power dynamics and hidden motives, preferring to remain a mystery until you have fully vetted the safety of the environment.",
    lesson: "To learn that true power is found in the ability to forgive and transform, rather than in the strategic ability to control or defend.",
    style: "Obsidian Armor & Magnetic Mystery. Your style is designed to protect your energy while drawing others in. You look best in 'shrouded' silhouettes: high necklines, trench coats, and deep hoods. You gravitate toward textures that suggest depth—black leather, dark velvet, and lace. Your palette is midnight-inspired: deep burgundy, obsidian black, and plum. Your look is often punctuated by a 'piercing' detail, like a sharp stiletto heel or a single, intense piece of silver jewelry."  },
  Sagittarius: {
    impression: "You radiate a 'larger-than-life' optimism and a restless, adventurous enthusiasm. You strike others as an eternal seeker or a philosophical traveler who is always halfway to the next big adventure. There is a sense of 'infinite space' in your personality.",
    traits: ['Expansive', 'Honest', 'Adventurous'],
    social: "You are the 'Jovial Traveler.' You navigate the world with a radical, sometimes startling honesty and a great sense of humor, often acting as the philosopher who reminds the group of the 'Big Picture'.",
    lesson: "To find the sacred wisdom hidden in the small, present details of life rather than always chasing the promise of the distant horizon.",
    style: "Global Nomad & Freedom-Focused. You dress for a life lived on the move. Your silhouette is relaxed and expansive—wide-leg trousers, ponchos, and breathable linens that work in any climate. You love eclectic, 'souvenir' fashion: patterns gathered from world travels and rugged outdoor gear that looks high-fashion. Your palette is as broad as the horizon: royal blue, burnt sienna, and bright purple. You value the 'hunt' for a unique piece more than the label on the tag."  },
  Capricorn: {
    impression: "You project an aura of quiet seriousness, competence, and time-honored authority. You are perceived as a mature, reliable figure who has a plan for everything. There is a weight to your presence that suggests you have already climbed the mountains others are still fearing.",
    traits: ['Disciplined', 'Strategic', 'Reserved'],
    social: "Your social mask is cool, professional, and slightly detached. You prioritize respect and reputation, moving through social circles with a calculated grace that values quality over quantity in your connections.",
    lesson: "To realize that showing your internal emotional landscape is not a weakness, but a vital component of heart-centered leadership.",
    style: "Structural Authority & Heritage Chic. You dress like the CEO of your own life. Your silhouette is architectural and high-pressure—well-structured blazers, trench coats with heavy epaulets, and heritage tweeds. You gravitate toward symbols of longevity: pinstripes, camel hair, and heavy wool. Your palette is traditional and powerful: charcoal, camel, and black. You look best in 'investment' pieces that look better with age, signaling a soul that values status and structural integrity."  },
  Aquarius: {
    impression: "You project a brilliant, somewhat detached eccentricity. You strike others as a true original—a visionary who exists slightly outside the standard mold of society. People often sense your intellectual independence and your commitment to the collective before they know your name.",
    traits: ['Unconventional', 'Altruistic', 'Visionary'],
    social: "You are the 'Friendly Outsider.' You use your intellect as a social bridge, engaging people in discussions about progress and the future, though you always maintain a certain amount of personal 'space'.",
    lesson: "To learn how to connect with the individual human heart as deeply and passionately as you connect with abstract human ideals.",
    style: "Systematic Rebellion & Futuristic Vision. Your style is a 'glitch' in the matrix. You are the first to wear new technology—from LED-integrated fabrics to recycled ocean plastics. Your silhouette is often asymmetrical and experimental, breaking all the standard rules of proportion. You look best in electric and neon accents paired with metallic silvers and deep cosmic blues. You don't follow trends; you create the blueprint for the trends that everyone else will be wearing in five years."  },
  Pisces: {
    impression: "You radiate an ethereal, dreamy sensitivity that feels slightly 'out of time'. You possess a soft-focus quality that makes you appear profoundly non-judgmental and compassionate. People often feel they can tell you their deepest secrets within minutes of meeting you.",
    traits: ['Ethereal', 'Compassionate', 'Imaginative'],
    social: "You are the ultimate 'Social Chameleon,' possessing a porous energy that allows you to mirror the emotions around you. You move through the world like water, finding the path of least resistance and maximum empathy.",
    lesson: "To find the spiritual discipline to stay grounded in your own reality while maintaining your beautiful connection to the divine infinite.",
    style: "Ethereal & Oceanic Fluidity. You look as though you’ve just stepped out of a dream or a tide pool. Your silhouette is fluid and amorphous—sheer overlays, wide-set sleeves, and long, trailing hemlines. You gravitate toward textures that feel liquid: silk chiffons, sequins that mimic fish scales, and mohair. Your palette is aqueous: sea-glass green, misty violet, and iridescent blues. You look best in 'soft-focus' fashion that blurs the lines between your body and the environment."  }
};

const getAscendantData = (sign) => ascendantData[sign] || ascendantData.Scorpio;

const Ascendant = () => {
  const { signName } = useParams(); // MATCHES THE ROUTE: /ascendant/:signName
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Scorpio';
    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return ascendantData[formatted] ? formatted : 'Scorpio';
  };

  const [ascendantSign, setAscendantSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAscendant = async () => {
      // Priority 1: URL Parameter
      if (signName) {
        setAscendantSign(normalizeSign(signName));
        setLoading(false);
        return;
      }
      // Priority 2: User Birth Data
      if (user?.birth?.date) {
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
          
          const fetchedSign = response.data?.data?.ascendant;
          if (fetchedSign) setAscendantSign(normalizeSign(fetchedSign));
        } catch (err) {
          console.error('Failed to fetch ascendant:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback
        setAscendantSign('Scorpio');
        setLoading(false);
      }
    };
    fetchAscendant();
  }, [user, signName]);

  // --- BACKGROUND ANIMATION ---
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
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentData = getAscendantData(ascendantSign);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      
      <main className="relative z-10 max-w-6xl mx-auto pt-36 pb-20 px-6">
        <Link to="/natal" className="inline-flex items-center gap-2 text-cyan-500 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <header className="text-center mb-16">
          <span className="inline-block bg-cyan-500/10 text-[#22d3ee] border border-cyan-500/50 px-5 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.3em] mb-4">
            The Rising Sign
          </span>
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tight bg-linear-to-r from-white to-[#22d3ee] bg-clip-text text-transparent">
            {loading ? 'Loading...' : `${ascendantSign} ASC`}
          </h1>
          <p className="mt-6 opacity-60 max-w-xl mx-auto text-lg leading-relaxed">
            {loading ? 'Calculating your Ascendant...' : "The Ascendant is the horizon of the self. It is the spontaneous 'You' that meets the world."}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && (
            <>
              <GlassCard icon={<Eye className="text-[#22d3ee]" />} title="First Impression">
                <p className="mb-6">{currentData.impression}</p>
                <div className="flex flex-wrap gap-2">
                  {currentData.traits.map((trait) => (
                    <span key={trait} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs tracking-wider">
                      {trait}
                    </span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard icon={<UserCheck className="text-[#22d3ee]" />} title="Social Mask">
                <p className="mb-4">{currentData.social}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm italic text-[#22d3ee]">
                    <strong>The Strategic Lesson:</strong> {currentData.lesson}
                  </p>
                </div>
              </GlassCard>

              <div className="md:col-span-2">
                <GlassCard icon={<Sparkles className="text-[#22d3ee]" />} title="Physical Presence & Style">
                  <p className="text-lg leading-relaxed">{currentData.style}</p>
                </GlassCard>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const GlassCard = ({ icon, title, children }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-[#22d3ee]/50 group">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 rounded-lg bg-[#22d3ee]/10 group-hover:scale-110 transition-transform">{icon}</div>
      <h2 className="text-lg font-semibold tracking-widest uppercase text-[#22d3ee]">{title}</h2>
    </div>
    <div className="text-[#f5f5f5] opacity-80 leading-relaxed">{children}</div>
  </div>
);

export default Ascendant;