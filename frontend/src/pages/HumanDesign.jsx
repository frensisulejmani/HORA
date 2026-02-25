import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { hdAPI } from '../services/api';
import HumanDesignChart from '../components/HumanDesignChart';

const HumanDesign = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [hdData, setHdData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Human Design data
  useEffect(() => {
    const fetchHumanDesign = async () => {
      if (!user?.birth?.date || !user?.name) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const birthDateISO = new Date(
          Date.UTC(
            user.birth.year,
            user.birth.month - 1,
            user.birth.date,
            user.birth.hour || 0,
            user.birth.minute || 0
          )
        ).toISOString();

        const response = await hdAPI.generateHumanDesign({
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
        });

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    class Star {
      constructor() {
        this.reset();
      }
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
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden">
      {/* Background Layers */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto pt-40 pb-20 px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-b from-white to-cyan-400 bg-clip-text text-transparent tracking-tight">
            The Science of Differentiation
          </h1>
          <p className="text-lg opacity-60 font-light">
            Your Human Design is the genetic blueprint of your soul.
          </p>
        </div>

        {/* Blueprint Layout */}
        <div className="mb-12">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-12 text-center text-white/60">
              <div className="animate-spin inline-block mb-4">⌛</div>
              <p>Calculating your Human Design...</p>
            </div>
          ) : hdData ? (
            <HumanDesignChart hdData={hdData} />
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-12 text-center text-white/60">
              Unable to calculate Human Design. Please ensure your birth data is complete.
            </div>
          )}
        </div>

        {/* Detailed Descriptions */}
        {hdData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-[12px] uppercase tracking-[2px] text-cyan-400 mb-4 font-bold">Strategy & Authority</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                <span className="font-semibold text-cyan-300">Strategy:</span> {hdData.strategy || 'Your unique way of making decisions'}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-cyan-300">Inner Authority:</span> {hdData.authority || 'Follow your emotional solar plexus'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-[12px] uppercase tracking-[2px] text-cyan-400 mb-4 font-bold">Profile & Purpose</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                <span className="font-semibold text-cyan-300">Profile:</span> {hdData.profile || '4/6 - Opportunist / Role Model'}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-semibold text-cyan-300">Incarnation Cross:</span> {hdData.incarnationCross || 'Your life purpose theme'}
              </p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default HumanDesign;