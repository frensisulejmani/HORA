import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { hdAPI } from '../services/api';
import HumanDesignChart from '../components/HumanDesignChart';
import { ShieldCheck, Zap, Activity, Info } from 'lucide-react';

const HumanDesign = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [hdData, setHdData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Human Design data from your existing API
  useEffect(() => {
    const fetchHumanDesign = async () => {
      // always attempt to fetch; backend will fall back to stored data or a static map
      try {
        setLoading(true);
        let body = {};
        if (user?.birth?.date) {
          const birthDateISO = new Date(
            Date.UTC(
              user.birth.year,
              user.birth.month - 1,
              user.birth.date,
              user.birth.hour || 0,
              user.birth.minute || 0
            )
          ).toISOString();
          body = {
            birthDateISO,
            year: user.birth.year,
            month: user.birth.month,
            date: user.birth.date,
            hour: user.birth.hour || 0,
            minute: user.birth.minute || 0,
            latitude: user.birth.latitude || 0,
            longitude: user.birth.longitude || 0,
            timezone: user.birth.timezone || 0,
            place: user.birth.place || ''
          };
        }
        const response = await hdAPI.generateHumanDesign(body);

        if (response.data) {
          setHdData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch Human Design:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHumanDesign();
  }, [user]);

  // Starfield Animation logic for the background
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

  return (
    <div className="relative min-h-screen bg-[#020202] text-[#f5f5f5] overflow-x-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto pt-40 pb-20 px-6">
        {/* Header Section: Minimalist & Clean */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-400">Biological Architecture</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-b from-white via-white to-gray-600 bg-clip-text text-transparent tracking-tighter">
            THE BODYGRAPH
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Your genetic blueprint is a technical map of your soul’s differentiation.
          </p>
        </div>

        {/* Chart Layout: Silhouette Background integrated in HumanDesignChart */}
        <div className="mb-24 flex justify-center">
          {loading ? (
            <div className="w-full max-w-4xl aspect-3/4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6" />
               <p className="text-cyan-400 tracking-widest text-xs uppercase font-bold">Calculating Geometry...</p>
            </div>
          ) : hdData ? (
            <div className="w-full flex justify-center">
              <HumanDesignChart hdData={hdData} />
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-[3rem] p-12 text-center text-white/60">
              Unable to generate blueprint. Verify birth data.
            </div>
          )}
        </div>

        {/* Detailed Descriptions (The Information Grid) */}
        {hdData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Strategy & Authority */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard 
                icon={<Zap size={20} />} 
                title="Decision Strategy" 
                subtitle={hdData.strategy || "To Respond"} 
                content="How your body naturally navigates the world to avoid resistance and find flow."
              />
              <GlassCard 
                icon={<ShieldCheck size={20} />} 
                title="Inner Authority" 
                subtitle={hdData.authority || "Emotional Solar Plexus"} 
                content="Your unique biological intelligence for making correct decisions."
              />
              <div className="md:col-span-2">
                <GlassCard 
                  icon={<Activity size={20} />} 
                  title="Life Theme (Incarnation Cross)" 
                  subtitle={hdData.incarnationCross || "The Cross of Life"} 
                  content="The overarching purpose and mission your design is meant to fulfill."
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-linear-to-b from-cyan-600/20 to-transparent border border-cyan-500/20 rounded-[3rem] p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase mb-8">Design Profile</h3>
                <div className="text-5xl font-bold text-white mb-4">{hdData.profile || "4/6"}</div>
                <p className="text-slate-400 leading-relaxed font-light">
                  Your profile represents your social role and the character you play in the grand narrative of life.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 text-cyan-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:gap-6 transition-all">
                Learn more about your profile <Info size={14} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Reusable Glass Component to keep the page clean
const GlassCard = ({ icon, title, subtitle, content }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 transition-all hover:bg-white/8">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">{icon}</div>
      <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white mb-4">{subtitle}</div>
    <p className="text-sm text-slate-400 font-light leading-relaxed">{content}</p>
  </div>
);

export default HumanDesign;