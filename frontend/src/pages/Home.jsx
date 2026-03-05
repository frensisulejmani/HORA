import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import natal from "../assets/natal.png";
import horoscopee from "../assets/Horoscopee.jpg";
import about from "../assets/horoscope.jpg";
import { Heart, MapPin, Layers, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { astroAPI } from "../services/api";
import Hd from "../assets/HD.png";

const Home = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [sunSign, setSunSign] = useState("Sun Sign");
  const [moonSign, setMoonSign] = useState("Moon Sign");
  const [ascendant, setAscendant] = useState("Ascendant");
  const [loading, setLoading] = useState(false);

  // Horoscope data for all signs
  const horoscopeData = {
    aries: {
      element: "Fire",
      ruling: "Mars",
      Daily: {
        overall: "Your ruling planet Mars energizes your ventures today. Bold action meets cosmic favor.",
        love: "Passion runs high. A flirty encounter could spark something meaningful.",
        career: "Take charge of that project you've been hesitant about. Your confidence is your superpower.",
        finance: "An unexpected opportunity could boost your earnings."
      }
    },
    taurus: {
      element: "Earth",
      ruling: "Venus",
      Daily: {
        overall: "Stability and comfort take center stage. A good day for grounding yourself.",
        love: "Sensual pleasures call. Enjoy time with loved ones in cozy settings.",
        career: "Steady progress beats rushing. Finish what you start today.",
        finance: "A solid day for financial planning. Review budgets."
      }
    },
    gemini: {
      element: "Air",
      ruling: "Mercury",
      Daily: {
        overall: "Mercury energizes your mind. Communication flows beautifully today.",
        love: "Witty banter sparks connections. Share your authentic thoughts.",
        career: "Meetings and collaborations shine. Your ideas are gold.",
        finance: "Short trips or sales opportunities bring gains."
      }
    },
    cancer: {
      element: "Water",
      ruling: "Moon",
      Daily: {
        overall: "Emotional intuition guides you. Trust your gut feelings today.",
        love: "Deep emotional connections draw near. Vulnerability strengthens bonds.",
        career: "Nurturing others at work builds loyalty and respect.",
        finance: "Trust your instincts about money matters."
      }
    },
    leo: {
      element: "Fire",
      ruling: "Sun",
      Daily: {
        overall: "The Sun fuels your creativity and confidence. Shine brightly.",
        love: "Romantic gestures work wonders. Express your love boldly.",
        career: "Leadership opportunities emerge. Step into your power.",
        finance: "Risk-taking ventures show potential. Go for it."
      }
    },
    virgo: {
      element: "Earth",
      ruling: "Mercury",
      Daily: {
        overall: "Attention to detail serves you well. Organize and refine.",
        love: "Show love through thoughtful gestures and practical care.",
        career: "Perfect execution brings recognition today.",
        finance: "Review your financial details. Improvements are clear."
      }
    },
    libra: {
      element: "Air",
      ruling: "Venus",
      Daily: {
        overall: "Balance and beauty guide your day. Seek harmony.",
        love: "Charm flows naturally. Connections deepen beautifully.",
        career: "Diplomacy and aesthetics serve you well in negotiations.",
        finance: "Fair dealings bring good karma and gain."
      }
    },
    scorpio: {
      element: "Water",
      ruling: "Pluto",
      Daily: {
        overall: "Intensity and intuition are your superpowers today.",
        love: "Deep, transformative emotions surface. Embrace them.",
        career: "Probe beneath surface issues. Find hidden solutions.",
        finance: "Strategic financial moves work in your favor."
      }
    },
    sagittarius: {
      element: "Fire",
      ruling: "Jupiter",
      Daily: {
        overall: "Adventure and expansion call. Take the leap today.",
        love: "Optimism attracts love. Share your enthusiasm.",
        career: "Big-picture thinking brings opportunities.",
        finance: "Luck smiles on bold ventures."
      }
    },
    capricorn: {
      element: "Earth",
      ruling: "Saturn",
      Daily: {
        overall: "Discipline and ambition are your allies today.",
        love: "Show love through commitment and reliability.",
        career: "Hard work manifests visible results.",
        finance: "Strategic planning increases wealth."
      }
    },
    aquarius: {
      element: "Air",
      ruling: "Uranus",
      Daily: {
        overall: "Innovation and individuality shine today.",
        love: "Connect on intellectual and unique levels.",
        career: "Unconventional ideas gain traction.",
        finance: "Group investments or tech ventures."
      }
    },
    pisces: {
      element: "Water",
      ruling: "Neptune",
      Daily: {
        overall: "Intuition and creativity flow through you today.",
        love: "Romantic dreams become touchable reality.",
        career: "Creative or healing work brings fulfillment.",
        finance: "Trust your instincts with money."
      }
    }
  };

  // Fetch astrological data on component mount or when user changes
  useEffect(() => {
    const fetchAstroData = async () => {
      if (!user?.birth?.date) {
        // Keep defaults if no birth data
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

        if (response.data?.data) {
          const astroData = response.data.data;
          setSunSign(astroData.sunSign || "Sun Sign");
          setMoonSign(astroData.moonSign || "Moon Sign");
          setAscendant(astroData.ascendant || "Ascendant");
        }
      } catch (err) {
        console.error("Failed to fetch astro data:", err);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchAstroData();
  }, [user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-purple-500/30">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[5%] -right-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/15 blur-[120px]" />
      </div>

      <Navbar />
      <main className="relative z-10 flex flex-col items-center pt-32 px-5 pb-16 mt-10">
        <h1 className="text-5xl md:text-6xl font-black tracking-widest leading-tight bg-linear-to-b from-white to-purple-500 bg-clip-text text-transparent uppercase">
          Welcome To Hora!
        </h1>
        <h2 className="text-3xl font-bold mt-2 opacity-100 white uppercase">{user?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'User Name')}</h2>
        <p className="max-w-xl text-center mt-4 opacity-70 leading-relaxed text-lg mb-12">
          Your cosmic journey begins here.
        </p>

      {/* Zodiac Sign Boxes */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl mb-20">
        {[
          { label: "Sun Sign", value: sunSign, alt: "Sun" },
          { label: "Moon Sign", value: moonSign, alt: "Moon" },
          { label: "Ascendant", value: ascendant, alt: "Ascendant" },
        ].map((sign) => (
          <Link
            key={sign.label}
            // Navigates to /zodiac/leo, /zodiac/scorpio, etc.
            to={`/${sign.alt.toLowerCase()}`}
            className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl py-10 px-6 w-70 flex flex-col items-center gap-3 hover:-translate-y-2 hover:border-purple-500 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all no-underline group"
          >
            <span className="uppercase text-[14px] tracking-[2px] text-purple-400 font-bold group-hover:text-purple-300 transition-colors">
              {sign.label}
            </span>
            <span className="text-3xl font-semibold tracking-tight text-white group-hover:scale-105 transition-transform">
              {loading ? "Loading..." : sign.value}
            </span>
          </Link>
        ))}
      </div>

        {/* Daily Horoscope Section */}
        {sunSign !== "Sun Sign" && (
          <div className="  mb-10">
            <div className="bg-linear-to-br w-300 from-purple-500/20 to-pink-500/10 backdrop-blur-xl border border-purple-500/40 rounded-[30px] md:p-14">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-purple-400 animate-pulse" size={28} />
                <h3 className="text-3xl md:text-4xl font-bold text-white uppercase">
                  Today's Cosmic Energy
                </h3>
              </div>

              {horoscopeData[sunSign.toLowerCase()] ? (
                <div className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Love */}
                    <div className="p-6 rounded-2xl bg-linear-to-br from-pink-500/15 to-red-500/5 border border-pink-500/20">
                      <h4 className="text-xl font-semibold text-pink-400 mb-3 uppercase">
                      Love & Romance
                      </h4>
                      <p className="text-white/80 leading-relaxed text-l">
                        {horoscopeData[sunSign.toLowerCase()].Daily.love}
                      </p>
                    </div>

                    {/* Career */}
                    <div className="p-6 rounded-2xl bg-linear-to-br from-blue-500/15 to-purple-500/5 border border-blue-500/20">
                      <h4 className="text-lg font-semibold text-blue-400 mb-3 uppercase">
                      Career & Work
                      </h4>
                      <p className="text-white/80 leading-relaxed text-l">
                        {horoscopeData[sunSign.toLowerCase()].Daily.career}
                      </p>
                    </div>

                    {/* Finance */}
                    <div className="p-6 rounded-2xl bg-linear-to-br from-green-500/15 to-emerald-500/5 border border-green-500/20">
                      <h4 className="text-lg font-semibold text-green-400 mb-3 uppercase">
                      Finances & Luck
                      </h4>
                      <p className="text-white/80 leading-relaxed text-l">
                        {horoscopeData[sunSign.toLowerCase()].Daily.finance}
                      </p>
                    </div>

                    {/* Sign Info */}
                    <div className="p-6 rounded-2xl bg-linear-to-br from-yellow-500/15 to-orange-500/5 border border-yellow-500/20">
                      <h4 className="text-lg font-semibold text-yellow-400 mb-3 uppercase">
                      Your Cosmic Profile
                      </h4>
                      <p className="text-white/80 leading-relaxed text-l">
                        <span className="font-semibold">Element:</span> {horoscopeData[sunSign.toLowerCase()].element} • <span className="font-semibold">Ruler:</span> {horoscopeData[sunSign.toLowerCase()].ruling}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/60 text-center py-8">
                  Log in with your birth details to see your personalized daily horoscope
                </p>
              )}
            </div>
          </div>
        )}

          {/* About Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 ml-30 mr-30">
            <div className="w-full h-80 rounded-[30px] overflow-hidden border border-white/20">
              <img
                src={about}
                alt="Cosmos"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-4xl font-semibold text-purple-400 mb-6 uppercase">
                About Hora
              </h3>
              <p className="text-white/80 leading-relaxed text-lg">
                At the intersection of ancient celestial wisdom and modern digital precision, we have engineered a bridge across the ages. Our mission is to provide you with a high-fidelity roadmap of your soul's journey. By combining proprietary astronomical algorithms with centuries of astrological tradition, we don’t just offer a horoscope; we provide a sophisticated blueprint for navigating your life’s highest potential.
              </p>
            </div>
          </section>

          {/* Feature Grid */}
          <section className="flex flex-col w-300 gap-6 mb-20">
            <Link to="/natal" className="no-underline">
              <FeatureBlock title="Natal Chart" img={natal} />
            </Link>
            <Link to="/horoscope" className="no-underline">
              <FeatureBlock title="Horoscope" img={horoscopee} />
            </Link>
          </section>

          {/* Trio Buttons */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 w-full max-w-5xl">
            <Link to="/soulmate" className="no-underline">
              <TrioLink Icon={Heart} text="Soulmate Compatibility" />
            </Link>

            <Link to="/astrocartography" className="no-underline">
              <TrioLink Icon={MapPin} text="Astrochartography" />
            </Link>

            <Link to="/tarot" className="no-underline">
              <TrioLink Icon={Layers} text="Tarot Reading" />
            </Link>
          </section>

          {/* Horizontal Detailed Buttons */}
          <section className="flex flex-col w-300 gap-10 mb-20 px-4">
            <Link to="/humandesign" className="no-underline block group">
              <HorizontalBtn
                title="Human Design Analysis"
                desc="A sophisticated deep dive into your inner energetic blueprint and decision-making authority."
                img={Hd}
              />
            </Link>
            
            <Link to="/destinymatrix" className="no-underline block group">
              <HorizontalBtn
                title="Destiny Matrix"
                desc="Unlock your life's purpose and hidden talents through the sacred geometry of your birth date."
                img="https://luuckk.com/cdn/shop/articles/signification-7-chakras_c2a2a81b-1079-47f5-8353-f08c629e80b3.webp?crop=center&height=1200&v=1753878344&width=1200"
              />
            </Link>
          </section>

      </main>
      <Footer />
    </div>
  );
};

const FeatureBlock = ({ title, img }) => (
  <div className="relative h-72 rounded-[30px] overflow-hidden border border-purple-500/30 flex items-end p-10 group cursor-pointer transition-all hover:border-purple-500">
    <img
      src={img}
      className="absolute inset-0 w-full h-full object-cover opacity-40 z-[-1] transition-transform duration-900 group-hover:scale-105"
      alt={title}
    />
    <h4 className="text-2xl font-semibold uppercase bg-black/50 p-2 rounded-lg">{title}</h4>
  </div>
);

const TrioLink = ({ Icon, text }) => (
  <div className="bg-white/5 border border-purple-500/30 p-10 rounded-3xl flex flex-col items-center gap-4 cursor-pointer hover:bg-purple-500/15 hover:-translate-y-1 transition-all">
    <Icon size={32} className="text-purple-400" />
    <span className="font-semibold text-base">{text}</span>
  </div>
);

const HorizontalBtn = ({ title, desc, img }) => (
  <div className="flex flex-col md:flex-row justify-between items-center bg-[#141419] border border-purple-500/30 rounded-[35px] overflow-hidden min-h-60 group cursor-pointer hover:border-purple-500 transition-all duration-500 shadow-2xl">
    
    {/* Text Content */}
    <div className="flex-1 px-8 py-10 md:px-16 z-10 text-center md:text-left">
      <h5 className="text-4xl md:text-3xl font-bold bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent group-hover:to-purple-400 transition-all duration-900">
        {title}
      </h5>
      <p className="mt-4 text-l text-white/50 max-w-md leading-relaxed group-hover:text-white/70 transition-colors duration-500">
        {desc}
      </p>
    </div>

    {/* Image Container with Smooth Gradient Mask */}
    <div className="w-full md:w-1/2 h-64 md:h-60 relative overflow-hidden mask-fade-left">
      <img
        src={img}
        className="w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000 ease-out"
        alt={title}
      />
      
      {/* Dynamic Masking Styles */}
      <style jsx>{`
        .mask-fade-left {
          mask-image: linear-gradient(to top, transparent, black 20%);
          -webkit-mask-image: linear-gradient(to top, transparent, black 20%);
        }
        @media (min-width: 768px) {
          .mask-fade-left {
            mask-image: linear-gradient(to left, black 60%, transparent 100%);
            -webkit-mask-image: linear-gradient(to left, black 60%, transparent 100%);
          }
        }
      `}</style>
    </div>
  </div>
);

export default Home;
