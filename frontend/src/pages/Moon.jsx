import React, { useEffect, useRef, useState } from 'react';
import { Waves, Anchor, Sparkle, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Moon = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [moonSign, setMoonSign] = useState('Cancer');
  const [loading, setLoading] = useState(true);

  // Fetch user's moon sign
  useEffect(() => {
    const fetchMoonSign = async () => {
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

        if (response.data?.data?.moonSign) {
          setMoonSign(response.data.data.moonSign);
        }
      } catch (err) {
        console.error('Failed to fetch moon sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoonSign();
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
    <div className="relative min-h-screen bg-[#030308] text-[#f5f5f5] overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto pt-36 pb-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="text-8xl mb-4 inline-block drop-shadow-[0_0_20px_rgba(129,140,248,0.5)] animate-bounce-slow">
            🌙
          </div>
          <span className="block text-[#818cf8] uppercase tracking-[0.3em] text-sm mb-2">
            The Emotional Core
          </span>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider bg-linear-to-b from-white to-[#818cf8] bg-clip-text text-transparent">
            {loading ? 'Loading...' : `${moonSign} Moon`}
          </h1>
          <p className="mt-6 opacity-60 max-w-xl mx-auto text-lg leading-relaxed">
            {loading ? 'Calculating your Moon Sign...' : 'The Moon governs your private self, your instincts, and how you nurture yourself. It is your emotional compass.'}
          </p>
        </section>

        {/* Content Stack */}
        <div className="space-y-8">
          
          {/* Inner Landscape */}
          {!loading && (
            <>
              <GlassPanel icon={<Waves className="text-[#818cf8]" />} title="Inner Landscape">
                <p>
                  {getMoonSignDescription(moonSign)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <TraitItem label="Needs" value={getMoonSignNeeds(moonSign)} />
                  <TraitItem label="Style" value={getMoonSignStyle(moonSign)} />
                  <TraitItem label="Element" value={getMoonSignElement(moonSign)} />
                </div>
              </GlassPanel>

              {/* Emotional Habits */}
              <GlassPanel icon={<Anchor className="text-[#818cf8]" />} title="Emotional Habits">
                <p className="mb-6">
                  {getMoonSignHabits(moonSign)}
                </p>
              </GlassPanel>

              {/* Self Nurture */}
              <GlassPanel icon={<Sparkle className="text-[#818cf8]" />} title="How to Nurture Yourself">
                <p>
                  {getMoonSignNurture(moonSign)}
                </p>
              </GlassPanel>
            </>
          )}

        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Sub-components for cleaner structure
const GlassPanel = ({ icon, title, children }) => (
  <div className="relative overflow-hidden bg-white/3 backdrop-blur-xl border border-[#818cf8]/30 rounded-[30px] p-8 md:p-12 transition-all hover:border-[#818cf8]/50">
    <div className="absolute top-0 left-0 w-full h-full bg-radial-moon opacity-20 pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        {icon}
        <h2 className="text-xl font-semibold tracking-wide text-[#e0e7ff]">{title}</h2>
      </div>
      <div className="text-[#f5f5f5] opacity-85 leading-relaxed text-lg">
        {children}
      </div>
    </div>
  </div>
);

const TraitItem = ({ label, value }) => (
  <div className="bg-white/2 border border-white/5 rounded-2xl p-5 text-center transition-transform hover:scale-105">
    <span className="block text-[0.7rem] uppercase tracking-widest opacity-40 mb-1">{label}</span>
    <span className="block text-lg font-semibold text-[#818cf8]">{value}</span>
  </div>
);

// Helper functions for moon sign data
function getMoonSignDescription(sign) {
  const descriptions = {
    Aries: 'With the Moon in Aries, your emotions are fiery, immediate, and action-oriented. You feel things intensely and react quickly, often before fully processing your feelings. Your emotional nature is bold and direct, and you need to express your feelings immediately rather than letting them simmer.',
    Taurus: 'With the Moon in Taurus, your emotions are stable, sensual, and deeply connected to physical comfort. You find emotional security through material stability and the pleasures of the senses. Your feelings are steady and consistent, and you need time to process emotions before reacting.',
    Gemini: 'With the Moon in Gemini, your emotions are changeable, intellectual, and expressed through communication. You process feelings by talking about them and need mental stimulation to feel emotionally satisfied. Your moods can shift quickly, and you may struggle with emotional depth.',
    Cancer: 'With the Moon in Cancer, its home sign, your emotions are deep, intuitive, and highly sensitive. You experience the world through your feelings, often picking up on the unspoken moods of others before they even realize it. Your inner world is a sanctuary that you guard closely.',
    Leo: 'With the Moon in Leo, your emotions are dramatic, warm, and expressed with flair. You feel things intensely and need recognition and appreciation for your emotional expressions. Your heart is generous and loyal, but you need to feel special and valued.',
    Virgo: 'With the Moon in Virgo, your emotions are practical, analytical, and expressed through service. You process feelings by analyzing them and may struggle with emotional expression. You find emotional security through being useful and organized.',
    Libra: 'With the Moon in Libra, your emotions are balanced, harmonious, and expressed through relationships. You need partnership and harmony to feel emotionally fulfilled. You may struggle with making decisions and may avoid conflict to maintain peace.',
    Scorpio: 'With the Moon in Scorpio, your emotions are intense, deep, and transformative. You feel things with incredible depth and intensity, and you\'re drawn to emotional transformation. You may be secretive about your feelings and need to process emotions in private.',
    Sagittarius: 'With the Moon in Sagittarius, your emotions are optimistic, freedom-loving, and expressed through adventure. You need freedom and expansion to feel emotionally satisfied. Your feelings are honest and direct, and you may struggle with emotional commitment.',
    Capricorn: 'With the Moon in Capricorn, your emotions are controlled, practical, and expressed through achievement. You may struggle with emotional expression and find security through structure and responsibility. You process feelings slowly and may seem emotionally distant.',
    Aquarius: 'With the Moon in Aquarius, your emotions are detached, independent, and expressed through innovation. You need freedom and intellectual stimulation to feel emotionally satisfied. You may struggle with emotional intimacy and prefer friendships over deep emotional connections.',
    Pisces: 'With the Moon in Pisces, your emotions are intuitive, compassionate, and deeply connected to the spiritual realm. You feel things with incredible depth and may absorb the emotions of others. You need creative and spiritual outlets to process your feelings.'
  };
  return descriptions[sign] || 'Your Moon sign influences your emotional nature and inner world.';
}

function getMoonSignNeeds(sign) {
  const needs = {
    Aries: 'Action', Taurus: 'Security', Gemini: 'Communication', Cancer: 'Security',
    Leo: 'Recognition', Virgo: 'Order', Libra: 'Harmony', Scorpio: 'Depth',
    Sagittarius: 'Freedom', Capricorn: 'Structure', Aquarius: 'Independence', Pisces: 'Compassion'
  };
  return needs[sign] || 'Balance';
}

function getMoonSignStyle(sign) {
  const styles = {
    Aries: 'Direct', Taurus: 'Steady', Gemini: 'Changeable', Cancer: 'Nurturing',
    Leo: 'Dramatic', Virgo: 'Practical', Libra: 'Harmonious', Scorpio: 'Intense',
    Sagittarius: 'Optimistic', Capricorn: 'Controlled', Aquarius: 'Detached', Pisces: 'Intuitive'
  };
  return styles[sign] || 'Balanced';
}

function getMoonSignElement(sign) {
  const elements = {
    Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
    Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
  };
  return elements[sign] || 'Unknown';
}

function getMoonSignHabits(sign) {
  const habits = {
    Aries: 'You process emotions quickly and need immediate outlets for your feelings. When stressed, you may become impulsive or aggressive. Regular physical activity helps you manage your emotional energy.',
    Taurus: 'You find comfort in the familiar and need stability to feel emotionally secure. When stressed, you may become stubborn or possessive. Creating a comfortable, beautiful environment helps you feel balanced.',
    Gemini: 'You process emotions through communication and need mental stimulation. When stressed, you may become scattered or anxious. Talking through your feelings and staying mentally engaged helps you process emotions.',
    Cancer: 'You find comfort in the familiar—nostalgia, home-cooked meals, and long-standing traditions. When stressed, your instinct is to retreat into your "shell" to process your feelings in private. You are incredibly loyal, but you can be prone to mood swings that follow the literal cycles of the moon.',
    Leo: 'You need recognition and appreciation to feel emotionally fulfilled. When stressed, you may become dramatic or attention-seeking. Creative expression and feeling valued help you process emotions.',
    Virgo: 'You process emotions by analyzing them and may struggle with emotional expression. When stressed, you may become critical or anxious. Being useful and organized helps you feel emotionally secure.',
    Libra: 'You need harmony and partnership to feel emotionally fulfilled. When stressed, you may become indecisive or avoid conflict. Creating balance and maintaining relationships helps you process emotions.',
    Scorpio: 'You process emotions deeply and intensely, often in private. When stressed, you may become secretive or controlling. Allowing yourself to transform and release emotional intensity helps you feel balanced.',
    Sagittarius: 'You need freedom and expansion to feel emotionally satisfied. When stressed, you may become restless or avoidant. Adventure and philosophical exploration help you process emotions.',
    Capricorn: 'You process emotions slowly and may struggle with emotional expression. When stressed, you may become cold or controlling. Creating structure and achieving goals helps you feel emotionally secure.',
    Aquarius: 'You need freedom and intellectual stimulation to feel emotionally satisfied. When stressed, you may become detached or rebellious. Innovation and social connection help you process emotions.',
    Pisces: 'You process emotions through intuition and may absorb the feelings of others. When stressed, you may become escapist or overwhelmed. Creative and spiritual outlets help you process emotions.'
  };
  return habits[sign] || 'Your emotional habits are unique to your Moon sign.';
}

function getMoonSignNurture(sign) {
  const nurture = {
    Aries: 'To feel balanced, you need physical outlets and the freedom to act on your impulses. Regular exercise and activities that allow you to be assertive help you manage your emotional energy. Avoid suppressing your feelings—express them directly.',
    Taurus: 'To feel balanced, you need a comfortable, stable environment and sensual pleasures. Creating a beautiful space, enjoying good food, and spending time in nature help you feel emotionally secure. Avoid rushing—take time to process your feelings.',
    Gemini: 'To feel balanced, you need mental stimulation and opportunities to communicate. Reading, writing, and engaging in conversations help you process emotions. Avoid overthinking—sometimes you need to feel rather than analyze.',
    Cancer: 'To feel balanced, you need a safe domestic space where you can let your guard down. Self-care for you isn\'t a luxury; it\'s a necessity. Water is healing for you—whether it\'s a bath, a swim, or simply being near the ocean. Surround yourself with people who treat your heart with the same tenderness you show others.',
    Leo: 'To feel balanced, you need recognition and creative expression. Activities that allow you to shine and feel appreciated help you process emotions. Avoid seeking validation from others—learn to appreciate yourself.',
    Virgo: 'To feel balanced, you need order and the opportunity to be useful. Organizing your space and helping others helps you feel emotionally secure. Avoid being overly critical—practice self-compassion.',
    Libra: 'To feel balanced, you need harmony and partnership. Creating beauty and maintaining balanced relationships help you process emotions. Avoid avoiding conflict—sometimes addressing issues directly is necessary.',
    Scorpio: 'To feel balanced, you need depth and transformation. Allowing yourself to feel deeply and process intense emotions helps you feel secure. Avoid holding onto grudges—practice emotional release.',
    Sagittarius: 'To feel balanced, you need freedom and adventure. Travel, learning, and philosophical exploration help you process emotions. Avoid feeling trapped—maintain your sense of freedom.',
    Capricorn: 'To feel balanced, you need structure and achievement. Setting goals and creating stability helps you feel emotionally secure. Avoid suppressing emotions—allow yourself to feel and express them.',
    Aquarius: 'To feel balanced, you need freedom and intellectual stimulation. Innovation and social connection help you process emotions. Avoid emotional detachment—allow yourself to connect deeply with others.',
    Pisces: 'To feel balanced, you need creative and spiritual outlets. Art, music, meditation, and time near water help you process emotions. Avoid absorbing others\' emotions—practice emotional boundaries.'
  };
  return nurture[sign] || 'Find what nurtures your emotional well-being.';
}

export default Moon;