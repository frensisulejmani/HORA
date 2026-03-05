import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Trophy, Globe, ArrowLeft, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const mcData = {
  Aries: {
    description: "The Independent Pioneer",
    legacy: "Your public legacy is one of courage and initiation. You are known as a 'disruptor' who isn't afraid to be the first to try something dangerous or new. You command respect through sheer audacity.",
    career: "Thrives in competitive environments, startups, or solo-entrepreneurship. You need a career where you can lead the charge and see immediate results of your actions.",
    style: "Professional Authority. Your public image is sharp, high-energy, and decisive. You don't 'network'—you conquer opportunities.",
    vocation: ["Entrepreneur", "Military Leader", "Athlete", "Emergency Surgeon"]
  },
  Taurus: {
    description: "The Material Architect",
    legacy: "You are recognized for your endurance and your ability to build things that last for generations. Your reputation is one of absolute reliability and aesthetic mastery.",
    career: "Drawn to finance, real estate, luxury goods, or the arts. You need a career that offers tangible growth and physical beauty.",
    style: "Stable & Sensual. Your public brand is one of 'Quiet Luxury'. People trust you because you project a sense of permanence.",
    vocation: ["Architect", "Financial Advisor", "Art Curator", "Estate Manager"]
  },
  Gemini: {
    description: "The Information Alchemist",
    legacy: "Your legacy is built on the movement of ideas. You are known as a master communicator who can translate complex concepts for the masses. Your reputation is 'the person who knows everything'.",
    career: "Excels in media, journalism, teaching, or tech. You need a vocation with constant variety and social interaction.",
    style: "Agile & Witty. Your public persona is youthful and intellectually sharp. You are seen as the ultimate connector of people.",
    vocation: ["Journalist", "PR Strategist", "Translator", "Software Dev"]
  },
  Cancer: {
    description: "The Public Guardian",
    legacy: "You are known for your emotional intelligence and your ability to nurture the collective. Your reputation is one of deep intuition and protective leadership.",
    career: "Drawn to psychology, hospitality, healthcare, or family-run empires. You succeed when you feel an emotional connection to your work.",
    style: "Empathetic & Instinctive. Your public image is warm but private. People feel 'safe' under your professional guidance.",
    vocation: ["Psychotherapist", "Chef", "Historian", "Social Worker"]
  },
  Leo: {
    description: "The Creative Sovereign",
    legacy: "Your public life is a performance of the soul. You are known for your charisma, your grand visions, and your ability to inspire others through your creative light.",
    career: "Thrives in the performing arts, high-level management, or any role that allows you to be the 'face' of a brand.",
    style: "Radiant & Noble. Your public brand is dramatic and warm. You command the room naturally and expect to be treated with dignity.",
    vocation: ["Creative Director", "Actor", "CEO", "Motivational Speaker"]
  },
  Virgo: {
    description: "The Master Craftsman",
    legacy: "Your reputation is built on the foundation of flawless execution and service. You are known as the person who can fix what is broken and perfect what is messy.",
    career: "Excels in data analysis, scientific research, editorial work, or wellness. You need a career that demands technical integrity.",
    style: "Crisp & Functional. Your public image is understated and impeccable. You are respected for your competence, not your ego.",
    vocation: ["Editor", "Scientist", "Wellness Expert", "Systems Analyst"]
  },
  Libra: {
    description: "The Social Diplomat",
    legacy: "Your public legacy is one of justice and aesthetic harmony. You are known as a fair judge and a master of interpersonal relations.",
    career: "Drawn to law, fashion, interior design, or mediation. You succeed when you are bringing two opposing sides into balance.",
    style: "Polished & Balanced. Your public brand is elegant and approachable. You are the 'face' that everyone likes and respects.",
    vocation: ["Lawyer", "Fashion Designer", "Mediator", "Art Dealer"]
  },
  Scorpio: {
    description: "The Transformative Powerhouse",
    legacy: "You are known for your ability to handle crises and see into the shadows. Your reputation is one of intense, magnetic power and strategic silence.",
    career: "Excels in investigative work, deep finance, research, or the occult. You thrive in careers that require 'detective' work.",
    style: "Intense & Mysterious. Your public persona is private and high-stakes. People are often slightly intimidated by your focus.",
    vocation: ["Investigator", "Surgeon", "Crisis Manager", "Researcher"]
  },
  Sagittarius: {
    description: "The Philosophical Voyager",
    legacy: "Your reputation is one of wisdom, truth-seeking, and expansion. You are known as a person of 'The Big Picture' who pushes boundaries.",
    career: "Drawn to higher education, travel, publishing, or law. You need a career that offers freedom and constant learning.",
    style: "Expansive & Honest. Your public brand is adventurous and blunt. You are seen as the teacher or the prophet of your field.",
    vocation: ["Professor", "Travel Writer", "Publisher", "Global Consultant"]
  },
  Capricorn: {
    description: "The Strategic General",
    legacy: "The Midheaven is the natural home of Capricorn. Your legacy is one of peak achievement, structural power, and immense public respect.",
    career: "Thrives in government, corporate leadership, or tradition-based industries. You are built for the long, hard climb to the top.",
    style: "Authoritative & Timeless. Your public persona is serious and high-status. You are the embodiment of professional success.",
    vocation: ["Politician", "Executive", "Architect", "Judge"]
  },
  Aquarius: {
    description: "The Radical Visionary",
    legacy: "Your public legacy is one of innovation and social progress. You are known as a rebel who works for the benefit of the future collective.",
    career: "Excels in humanitarian work, science, technology, or social activism. You need a career that allows you to break rules.",
    style: "Unconventional & Electric. Your public brand is unique and intellectual. You are seen as the genius who sees what's coming.",
    vocation: ["Social Activist", "Scientist", "Tech Innovator", "Futurist"]
  },
  Pisces: {
    description: "The Mystic Visionary",
    legacy: "Your public reputation is ethereal and compassionate. You are known for your artistic soul and your ability to tap into the collective dream.",
    career: "Drawn to the arts, healing, spiritual work, or photography. You succeed when you can bring magic into the mundane world.",
    style: "Fluid & Compassionate. Your public persona is soft-focus and non-threatening. You are respected for your soul, not your metrics.",
    vocation: ["Artist", "Spiritual Healer", "Photographer", "Film Director"]
  }
};

