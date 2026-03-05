import React, { useEffect, useRef, useState } from 'react';
import { User, Briefcase, Heart, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { destinyAPI } from '../services/api';

const DestinyMatrix = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Background Star Field Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.005 + 0.002;
      }
      draw() {
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`; // Purple tint stars
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
      stars = Array.from({ length: 150 }, () => new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => { star.update(); star.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    init(); animate();
    window.addEventListener('resize', init);
    return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationFrameId); };
  }, []);

  // Data Fetching
  useEffect(() => {
    const fetchMatrix = async () => {
      if (!user?.birth?.date) { setLoading(false); return; }
      try {
        const birthDateISO = new Date(Date.UTC(user.birth.year, user.birth.month - 1, user.birth.date)).toISOString();
        const response = await destinyAPI.calculateDestinyMatrix({ name: user.name, birthDateISO });
        if (response.data?.data) setMatrixData(response.data.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchMatrix();
  }, [user]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5]">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        <header className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">
            Universal Architecture
          </div>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter mb-4 text-white">
            Destiny <span className="text-purple-500 italic">Matrix</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Your birth code mapped onto the 22 Arcana system. Discover the geometric flow of your karma and potential.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual SVG Matrix */}
          <div className="lg:col-span-7 flex justify-center">
            {loading ? (
              <div className="animate-pulse text-purple-400/50 font-mono tracking-widest">DECODING_MATRIX...</div>
            ) : (
              <MatrixGeometry data={matrixData} />
            )}
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-purple-500 font-bold mb-4">Core Archetypes</h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricBox title="Life Path" val={matrixData?.lifePathNumber} />
              <MetricBox title="Soul Urge" val={matrixData?.soulUrgeNumber} />
            </div>
            
            <div className="pt-6 space-y-4">
              <InfoCard icon={<Zap size={18}/>} title="Personal Portrait" desc="The central pivot of your matrix. This number represents your comfort zone and where your soul recharges." />
              <InfoCard icon={<Briefcase size={18}/>} title="Material Flow" desc="The right-hand line of the matrix dictates how abundance flows into your reality based on your lineage." />
              <InfoCard icon={<Heart size={18}/>} title="Karmic Lessons" desc="The bottom nodes highlight the love and relationship patterns you are here to master." />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const MatrixGeometry = ({ data }) => {
  if (!data) return null;
  const { outerOctagon, innerSquare } = data.matrixNumbers;

  return (
    <div className="relative w-full max-w-137.5 p-8 rounded-[3rem] bg-white/2 border border-white/10 backdrop-blur-3xl shadow-2xl">
      <svg viewBox="0 0 500 500" className="w-full h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
        {/* Connection Lines (Ancestral/Karma) */}
        <line x1="100" y1="100" x2="400" y2="400" stroke="rgba(168, 85, 247, 0.2)" strokeDasharray="4 4" />
        <line x1="400" y1="100" x2="100" y2="400" stroke="rgba(168, 85, 247, 0.2)" strokeDasharray="4 4" />
        
        {/* Ancestral Square (Diagonal) */}
        <rect x="125" y="125" width="250" height="250" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" transform="rotate(45 250 250)" />
        
        {/* Personal Square (Straight) */}
        <rect x="100" y="100" width="300" height="300" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />

        {/* Outer Nodes (Octagon) */}
        <Node x={250} y={50} val={outerOctagon[0]} label="Personal" color="#A855F7" />
        <Node x={450} y={250} val={outerOctagon[2]} label="Money" color="#A855F7" />
        <Node x={250} y={450} val={outerOctagon[4]} label="Karma" color="#A855F7" />
        <Node x={50} y={250} val={outerOctagon[6]} label="Birth" color="#A855F7" />

        {/* Ancestral Nodes (Corners) */}
        <Node x={100} y={100} val={innerSquare[0]} isSmall />
        <Node x={400} y={100} val={innerSquare[1]} isSmall />
        <Node x={400} y={400} val={innerSquare[2]} isSmall />
        <Node x={100} y={400} val={innerSquare[3]} isSmall />

        {/* Central Soul Pivot */}
        <circle cx="250" cy="250" r="35" fill="#0a0a0a" stroke="#A855F7" strokeWidth="2" />
        <text x="250" y="262" textAnchor="middle" fill="white" className="text-3xl font-bold font-sans">{data.lifePathNumber}</text>
      </svg>
      
      <div className="mt-8 flex justify-center gap-6">
        <div className="text-[10px] text-purple-400 font-mono">MONEY LINE: {data.matrixNumbers.moneyLine?.join(' → ')}</div>
        <div className="text-[10px] text-pink-400 font-mono">LOVE LINE: {data.matrixNumbers.loveLine?.join(' → ')}</div>
      </div>
    </div>
  );
};

const Node = ({ x, y, val, color = "#fff", isSmall = false }) => (
  <g>
    <circle cx={x} cy={y} r={isSmall ? 14 : 20} fill="#050505" stroke={color} strokeWidth={isSmall ? 1 : 2} />
    <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize={isSmall ? "10" : "14"} className="font-bold">{val}</text>
  </g>
);

const MetricBox = ({ title, val }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{title}</div>
    <div className="text-2xl font-light text-white">{val || '--'}</div>
  </div>
);

const InfoCard = ({ icon, title, desc }) => (
  <div className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-purple-500/30 transition-all group">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-purple-500">{icon}</div>
      <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">{title}</h4>
    </div>
    <p className="text-xs leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors">{desc}</p>
  </div>
);

export default DestinyMatrix;