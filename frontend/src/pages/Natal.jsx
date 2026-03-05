import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sun, Moon, Zap, Heart, Swords, Sparkles, Shield, 
  Radio, Droplets, Skull, ArrowUpRight, Crown, Compass, MoonStar, MapPin 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';
import NatalChartWheel from '../components/NatalChartWheel';

const Natal = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [planets, setPlanets] = useState([]);
  const [houses, setHouses] = useState([]);
  const [points, setPoints] = useState([]);
  const [ascendantData, setAscendantData] = useState(null);
  const [loading, setLoading] = useState(true);

  const planetIcons = {
    Sun: <Sun size={16} />,
    Moon: <Moon size={16} />,
    Mercury: <Zap size={16} />,
    Venus: <Heart size={16} />,
    Mars: <Swords size={16} />,
    Jupiter: <Sparkles size={16} />,
    Saturn: <Shield size={16} />,
    Uranus: <Radio size={16} />,
    Neptune: <Droplets size={16} />,
    Pluto: <Skull size={16} />
  };

  const elementMap = {
    Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
    Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
  };

  const houseAreas = [
    'Identity', 'Values', 'Intellect', 'Roots', 'Joy', 'Rituals',
    'Union', 'Legacy', 'Expansion', 'Status', 'Community', 'Karma'
  ];

  const getSignFromLongitude = (longitude) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor((longitude % 360) / 30);
    return signs[signIndex % 12] || 'Unknown';
  };

  useEffect(() => {
    const fetchNatalChart = async () => {
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

        const data = response.data?.data;
        const rawData = data?.rawData;

        const planetsData = data?.planets || rawData?.planets || [];
        if (Array.isArray(planetsData) && planetsData.length > 0) {
          const processedPlanets = planetsData.map(p => {
            const degree = p.full_degree || p.degree || p.longitude || 0;
            const sign = p.sign || getSignFromLongitude(degree);
            const deg = Math.floor(degree % 30);
            const min = Math.floor((degree % 1) * 60);
            const planetName = p.name || p.body || 'Unknown';
            return {
              name: planetName,
              sign: sign,
              full_degree: degree,
              deg: `${deg}° ${min}'`,
              icon: planetIcons[planetName] || <Sparkles size={16} />,
              el: elementMap[sign] || 'Unknown'
            };
          });

          const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
          processedPlanets.sort((a, b) => planetOrder.indexOf(a.name) - planetOrder.indexOf(b.name));
          setPlanets(processedPlanets);
        }

        let processedHouses = [];
        const housesData = rawData?.houses || data?.houses || [];
        if (Array.isArray(housesData) && housesData.length > 0) {
          processedHouses = housesData.slice(0, 12).map((h, idx) => ({
            id: idx + 1,
            sign: h.sign || getSignFromLongitude(h.longitude || 0),
            area: houseAreas[idx] || 'Unknown',
            longitude: h.longitude || 0
          }));
        }
        setHouses(processedHouses);

        const ascendantSign = data?.ascendant || rawData?.ascendant?.sign || 'Unknown';
        const ascendantDegree = rawData?.ascendant?.degree || (processedHouses[0]?.longitude || 0);
        setAscendantData({ sign: ascendantSign, degree: ascendantDegree });
        
        const mcSign = processedHouses[9]?.sign || 'Unknown';
        const mcLongitude = processedHouses[9]?.longitude || 0;
        
        setPoints([
          { name: "Ascendant (ASC)", sign: ascendantSign, deg: `${Math.floor(ascendantDegree % 30)}°`, icon: <ArrowUpRight size={16} />, desc: "The Persona", path: `/ascendant/${ascendantSign}` },
          { name: "Midheaven (MC)", sign: mcSign, deg: `${Math.floor(mcLongitude % 30)}°`, icon: <Crown size={16} />, desc: "Public Image", path: `/MC/${mcSign}` }
        ]);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNatalChart();
  }, [user]);

  // Background Star Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.01 + 0.002;
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0.1) this.speed = -this.speed;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: (canvas.width * canvas.height) / 8000 }, () => new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => { star.update(); star.draw(); });
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
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] relative overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto pt-40 pb-20 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-b from-white to-cosmic-primary bg-clip-text text-transparent uppercase tracking-tight">
            {loading ? 'Loading...' : 'Natal Architecture'}
          </h1>
          <p className="text-white/40 tracking-[0.3em] uppercase text-xs">A Blueprint of the Soul</p>
          <Link to="/astrocartography" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-cosmic-primary/20 hover:bg-cosmic-primary/40 border border-cosmic-primary/50 rounded-lg text-cosmic-primary hover:text-white transition-all">
            <MapPin size={18} /> View Astrocartography Map
          </Link>
        </div>

        <div className="mb-16 flex justify-center">
          {!loading && (
            <div className="w-full max-w-4xl">
              <NatalChartWheel planets={planets} houses={houses} ascendant={ascendantData} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Planets Table */}
          <section className="lg:col-span-8 bg-white/3 backdrop-blur-md border border-cosmic-primary/20 rounded-4xl p-8">
            <h3 className="text-cosmic-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8">Planetary Placements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] opacity-30 uppercase tracking-widest">
                    <th className="pb-4">Body</th>
                    <th className="pb-4">Sign</th>
                    <th className="pb-4">Degree</th>
                    <th className="pb-4">Element</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {planets.map((p) => (
                    <tr 
                      key={p.name} 
                      onClick={() => navigate(`/${p.name.toLowerCase()}/${p.sign}`)}
                      className="hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <td className="py-4 flex items-center gap-4">
                        <span className="text-cosmic-primary opacity-80 group-hover:scale-110 transition-transform">{p.icon}</span>
                        <span className="text-sm font-medium">{p.name}</span>
                      </td>
                      <td className="py-4 text-sm">{p.sign}</td>
                      <td className="py-4 text-sm font-mono text-amber-400/80">{p.deg}</td>
                      <td className="py-4 text-sm opacity-50">{p.el}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Houses List */}
          <section className="lg:col-span-4 bg-white/3 backdrop-blur-md border border-cosmic-primary/20 rounded-4xl p-8">
            <h3 className="text-cosmic-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8">The 12 Houses</h3>
            <div className="space-y-1">
              {houses.map((h) => (
                <div key={h.id} className="flex justify-between items-center py-3 border-b border-white/5">
                  <div className="flex gap-4 items-center">
                    <span className="text-cosmic-primary font-bold text-[10px] w-6">{h.id}H</span>
                    <span className="text-sm">{h.sign}</span>
                  </div>
                  <span className="text-[10px] opacity-30 italic tracking-wide">{h.area}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Points Table */}
        <section className="bg-white/3 backdrop-blur-md border border-cosmic-primary/20 rounded-4xl p-8">
          <h3 className="text-cosmic-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8">Celestial Thresholds</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] opacity-30 uppercase tracking-widest">
                  <th className="pb-4">Point</th>
                  <th className="pb-4">Sign</th>
                  <th className="pb-4">Position</th>
                  <th className="pb-4">Archetype</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {points.map((p) => (
                  <tr 
                    key={p.name} 
                    onClick={() => navigate(p.path)}
                    className="hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <td className="py-5 flex items-center gap-4">
                      <span className="text-amber-400/60 group-hover:scale-110 transition-transform">{p.icon}</span>
                      <span className="text-sm font-medium">{p.name}</span>
                    </td>
                    <td className="py-5 text-sm">{p.sign}</td>
                    <td className="py-5 text-sm font-mono opacity-80">{p.deg}</td>
                    <td className="py-5 text-[11px] opacity-40 uppercase tracking-tighter">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Natal;