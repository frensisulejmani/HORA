import React, { useEffect, useRef, useState } from 'react';
import { User, Briefcase, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { destinyAPI } from '../services/api';

const DestinyMatrix = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Destiny Matrix data
  useEffect(() => {
    const fetchDestinyMatrix = async () => {
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
            user.birth.date
          )
        ).toISOString();

        const response = await destinyAPI.calculateDestinyMatrix({
          name: user.name,
          birthDateISO,
          year: user.birth.year,
          month: user.birth.month,
          date: user.birth.date
        });

        if (response.data?.data) {
          setMatrixData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch Destiny Matrix:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinyMatrix();
  }, [user]);

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
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto pt-40 pb-20 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-b from-white to-purple-500 bg-clip-text text-transparent">
            Destiny Matrix
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Your birth date holds the code to your soul's purpose. Unlock your 22 Arcana.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Matrix Section */}
          <div className="flex justify-center items-center">
            {loading ? (
              <div className="relative w-full aspect-square max-w-125 flex justify-center items-center">
                <div className="text-white/60 text-xl">Calculating your Destiny Matrix...</div>
              </div>
            ) : matrixData ? (
              <DestinyMatrixVisualization data={matrixData} />
            ) : (
              <div className="relative w-full aspect-square max-w-125 flex justify-center items-center">
                <div className="text-white/60">Unable to calculate matrix. Please ensure your birth data is complete.</div>
              </div>
            )}
          </div>

          {/* Information Pane */}
          <div className="flex flex-col gap-6">
            <InfoCard 
              icon={<User size={24} />} 
              title="Personal Portrait" 
              desc="The central number (Soul Comfort Zone) represents your true self and the state in which your soul feels most at home. It influences how you recharge your energy."
            />
            
            <InfoCard 
              icon={<Briefcase size={24} />} 
              title="Money & Lineage" 
              desc="The right side of the matrix reveals your financial potential and karmic debts inherited from your paternal and maternal lines. Understand your flow of abundance."
            />
            
            <InfoCard 
              icon={<Heart size={24} />} 
              title="Love & Relations" 
              desc="The lower part of the matrix describes the ideal partner for you and the lessons you need to learn to build a harmonious, lasting relationship."
            />

            {loading && (
              <div className="mt-4 w-full py-4 text-center text-white/60">
                Calculating your Destiny Matrix...
              </div>
            )}
          </div>
        </div>

        {/* Instructive Image section */}
        <div className="mt-20 border-t border-white/5 pt-10 text-center opacity-80">
          <p className="mb-6 text-sm uppercase tracking-widest text-purple-400 font-bold">Mathematical Archetype</p>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Destiny Matrix Visualization Component
const DestinyMatrixVisualization = ({ data }) => {
  const matrixNums = data.matrixNumbers || {};
  const outerOct = matrixNums.outerOctagon || [];
  const innerSq = matrixNums.innerSquare || [];
  
  // Core numbers from calculations
  const lifePathNumber = data.lifePathNumber;
  const expressionNumber = data.expressionNumber;
  const soulUrgeNumber = data.soulUrgeNumber;
  const personalityNumber = data.personalityNumber;
  const birthdayNumber = data.birthdayNumber;
  
  // 3x3 Grid structure based on reference image:
  // Top-left | Top-center | Top-right
  // Mid-left | Center (Life Path) | Mid-right
  // Bot-left | Bot-center | Bot-right
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main 3x3 Grid */}
      <div className="bg-[#1a1a1a] rounded-lg border-2 border-purple-600 p-8 mb-8 shadow-2xl shadow-purple-500/20">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Row 1 */}
          <GridCell 
            value={innerSq[3]} 
            label="Expression" 
            size="lg" 
            color="purple" 
            description="Talents & Abilities"
          />
          <GridCell 
            value={outerOct[0]} 
            label="Personal Portrait" 
            size="xl" 
            color="yellow" 
            highlight={true}
            description="Your True Self"
          />
          <GridCell 
            value={innerSq[1]} 
            label="Soul Urge" 
            size="lg" 
            color="blue" 
            description="Your Desires"
          />
          
          {/* Row 2 */}
          <GridCell 
            value={outerOct[6]} 
            label="Maturity" 
            size="lg" 
            color="pink" 
            description="Growth Path"
          />
          <GridCell 
            value={lifePathNumber} 
            label="LIFE PATH" 
            size="xxl" 
            color="gold" 
            highlight={true}
            description="Your Journey"
          />
          <GridCell 
            value={outerOct[2]} 
            label="Challenge" 
            size="lg" 
            color="red" 
            description="Obstacles"
          />
          
          {/* Row 3 */}
          <GridCell 
            value={personalityNumber} 
            label="Personality" 
            size="lg" 
            color="green" 
            description="How You Appear"
          />
          <GridCell 
            value={outerOct[4]} 
            label="Hidden Passion" 
            size="lg" 
            color="orange" 
            description="True Calling"
          />
          <GridCell 
            value={innerSq[2]} 
            label="Destiny" 
            size="lg" 
            color="cyan" 
            description="Life Purpose"
          />
        </div>

        {/* Connection Lines Labels */}
        <div className="text-center text-xs text-gray-500 space-y-2 border-t border-purple-500/20 pt-6">
          {matrixNums.moneyLine && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-400">💰 Money Line:</span>
              <span className="text-green-300">{Array.isArray(matrixNums.moneyLine) ? matrixNums.moneyLine.join(' → ') : matrixNums.moneyLine}</span>
            </div>
          )}
          {matrixNums.loveLine && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-400">❤️ Love Line:</span>
              <span className="text-red-300">{Array.isArray(matrixNums.loveLine) ? matrixNums.loveLine.join(' → ') : matrixNums.loveLine}</span>
            </div>
          )}
          {(matrixNums.maleGenLine || matrixNums.femaleGenLine) && (
            <div className="flex items-center justify-center gap-4 text-xs">
              {matrixNums.maleGenLine && <span className="text-purple-300">👨 Male: {matrixNums.maleGenLine}</span>}
              {matrixNums.femaleGenLine && <span className="text-red-300">👩 Female: {matrixNums.femaleGenLine}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Core Numbers Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <NumberCard 
          title="Expression" 
          value={expressionNumber} 
          color="purple"
          desc="Natural talents"
        />
        <NumberCard 
          title="Soul Urge" 
          value={soulUrgeNumber} 
          color="blue"
          desc="Inner desires"
        />
        <NumberCard 
          title="Personality" 
          value={personalityNumber} 
          color="green"
          desc="Appearance"
        />
        <NumberCard 
          title="Life Path" 
          value={lifePathNumber} 
          color="gold"
          desc="Your journey"
        />
        <NumberCard 
          title="Birthday" 
          value={birthdayNumber} 
          color="orange"
          desc="Innate talent"
        />
        <NumberCard 
          title="Destiny" 
          value={innerSq[2]} 
          color="cyan"
          desc="Life purpose"
        />
      </div>

      {/* Octagon Positions */}
      <div className="mt-8 bg-[#1a1a1a] rounded-lg border border-purple-500/30 p-6">
        <h3 className="text-purple-400 font-bold mb-4 uppercase text-sm">Octagon Influences (8 Positions)</h3>
        <div className="grid grid-cols-4 gap-3">
          {outerOct.map((num, idx) => (
            <div key={idx} className="bg-purple-500/10 border border-purple-500/50 rounded-lg p-3 text-center">
              <div className="text-purple-300 font-bold text-lg">{num}</div>
              <div className="text-xs text-gray-500">Position {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Grid Cell Component
const GridCell = ({ value, label, size = 'md', color = 'white', highlight = false, description }) => {
  const sizeClasses = {
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl',
    xxl: 'w-40 h-40 text-5xl'
  };

  const colorClasses = {
    blue: 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-blue-500/20',
    red: 'bg-red-500/15 border-red-500 text-red-300 shadow-red-500/20',
    purple: 'bg-purple-500/15 border-purple-500 text-purple-300 shadow-purple-500/20',
    yellow: 'bg-yellow-500/15 border-yellow-500 text-yellow-300 shadow-yellow-500/20',
    orange: 'bg-orange-500/15 border-orange-500 text-orange-300 shadow-orange-500/20',
    green: 'bg-green-500/15 border-green-500 text-green-300 shadow-green-500/20',
    pink: 'bg-pink-500/15 border-pink-500 text-pink-300 shadow-pink-500/20',
    cyan: 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-cyan-500/20',
    gold: 'bg-yellow-600/25 border-yellow-400 text-yellow-200 shadow-yellow-600/30'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        ${sizeClasses[size]} ${colorClasses[color]}
        rounded-lg border-2 flex flex-col items-center justify-center
        font-bold transition-all shadow-lg
        ${highlight ? 'ring-2 ring-yellow-400/50' : ''}
      `}>
        <div>{value}</div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-gray-300">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  );
};

// Number Card Component
const NumberCard = ({ title, value, color, desc }) => {
  const colorClasses = {
    blue: 'border-blue-500 text-blue-400',
    red: 'border-red-500 text-red-400',
    green: 'border-green-500 text-green-400',
    cyan: 'border-cyan-500 text-cyan-400',
    gold: 'border-yellow-400 text-yellow-300',
    purple: 'border-purple-500 text-purple-400',
    orange: 'border-orange-500 text-orange-400',
    pink: 'border-pink-500 text-pink-400'
  };

  return (
    <div className={`bg-[#0f0f0f] rounded-lg border ${colorClasses[color]} p-4`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase opacity-80">{title}</div>
      <div className="text-xs opacity-60 mt-1">{desc}</div>
    </div>
  );
};

const InfoCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-purple-500/20 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
    <div className="flex items-center gap-3 mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">
      {icon}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-sm leading-relaxed opacity-70 group-hover:opacity-90 transition-opacity">
      {desc}
    </p>
  </div>
);

export default DestinyMatrix;