import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sun, Moon, Zap, Heart, Swords, Sparkles, Shield, 
  Radio, Droplets, Skull, ArrowUpRight, Crown, MapPin,
  Star, Circle
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
    Sun:      <Sun size={16} />,
    Moon:     <Moon size={16} />,
    Mercury:  <Zap size={16} />,
    Venus:    <Heart size={16} />,
    Mars:     <Swords size={16} />,
    Jupiter:  <Sparkles size={16} />,
    Saturn:   <Shield size={16} />,
    Uranus:   <Radio size={16} />,
    Neptune:  <Droplets size={16} />,
    Pluto:    <Skull size={16} />,
    Chiron:   <Circle size={16} />,
    NorthNode:<ArrowUpRight size={16} />,
    Lilith:   <Star size={16} />,
  };

  const elementMap = {
    Aries: 'Fire',   Taurus: 'Earth',  Gemini: 'Air',   Cancer: 'Water',
    Leo: 'Fire',     Virgo: 'Earth',   Libra: 'Air',    Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
  };

  const houseAreas = [
    'Identity', 'Values', 'Intellect', 'Roots', 'Joy', 'Rituals',
    'Union', 'Legacy', 'Expansion', 'Status', 'Community', 'Karma'
  ];

  const PLANET_ORDER = [
    'Sun','Moon','Mercury','Venus','Mars',
    'Jupiter','Saturn','Uranus','Neptune','Pluto',
    'Chiron','NorthNode','Lilith'
  ];

  useEffect(() => {
    const fetchNatalChart = async () => {
      if (!user?.birth?.date) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get IANA timezone from browser — needed by the RapidAPI backend.
        // Falls back to whatever is stored on the user profile.
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezone = user.birth.timezone && String(user.birth.timezone).includes('/')
          ? user.birth.timezone
          : browserTimezone;

        const response = await astroAPI.getNatal({
          date:      user.birth.date,
          month:     user.birth.month,
          year:      user.birth.year,
          hour:      user.birth.hour   || 0,
          minute:    user.birth.minute || 0,
          latitude:  user.birth.latitude  || 0,
          longitude: user.birth.longitude || 0,
          timezone,
        });

        // Backend now returns: { message, data: { planets, houses, ascendant, source } }
        const data = response.data?.data;
        if (!data) throw new Error('No data returned from server');

        // ── Planets ──────────────────────────────────────────────────────────
        const rawPlanets = data.planets ?? [];
        const processedPlanets = rawPlanets
          .filter(p => p?.name)
          .map(p => {
            const deg     = p.full_degree ?? p.degree ?? 0;
            const sign    = p.sign || 'Unknown';
            const wholeDeg = Math.floor(deg % 30);
            const minutes  = Math.floor((deg % 1) * 60);
            return {
              name:        p.name,
              sign,
              full_degree: deg,
              deg:         `${wholeDeg}° ${String(minutes).padStart(2,'0')}'`,
              icon:        planetIcons[p.name] ?? <Sparkles size={16} />,
              el:          elementMap[sign] ?? 'Unknown',
            };
          })
          .sort((a, b) => PLANET_ORDER.indexOf(a.name) - PLANET_ORDER.indexOf(b.name));

        setPlanets(processedPlanets);

        // ── Houses ───────────────────────────────────────────────────────────
        // RapidAPI only returns Ascendant + MC in houses[].
        // Local fallback returns all 12. Handle both.
        const rawHouses = data.houses ?? [];
        let processedHouses = [];

        if (rawHouses.length >= 12) {
          // Full 12-house data (local VSOP87 fallback)
          processedHouses = rawHouses.slice(0, 12).map((h, idx) => ({
            id:        h.id ?? idx + 1,
            sign:      h.sign   ?? 'Unknown',
            area:      houseAreas[idx] ?? 'Unknown',
            longitude: h.longitude ?? 0,
          }));
        } else {
          // RapidAPI only gave us Ascendant + MC — build placeholder houses
          // using ascendant as H1 and distributing evenly (equal house approximation)
          const ascLng = data.ascendant?.longitude ?? 0;
          processedHouses = Array.from({ length: 12 }, (_, i) => {
            const lng = (ascLng + i * 30) % 360;
            const sign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                          'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(lng / 30) % 12];
            return { id: i + 1, sign, area: houseAreas[i], longitude: lng };
          });

          // Overwrite H10 with real MC if available
          const mcHouse = rawHouses.find(h => h.name === 'MC');
          if (mcHouse) {
            processedHouses[9] = {
              ...processedHouses[9],
              sign:      mcHouse.sign,
              longitude: mcHouse.longitude,
            };
          }
        }
        setHouses(processedHouses);

        // ── Ascendant ─────────────────────────────────────────────────────────
        const asc = data.ascendant ?? {};
        const ascSign   = asc.sign      ?? processedHouses[0]?.sign ?? 'Unknown';
        const ascDeg    = asc.longitude ?? processedHouses[0]?.longitude ?? 0;
        setAscendantData({ sign: ascSign, degree: ascDeg });

        // ── MC / Points ───────────────────────────────────────────────────────
        const mcData    = rawHouses.find(h => h.name === 'MC') ?? processedHouses[9];
        const mcSign    = mcData?.sign      ?? 'Unknown';
        const mcLng     = mcData?.longitude ?? 0;

        setPoints([
          {
            name: 'Ascendant (ASC)', sign: ascSign,
            deg:  `${Math.floor(ascDeg % 30)}°`,
            icon: <ArrowUpRight size={16} />,
            desc: 'The Persona',
            path: `/ascendant/${ascSign}`,
          },
          {
            name: 'Midheaven (MC)', sign: mcSign,
            deg:  `${Math.floor(mcLng % 30)}°`,
            icon: <Crown size={16} />,
            desc: 'Public Image',
            path: `/MC/${mcSign}`,
          },
        ]);

      } catch (err) {
        console.error('Natal chart fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNatalChart();
  }, [user]);

  // ── Star canvas animation ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 2;
        this.opacity = Math.random();
        this.speed   = Math.random() * 0.01 + 0.002;
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0.1) this.speed = -this.speed;
      }
      draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: Math.floor((canvas.width * canvas.height) / 8000) }, () => new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => { s.update(); s.draw(); });
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

  // ── Render ────────────────────────────────────────────────────────────────
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
          <Link
            to="/astrocartography"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-cosmic-primary/20 hover:bg-cosmic-primary/40 border border-cosmic-primary/50 rounded-lg text-cosmic-primary hover:text-white transition-all"
          >
            <MapPin size={18} /> View Astrocartography Map
          </Link>
        </div>

        {/* Chart Wheel */}
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

          {/* Houses */}
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

        {/* Points */}
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