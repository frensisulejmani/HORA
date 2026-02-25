import React, { useEffect, useRef } from 'react';
import { Compass, Sparkles, ShieldCheck, Users, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const canvasRef = useRef(null);

  // --- Star Animation System ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random(),
          speed: Math.random() * 0.01 + 0.002,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0.1) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
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

  const missionCards = [
    {
      icon: <Compass size={40} />,
      title: "Personalized Guidance",
      desc: "We use high-precision astronomical data to calculate your unique birth chart, providing insights into your Sun, Moon, and Ascendant signs with unparalleled accuracy."
    },
    {
      icon: <Sparkles size={40} />,
      title: "AI-Powered Insights",
      desc: "Our proprietary 'Hora AI' merges centuries of astrological texts with advanced natural language processing to answer your deepest life questions in real-time."
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Mindful Privacy",
      desc: "Your cosmic data is sacred. We ensure that your birth details and readings are encrypted and never shared with third parties."
    },
    {
      icon: <Users size={40} />,
      title: "Global Community",
      desc: "Join thousands of seekers. Whether you're a seasoned astrologer or just curious about your horoscope, Hora is a space for everyone to grow."
    }
  ];

  const stats = [
    { label: "Daily Horoscopes", value: "12k+" },
    { label: "Chart Accuracy", value: "99%" },
    { label: "Cosmic Seekers", value: "50k+" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden relative">
      {/* Background Layer */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none" />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cosmic-primary/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-0%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#3b82f6]/20 blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-20">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-b from-white to-cosmic-primary bg-clip-text text-transparent mb-6">
            Our Cosmic Purpose
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-lg leading-relaxed">
            Hora was founded on the belief that the stars are not just distant lights, but a map to understanding our inner selves. We bridge ancient wisdom with modern technology.
          </p>
        </section>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {missionCards.map((card, idx) => (
            <div 
              key={idx} 
              className="group p-10 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cosmic-primary/50 hover:bg-cosmic-primary/5 transition-all duration-500"
            >
              <div className="text-cosmic-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                {card.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">{card.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-around gap-12 py-12 border-y border-white/10 bg-white/2 backdrop-blur-sm rounded-3xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-4xl md:text-5xl font-bold text-cosmic-primary mb-2">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[3px] text-white/40 font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;