import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getImagePath = (name) => `/src/assets/${name.toLowerCase()}.png`;

const zodiacData = [
  { name: "Aries", date: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", date: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", date: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", date: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", date: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", date: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", date: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", date: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", date: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", date: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", date: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", date: "Feb 19 - Mar 20", element: "Water" }
];

const Zodiac = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
      {/* Background Layer */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto pt-40 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-b from-white to-blue-500 bg-clip-text text-transparent uppercase">
          The Twelve Signs
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-60 font-light mb-16">
          Explore the characteristics and celestial timing of the zodiac.
        </p>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {zodiacData.map((sign) => (
            <div 
              key={sign.name}
              className="group relative bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2.5 hover:border-purple-500 hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] cursor-pointer"
            >
              {/* Image Container */}
              <div className="mb-6 overflow-hidden rounded-xl">
                <Link to={`/sun/${sign.name}`}>
                  <img 
                    src={getImagePath(sign.name)} 
                    alt={sign.name}
                    className="w-full h-48 object-cover grayscale-30 brightness-[0.8] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
                  />
                </Link>
              </div>

               {/* Element Tag */}
              <div className="absolute top-4 right-4 bg-black/50 border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
                {sign.element}
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{sign.name}</h3>
              <p className="text-sm font-medium text-purple-400 uppercase tracking-widest">
                {sign.date}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Zodiac;