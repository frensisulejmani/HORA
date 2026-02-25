import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';

const Welcome = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starArray = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-cosmic-bg text-white">
      
      {/* Stars Background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-100 h-100 bg-purple-600/20 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-87.5 h-87.5 bg-violet-600/20 blur-[120px] rounded-full animate-pulse-slow" />

      {/* === Header=== */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-5 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Hora Logo" 
            className="w-10 h-10 object-cover rounded-full bg-cosmic-primary p-0.5" 
          />
          <span className="text-2xl font-bold tracking-tight">Hora</span>
        </div>

        <nav className="hidden md:flex gap-8 opacity-90 text-base">
          {/* Nav Links */}
          <a href="/login" className="hover:text-cosmic-primary transition-colors">Natal Chart</a>
          <a href="/login" className="hover:text-cosmic-primary transition-colors">Human Design</a>
          <a href="/login" className="hover:text-cosmic-primary transition-colors">Astrology AI</a>
        </nav>
        
        {/* Try Now Button */}
        <a href="/login">
            <button className="bg-cosmic-primary px-7 py-2.5 rounded-full text-base font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                Try Now
            </button>
        </a>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 text-center px-4 mt-25 md:mt-40 -translate-y-12">
        <h1 className="text-5xl md:text-5.5xl font-bold mb-3 tracking-tight">
          Cosmic Insights
        </h1>
        <p className="text-lg md:text-x0.5 opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover the mysteries of the universe through the ancient art of astrology.
        </p>
        
        {/* === Action Buttons === */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login">
                <button className="bg-cosmic-primary hover:scale-105 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all">
                    Explore Your Chart
                </button>
            </a>
            <a href="/login">
                <button className="border-2 border-cosmic-primary hover:bg-cosmic-primary/10 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all">
                    Navigate Your Day
                </button>
            </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;