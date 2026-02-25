import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Flame, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import starMatcherImg from '../assets/starmatcher.png';

const Games = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  //--- Game and Quiz Data ---
  const games = [
    {
      id: 'star-matcher',
      title: 'Star Matcher',
      tag: 'Featured',
      desc: 'Connect constellations and unlock your daily fortune through celestial alignment.',
      image: starMatcherImg,
      link: '/star-matcher'
    },
    {
      id: 'zodiac-quest',
      title: 'Zodiac Quest',
      tag: 'New Adventure',
      desc: 'A narrative adventure based on your unique natal chart placements and cosmic path.',
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2000&auto=format&fit=crop',
      link: '/zodiac-quest'
    }
  ];

  const quizzes = [
    {
      title: 'What is your Moon Energy?',
      icon: <Moon size={24} />,
      info: '10 Questions • 5 Mins',
      link: '/moon-energy-quiz'
    },
    {
      title: 'Discover your Soul Element',
      icon: <Flame size={24} />,
      info: '8 Questions • 3 Mins',
      link: '/soul-element-quiz'
    },
    {
      title: 'Your Past Life Career',
      icon: <Sparkles size={24} />,
      info: '12 Questions • 6 Mins',
      link: '/past-life-career-quiz'
    }
  ];

  // --- Star Field Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.005 + 0.002
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, s.opacity)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
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

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden relative">
      {/* Background Star Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-300 mx-auto pt-40 pb-20 px-6">
        {/* Header Section */}
        <header className="mb-12 text-left">
          <h1 className="text-5xl md:text-6xl font-bold m-0 bg-linear-to-r from-white to-cosmic-primary bg-clip-text text-transparent">
            Cosmic Arcade
          </h1>
          <p className="opacity-60 text-lg mt-3">Interactive experiences to align your energy.</p>
        </header>

        {/* Featured Games Section */}
        <div className="flex flex-col gap-10 mb-24">
          {games.map((game) => (
            <button 
              key={game.id} 
              onClick={() => navigate(game.link)}
              className="group flex flex-col md:flex-row justify-between items-center bg-linear-to-r from-[#141419] to-[#a855f71a] border border-[#a855f74d] rounded-[40px] min-h-60 overflow-hidden transition-all duration-500 hover:border-cosmic-primary hover:translate-x-2 cursor-pointer shadow-2xl"
            >
              <div className="flex-1 py-10 px-8 md:px-16 text-center md:text-left flex flex-col justify-center">
                {game.tag && (
                  <div className="mb-4">
                    <span className="bg-cosmic-primary text-white py-1.5 px-5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                      {game.tag}
                    </span>
                  </div>
                )}
                <h3 className="text-4xl font-bold text-white m-0 group-hover:text-cosmic-primary transition-all duration-300">
                  {game.title}
                </h3>
                <p className="mt-4 mb-0 opacity-50 text-base leading-relaxed max-w-md">
                  {game.desc}
                </p>
              </div>
              
              <div className="w-full md:w-1/2 h-60 md:h-60 relative overflow-hidden mask-gradient">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Quizzes Section */}
        <header className="mb-8 text-left">
          <h1 className="text-4xl md:text-5xl font-bold m-0 bg-linear-to-r from-white to-cosmic-primary bg-clip-text text-transparent">
            Mystical Quizzes
          </h1>
          <p className="opacity-60 text-lg mt-3">Short tests to reveal hidden truths about your personality.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <button 
              key={index} 
              onClick={() => navigate(quiz.link)}
              className="flex items-center gap-5 bg-white/5 border border-[#a855f74d] p-8 rounded-[30px] transition-all duration-300 hover:bg-[#a855f714] hover:-translate-y-2 cursor-pointer"
            >
              <div className="min-w-16 h-16 bg-[#a855f71a] rounded-[18px] flex items-center justify-center text-cosmic-primary shadow-inner">
                {quiz.icon}
              </div>
              <div className="flex flex-col text-left">
                <h4 className="m-0 text-xl font-medium text-white">{quiz.title}</h4>
                <span className="text-xs opacity-40 mt-1 uppercase tracking-widest font-bold">
                  {quiz.info}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .mask-gradient {
          -webkit-mask-image: linear-gradient(to top, #000 60%, transparent);
        }
        @media (min-width: 768px) {
          .mask-gradient {
            -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Games;