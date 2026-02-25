import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Info, X, Zap, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';
import L from 'leaflet';
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

  // Personalized line meanings based on planet and type
  const getLineDescription = (body, type) => {
    const descriptions = {
      MC: {
        Sun: 'Your solar MC line amplifies career achievements and public recognition. Travel here to maximize visibility and professional success.',
        Moon: 'Your lunar MC line enhances emotional fulfillment through professional pursuits. Great for nurturing careers and public care roles.',
        Mercury: 'Your Mercury MC line boosts communication in your career. Excellent for writing, speaking, and intellectual pursuits.',
        Venus: 'Your Venus MC line brings harmony and grace to your public image. Perfect for creative careers and building partnerships.',
        Mars: 'Your Mars MC line charges your ambition and drive. Ideal for competitive fields and taking bold professional actions.',
        Jupiter: 'Your Jupiter MC line expands opportunities and luck in career matters. A zone of growth and prosperous ventures.',
        Saturn: 'Your Saturn MC line builds lasting structures and authority. Best for serious work and establishing your legacy.',
        Uranus: 'Your Uranus MC line brings innovation to your career. Great for revolutionary work and breaking new ground.',
        Neptune: 'Your Neptune MC line enhances creativity and spirituality in your profession. Ideal for artistic and visionary careers.',
        Pluto: 'Your Pluto MC line intensifies power and transformation in your career. A zone of deep impact and profound change.',
        Chiron: 'Your Chiron MC line heals through your profession. Excellent for therapeutic and teaching careers.'
      },
      IC: {
        Sun: 'Your solar IC line strengthens family bonds and home security. Travel here to deepen family connections and personal foundations.',
        Moon: 'Your lunar IC line heightens emotional comfort at home. A sanctuary for inner peace and family harmony.',
        Mercury: 'Your Mercury IC line improves communication within family. Excellent for resolving family matters and staying connected.',
        Venus: 'Your Venus IC line brings love and beauty to your home. Perfect for creating a harmonious living space and family relationships.',
        Mars: 'Your Mars IC line energizes your home and family matters. Good for handling family conflicts and protecting your foundation.',
        Jupiter: 'Your Jupiter IC line expands family blessings and prosperity at home. A zone of abundance in domestic matters.',
        Saturn: 'Your Saturn IC line solidifies family responsibilities and roots. Important for establishing lasting family traditions.',
        Uranus: 'Your Uranus IC line brings innovation to your home life. Great for unique living situations and family reforms.',
        Neptune: 'Your Neptune IC line connects you spiritually to your roots. Ideal for ancestral healing and spiritual home practices.',
        Pluto: 'Your Pluto IC line deepens family transformation. A zone for healing family patterns and rebuilding foundations.',
        Chiron: 'Your Chiron IC line heals family wounds. Perfect for family therapy and emotional healing work.'
      },
      ASC: {
        Sun: 'Your solar ASC line showcases your true self and vitality. Travel here to experience personal awakening and self-expression.',
        Moon: 'Your lunar ASC line enhances your intuition and emotional sensitivity. A zone for personal growth and emotional awareness.',
        Mercury: 'Your Mercury ASC line sharpens your thinking and communication. Great for intellectual development and learning.',
        Venus: 'Your Venus ASC line brings grace and charm to your personality. Perfect for attracting positive relationships and opportunities.',
        Mars: 'Your Mars ASC line activates your courage and assertiveness. Excellent for building confidence and taking action.',
        Jupiter: 'Your Jupiter ASC line expands your luck and opportunities. A zone of personal growth and new possibilities.',
        Saturn: 'Your Saturn ASC line strengthens your discipline and maturity. Important for personal responsibility and spiritual development.',
        Uranus: 'Your Uranus ASC line awakens your unique potential. Great for personal innovation and authentic self-discovery.',
        Neptune: 'Your Neptune ASC line enhances your spiritual and creative gifts. Ideal for meditation and artistic development.',
        Pluto: 'Your Pluto ASC line intensifies your personal transformation. A zone for profound self-reinvention and empowerment.',
        Chiron: 'Your Chiron ASC line facilitates self-healing. Perfect for personal therapy and wholeness journey.'
      },
      DSC: {
        Sun: 'Your solar DSC line attracts significant partnerships and collaborations. Travel here to meet powerful allies and soulmates.',
        Moon: 'Your lunar DSC line brings emotional depth to relationships. A zone for nurturing and emotionally fulfilling partnerships.',
        Mercury: 'Your Mercury DSC line enhances communication in relationships. Great for meeting intellectually compatible partners.',
        Venus: 'Your Venus DSC line magnetizes love and harmonious relationships. The ultimate zone for romance and partnership.',
        Mars: 'Your Mars DSC line brings passion and dynamic energy to relationships. Perfect for meeting active and assertive partners.',
        Jupiter: 'Your Jupiter DSC line expands your circle and brings fortunate connections. A zone of social abundance and opportunity.',
        Saturn: 'Your Saturn DSC line attracts committed and serious partnerships. Important for long-term relationship building.',
        Uranus: 'Your Uranus DSC line attracts unconventional and unique relationships. Great for meeting progressive partners.',
        Neptune: 'Your Neptune DSC line connects you spiritually with others. Ideal for spiritual partnerships and soulmate connections.',
        Pluto: 'Your Pluto DSC line intensifies passion and deep transformation through relationships. A zone of powerful partnerships.',
        Chiron: 'Your Chiron DSC line attracts healing relationships. Perfect for meeting partners who facilitate mutual growth.'
      }
    };

    return descriptions[type]?.[body] || `Your ${body} ${type} line carries unique astrological significance for this area of life.`;
  };

  const getLineTitle = (body, type) => {
    return `${body}'s ${type} Line`;
  };

  const planetColors = {
    Sun: '#FFD700',
    Moon: '#E0E0E0',
    Mercury: '#FFB347',
    Venus: '#90EE90',
    Mars: '#FF6347',
    Jupiter: '#DAA520',
    Saturn: '#A9A9A9',
    Uranus: '#87CEEB',
    Neptune: '#4169E1',
    Pluto: '#8B4513',
    Chiron: '#DDA0DD'
  };

  // Canvas background animation
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

    const resize = () => {
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

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Fetch astrocartography data
  useEffect(() => {
    const fetchAstrocartographyData = async () => {
      if (!user?.birth?.date) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await astroAPI.getAstrocartography({
          date: user.birth.date,
          month: user.birth.month,
          year: user.birth.year,
          hour: user.birth.hour || 0,
          minute: user.birth.minute || 0,
          latitude: user.birth.latitude || 0,
          longitude: user.birth.longitude || 0,
          timezone: user.birth.timezone || 0,
          place: user.birth.place || 'Unknown'
        });

        if (response.data?.astrocartography?.lines) {
          setAstrocartographyData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch astrocartography:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrocartographyData();
  }, [user]);

  // Initialize map and draw lines
  useEffect(() => {
    if (!mapRef.current || !astrocartographyData) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        worldCopyJump: false
      }).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing lines
    linesRef.current.forEach(line => map.removeLayer(line));
    linesRef.current = [];

    // Draw astrocartography lines and collect bounds
    const lines = astrocartographyData.astrocartography?.lines || [];
    const boundsArray = [];
    
    lines.forEach((line, idx) => {
      const { body, type, coordinates } = line;
      const color = planetColors[body] || '#FFFFFF';
      
      // Convert coordinates to [lat, lon] format for Leaflet
      const latLonCoords = coordinates.map(coord => [coord[0], coord[1]]);
      
      // Add all coordinates to bounds
      latLonCoords.forEach(coord => boundsArray.push(coord));
      
      // Create polyline
      const polyline = L.polyline(latLonCoords, {
        color: color,
        weight: 2,
        opacity: 0.7,
        dashArray: type === 'IC' || type === 'DSC' ? '5, 5' : undefined
      }).addTo(map);

      // Add hover effects and click event
      polyline.on('click', () => {
        setSelectedLine({
          body,
          type,
          color,
          title: getLineTitle(body, type),
          description: getLineDescription(body, type)
        });
      });

      polyline.on('mouseover', function() {
        this.setStyle({
          weight: 4,
          opacity: 1
        });
        this.bringToFront();
      });

      polyline.on('mouseout', function() {
        this.setStyle({
          weight: 2,
          opacity: 0.7
        });
      });

      linesRef.current.push(polyline);
    });

    // Fit map bounds to lines
    if (boundsArray.length > 0) {
      const bounds = L.latLngBounds(boundsArray);
      map.fitBounds(bounds, { 
        padding: [100, 100],
        maxZoom: 3,
        animate: true,
        duration: 0.5
      });
    }
  }, [astrocartographyData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Navbar />
        <div className="text-white text-center">
          <Zap className="animate-spin mx-auto mb-4" size={40} />
          <p>Loading your astrocartography map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[5%] -right-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/15 blur-[120px]" />
      </div>

      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <MapPin size={32} className="text-purple-400" />
            Astrocartography Map
          </h1>
          <p className="text-slate-300">
            Tap on the lines to discover where your planets are strongest. Each colored line represents a different planet's power zones across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div 
              ref={mapRef} 
              className="w-full rounded-lg shadow-lg overflow-hidden border-2 border-purple-500/30 relative"
              style={{ height: '400px', zIndex: 10 }}
            />
          </div>

          {/* Legend */}
          <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Planet Lines</h3>
            <div className="space-y-3">
              {Object.entries(planetColors).map(([planet, color]) => (
                <div key={planet} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-200 text-sm">{planet}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">Line Types:</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-white" />
                  <span>MC/ASC Lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-white" style={{ backgroundImage: 'linear-gradient(90deg, white 50%, transparent 50%)', backgroundSize: '4px' }} />
                  <span>IC/DSC Lines</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Information Modal */}
        {selectedLine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-8 max-w-md w-full border border-purple-500/30 shadow-2xl relative z-[10000]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: selectedLine.color }}
                  />
                  {selectedLine.body}
                </h2>
                <button
                  onClick={() => setSelectedLine(null)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <div className="inline-block bg-purple-600/30 border border-purple-500/50 rounded-full px-3 py-1 mb-4">
                  <span className="text-sm font-semibold text-purple-200">
                    {selectedLine.type} Line
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  {selectedLine.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {selectedLine.description}
                </p>
              </div>

              <div className="bg-slate-700/50 rounded p-4 mb-6 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-300">
                    This is your personal <span className="font-semibold text-purple-300">{selectedLine.body}</span> power zone. Travel here to activate and harness this planetary energy.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLine(null)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Astrocartography;