const getMCData = (sign) => mcData[sign] || mcData.Capricorn;

const MC = () => {
  const { signName } = useParams();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const normalizeSign = (name) => {
    if (!name) return 'Capricorn';
    const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return mcData[formatted] ? formatted : 'Capricorn';
  };

  const [mcSign, setMCSign] = useState(normalizeSign(signName));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMC = async () => {
      if (signName) {
        setMCSign(normalizeSign(signName));
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
        
        const fetchedSign = response.data?.data?.midheaven;
        if (fetchedSign) setMCSign(normalizeSign(fetchedSign));
      } catch (err) {
        console.error('Failed to fetch MC:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMC();
  }, [user, signName]);

  // Ambient Star Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.005 + 0.002
      }));
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0.1) s.speed = -s.speed;
      });
      requestAnimationFrame(animate);
    };
    init(); animate();
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
  }, []);

  const currentData = getMCData(mcSign);

  return (
    <div className="relative min-h-screen bg-[#020202] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      <Navbar />
      
      <main className="relative z-10 max-w-6xl mx-auto pt-36 pb-20 px-6">
        <Link to="/natal" className="inline-flex items-center gap-2 text-indigo-400 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Natal Architecture
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-4 py-1 rounded-full text-[0.65rem] uppercase tracking-widest font-bold">
              The Zenith
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter bg-linear-to-b from-white via-white to-indigo-900 bg-clip-text text-transparent">
            {loading ? '...' : `${mcSign} MC`}
          </h1>
          <p className="mt-8 text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
            The Midheaven is your highest point of achievement. It represents the "Social Mask" you wear in public, your professional legacy, and your soul's ambition in the material world.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!loading && (
            <>
              <div className="md:col-span-2 space-y-6">
                <GlassCard icon={<Trophy className="text-indigo-400" />} title="Public Legacy">
                  <p className="text-lg leading-relaxed">{currentData.legacy}</p>
                </GlassCard>
                
                <GlassCard icon={<Briefcase className="text-indigo-400" />} title="Career Path">
                  <p className="text-lg leading-relaxed mb-6">{currentData.career}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentData.vocation.map(v => (
                      <span key={v} className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-xs text-indigo-300">
                        {v}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-6">
                <GlassCard icon={<Star className="text-indigo-400" />} title="Public Image">
                  <p className="leading-relaxed opacity-80">{currentData.style}</p>
                </GlassCard>
                
                <div className="bg-indigo-600 rounded-3xl p-8 flex flex-col justify-between min-h-62.5 shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
                   <Globe className="text-white/40" size={40} />
                   <div>
                     <h3 className="text-white font-bold text-xl mb-2">The Apex</h3>
                     <p className="text-indigo-100 text-sm opacity-80">
                       This sign dictates how history will remember you. It is the peak of your natal architecture.
                     </p>
                   </div>
                </div>
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
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-10 transition-all hover:border-indigo-500/40">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 rounded-2xl bg-indigo-500/10">{icon}</div>
      <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400">{title}</h2>
    </div>
    <div className="text-slate-200">{children}</div>
  </div>
);

export default MC;