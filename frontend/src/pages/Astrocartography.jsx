import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X, Zap, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';
import L from 'leaflet';

// IMPORTANT: Ensure CSS is imported
import 'leaflet/dist/leaflet.css';
import '../styles/Astrocartography.css';

const Astrocartography = () => {
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const linesRef = useRef([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState(null);
  const [astrocartographyData, setAstrocartographyData] = useState(null);

  const planetColors = {
    Sun: '#FFD700', Moon: '#E0E0E0', Mercury: '#FFB347',
    Venus: '#90EE90', Mars: '#FF6347', Jupiter: '#DAA520',
    Saturn: '#A9A9A9', Uranus: '#87CEEB', Neptune: '#4169E1',
    Pluto: '#8B4513', Chiron: '#DDA0DD'
  };

  // Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.005 + 0.002;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0.1) this.speed = -this.speed;
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: (canvas.width * canvas.height) / 8000 }, () => new Star());
    };

    window.addEventListener('resize', resize);
    resize();
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => { star.update(); star.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Fetch Astro Data
  useEffect(() => {
    const fetchAstroData = async () => {
      if (!user?.birth?.date) { setLoading(false); return; }
      try {
        setLoading(true);
        const response = await astroAPI.getAstrocartography({
          date: user.birth.date, month: user.birth.month, year: user.birth.year,
          hour: user.birth.hour || 0, minute: user.birth.minute || 0,
          latitude: user.birth.latitude || 0, longitude: user.birth.longitude || 0,
          timezone: user.birth.timezone || 0, place: user.birth.place || 'Unknown'
        });
        if (response.data?.astrocartography?.lines) setAstrocartographyData(response.data);
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAstroData();
  }, [user]);

  // Map Initialization & Fix
  useEffect(() => {
    if (!mapRef.current || !astrocartographyData) return;

    // 1. Initialize Map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapInstanceRef.current);
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // 2. Fix rendering issue (grey box fix)
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // 3. Clear and Redraw Lines
    linesRef.current.forEach(line => map.removeLayer(line));
    linesRef.current = [];

    const lines = astrocartographyData.astrocartography?.lines || [];
    const boundsArray = [];

    lines.forEach((line) => {
      const { body, type, coordinates } = line;
      const color = planetColors[body] || '#FFFFFF';
      const latLonCoords = coordinates.map(coord => [coord[0], coord[1]]);
      latLonCoords.forEach(c => boundsArray.push(c));

      const polyline = L.polyline(latLonCoords, {
        color: color,
        weight: 3,
        opacity: 0.8,
        dashArray: (type === 'IC' || type === 'DSC') ? '8, 8' : undefined
      }).addTo(map);

      polyline.on('click', () => {
        setSelectedLine({
          body, type, color,
          title: `${body}'s ${type} Line`,
          description: `Your ${body} ${type} line represents where this planet's energy is at its peak strength.`
        });
      });
      linesRef.current.push(polyline);
    });

    // 4. Zoom map to show all lines
    if (boundsArray.length > 0) {
      const bounds = L.latLngBounds(boundsArray);
      map.fitBounds(bounds, { padding: [10, 10], animate: true });
    }
  }, [astrocartographyData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Zap className="animate-spin text-purple-500 mr-3" />
        <p className="text-purple-200 uppercase tracking-widest">Tracing the stars...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-350 mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight mb-2 mt-6">
            Astro<span className="text-purple-400">cartography</span>
          </h1>
          <p className="text-slate-400 text-lg">Your planetary influence lines mapped across the globe.</p>
        </div>

        {/* Layout: Map and Legend Side-by-Side */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* MAP CONTAINER - Fixed size square */}
          <div className="flex-1 relative">
            <div 
              ref={mapRef} 
              className="w-full aspect-square md:max-h-150 rounded-4xl border border-white/10 shadow-2xl overflow-hidden z-10 bg-slate-900"
            />
          </div>

          {/* SIDE LEGEND */}
          <div className="w-full xl:w-[320px] shrink-0">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-4xl p-8">
              <h3 className="text-xl font-semibold mb-6">Planet Lines</h3>
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-y-4">
                {Object.entries(planetColors).map(([planet, color]) => (
                  <div key={planet} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                    <span className="text-slate-300 text-sm uppercase tracking-widest">{planet}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="w-8 h-0.5 bg-white" />
                  <span>MC / ASC Energy</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="w-8 h-0.5 border-t border-dashed border-white" />
                  <span>IC / DSC Energy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      {selectedLine && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-9999 p-6">
          <div className="bg-[#111] border border-white/10 rounded-4xl p-8 max-w-md w-full animate-in zoom-in duration-200">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedLine.color }} />
                {selectedLine.body}
              </h2>
              <button onClick={() => setSelectedLine(null)}><X size={24} /></button>
            </div>
            <p className="text-slate-300 leading-relaxed mb-8">{selectedLine.description}</p>
            <button 
              onClick={() => setSelectedLine(null)}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Astrocartography;