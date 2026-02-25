import React, { useEffect, useRef, useState } from 'react';
import { Eye, UserCheck, Sparkles, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Ascendant = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  const [ascendant, setAscendant] = useState('Scorpio');
  const [loading, setLoading] = useState(true);

  // Fetch user's ascendant
  useEffect(() => {
    const fetchAscendant = async () => {
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

        if (response.data?.data?.ascendant) {
          setAscendant(response.data.data.ascendant);
        }
      } catch (err) {
        console.error('Failed to fetch ascendant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAscendant();
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

      <main className="relative z-10 max-w-6xl mx-auto pt-36 pb-20 px-6">
        {/* Header Section */}
        <header className="text-center mb-16">
          <span className="inline-block bg-cyan-500/10 text-[#22d3ee] border border-cyan-500/50 px-5 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.3em] mb-4">
            The Rising Sign
          </span>
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tight bg-linear-to-r from-white to-[#22d3ee] bg-clip-text text-transparent">
            {loading ? 'Loading...' : `${ascendant} ASC`}
          </h1>
          <p className="mt-6 opacity-60 max-w-xl mx-auto text-lg leading-relaxed">
            {loading ? 'Calculating your Ascendant...' : 'The Ascendant is the zodiac sign that was rising on the eastern horizon at the moment of your birth. It represents your exterior, your first impressions, and your spontaneous reactions.'}
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10">
            
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* First Impression */}
          {!loading && (
            <>
              <GlassCard icon={<Eye className="text-[#22d3ee]" />} title="First Impression">
                <p className="mb-6">
                  {getAscendantImpression(ascendant)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getAscendantTraits(ascendant).map((trait) => (
                    <span key={trait} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs tracking-wider">
                      {trait}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Social Mask */}
              <GlassCard icon={<UserCheck className="text-[#22d3ee]" />} title="Social Mask">
                <p className="mb-4">
                  {getAscendantSocial(ascendant)}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm italic text-[#22d3ee]">
                    <strong>The Lesson:</strong> {getAscendantLesson(ascendant)}
                  </p>
                </div>
              </GlassCard>

              {/* Physical Presence - Full Width */}
              <div className="md:col-span-2">
                <GlassCard icon={<Sparkles className="text-[#22d3ee]" />} title="Physical Presence & Style">
                  <p className="text-lg">
                    {getAscendantStyle(ascendant)}
                  </p>
                </GlassCard>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * Reusable Glassmorphic Card Component
 */
const GlassCard = ({ icon, title, children }) => (
  <div className="bg-white/4 backdrop-blur-md border border-cosmic-primary/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-[#22d3ee]/50 group">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 rounded-lg bg-[#22d3ee]/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-lg font-semibold tracking-widest uppercase text-[#22d3ee]">{title}</h2>
    </div>
    <div className="text-[#f5f5f5] opacity-80 leading-relaxed">
      {children}
    </div>
  </div>
);

// Helper functions for ascendant data
function getAscendantImpression(sign) {
  const impressions = {
    Aries: 'With Aries Rising, you project an aura of confidence, energy, and assertiveness. People see you as bold, direct, and unafraid to take the lead. Your presence is immediately felt, and you make a strong first impression with your dynamic energy.',
    Taurus: 'With Taurus Rising, you project an aura of stability, sensuality, and calm strength. People see you as grounded, reliable, and appreciative of beauty. Your presence is steady and comforting, and you make others feel secure.',
    Gemini: 'With Gemini Rising, you project an aura of curiosity, wit, and communication. People see you as intelligent, adaptable, and always ready for conversation. Your presence is light and engaging, and you make others feel mentally stimulated.',
    Cancer: 'With Cancer Rising, you project an aura of sensitivity, nurturing, and emotional depth. People see you as caring, intuitive, and protective. Your presence is warm and comforting, and you make others feel understood and safe.',
    Leo: 'With Leo Rising, you project an aura of confidence, charisma, and warmth. People see you as magnetic, generous, and naturally regal. Your presence commands attention, and you make others feel special and appreciated.',
    Virgo: 'With Virgo Rising, you project an aura of precision, modesty, and intelligence. People see you as practical, helpful, and detail-oriented. Your presence is refined and thoughtful, and you make others feel organized and supported.',
    Libra: 'With Libra Rising, you project an aura of charm, balance, and diplomacy. People see you as attractive, harmonious, and socially graceful. Your presence is pleasant and balanced, and you make others feel appreciated and understood.',
    Scorpio: 'With Scorpio Rising, you project an aura of mystery, intensity, and quiet power. You are not someone who reveals everything at once. People often perceive you as guarded, observant, and incredibly perceptive—as if you can see right through them.',
    Sagittarius: 'With Sagittarius Rising, you project an aura of optimism, adventure, and freedom. People see you as enthusiastic, honest, and always ready for the next adventure. Your presence is uplifting, and you make others feel inspired and free.',
    Capricorn: 'With Capricorn Rising, you project an aura of seriousness, ambition, and responsibility. People see you as mature, disciplined, and goal-oriented. Your presence is authoritative, and you make others feel secure and motivated.',
    Aquarius: 'With Aquarius Rising, you project an aura of uniqueness, independence, and innovation. People see you as original, friendly, and forward-thinking. Your presence is intriguing, and you make others feel accepted and inspired.',
    Pisces: 'With Pisces Rising, you project an aura of dreaminess, compassion, and sensitivity. People see you as gentle, intuitive, and artistically inclined. Your presence is ethereal, and you make others feel understood and emotionally connected.'
  };
  return impressions[sign] || 'Your Ascendant influences how others perceive you.';
}

function getAscendantTraits(sign) {
  const traits = {
    Aries: ['Bold', 'Energetic', 'Direct', 'Confident'],
    Taurus: ['Stable', 'Sensual', 'Grounded', 'Reliable'],
    Gemini: ['Curious', 'Witty', 'Adaptable', 'Communicative'],
    Cancer: ['Sensitive', 'Nurturing', 'Intuitive', 'Protective'],
    Leo: ['Confident', 'Charismatic', 'Warm', 'Generous'],
    Virgo: ['Precise', 'Modest', 'Intelligent', 'Helpful'],
    Libra: ['Charming', 'Balanced', 'Diplomatic', 'Graceful'],
    Scorpio: ['Magnetic', 'Intense', 'Observant', 'Private'],
    Sagittarius: ['Optimistic', 'Adventurous', 'Honest', 'Free'],
    Capricorn: ['Serious', 'Ambitious', 'Responsible', 'Disciplined'],
    Aquarius: ['Unique', 'Independent', 'Innovative', 'Friendly'],
    Pisces: ['Dreamy', 'Compassionate', 'Sensitive', 'Artistic']
  };
  return traits[sign] || ['Unique', 'Individual'];
}

function getAscendantSocial(sign) {
  const social = {
    Aries: 'You navigate the world with confidence and directness. You\'re not afraid to take the lead and often initiate social interactions. In social settings, you may come across as competitive or assertive, but this is simply your natural way of engaging with the world.',
    Taurus: 'You navigate the world with stability and sensuality. You prefer comfortable, familiar social settings and may take time to warm up to new people. In social settings, you appear calm and reliable, creating a sense of security for those around you.',
    Gemini: 'You navigate the world with curiosity and communication. You\'re naturally social and enjoy meeting new people and learning new things. In social settings, you appear light and engaging, always ready with a story or question.',
    Cancer: 'You navigate the world with sensitivity and emotional awareness. You\'re protective of your inner circle and may be cautious with new people. In social settings, you appear warm and nurturing, making others feel cared for.',
    Leo: 'You navigate the world with confidence and charisma. You naturally take center stage and enjoy being appreciated. In social settings, you appear warm and generous, making others feel special and valued.',
    Virgo: 'You navigate the world with precision and helpfulness. You prefer organized, meaningful social interactions and may be reserved in large groups. In social settings, you appear thoughtful and supportive, always ready to help.',
    Libra: 'You navigate the world with charm and diplomacy. You seek harmony in all social interactions and may avoid conflict. In social settings, you appear balanced and pleasant, making others feel appreciated and understood.',
    Scorpio: 'You navigate the world with a "detective" mindset. You rarely take things at face value and prefer to analyze situations before participating. In social settings, you may appear serious or intimidating, but this is simply your way of protecting your sensitive inner world.',
    Sagittarius: 'You navigate the world with optimism and adventure. You\'re naturally friendly and enjoy diverse social connections. In social settings, you appear enthusiastic and honest, inspiring others with your positive energy.',
    Capricorn: 'You navigate the world with seriousness and ambition. You prefer structured, goal-oriented social interactions and may seem reserved. In social settings, you appear mature and responsible, making others feel secure and motivated.',
    Aquarius: 'You navigate the world with uniqueness and independence. You enjoy diverse, unconventional social connections and value intellectual stimulation. In social settings, you appear friendly and original, making others feel accepted and inspired.',
    Pisces: 'You navigate the world with sensitivity and intuition. You\'re naturally empathetic and may absorb the emotions of others. In social settings, you appear gentle and compassionate, making others feel understood and emotionally connected.'
  };
  return social[sign] || 'Your social mask reflects your Ascendant sign.';
}

function getAscendantLesson(sign) {
  const lessons = {
    Aries: 'Your path involves learning to balance your assertiveness with patience and consideration for others.',
    Taurus: 'Your path involves learning to balance your need for security with openness to change and growth.',
    Gemini: 'Your path involves learning to balance your curiosity with focus and emotional depth.',
    Cancer: 'Your path involves learning to balance your sensitivity with emotional boundaries and self-protection.',
    Leo: 'Your path involves learning to balance your need for recognition with humility and genuine connection.',
    Virgo: 'Your path involves learning to balance your perfectionism with self-acceptance and flexibility.',
    Libra: 'Your path involves learning to balance your need for harmony with assertiveness and authenticity.',
    Scorpio: 'Your path involves learning to trust your intuition while letting go of the need for total control.',
    Sagittarius: 'Your path involves learning to balance your need for freedom with commitment and responsibility.',
    Capricorn: 'Your path involves learning to balance your ambition with emotional expression and self-care.',
    Aquarius: 'Your path involves learning to balance your independence with emotional connection and intimacy.',
    Pisces: 'Your path involves learning to balance your compassion with emotional boundaries and practical action.'
  };
  return lessons[sign] || 'Your path involves learning and growth.';
}

function getAscendantStyle(sign) {
  const styles = {
    Aries: 'Aries Rising often bestows a dynamic, athletic appearance with a confident stance. Your style is bold and direct, often featuring reds, bright colors, or sporty elements. You prefer clothing that allows freedom of movement and expresses your energetic nature.',
    Taurus: 'Taurus Rising often bestows a solid, attractive appearance with a sensual presence. Your style is classic and comfortable, often featuring earth tones, quality fabrics, and timeless pieces. You prefer clothing that feels good and looks elegant.',
    Gemini: 'Gemini Rising often bestows a youthful, expressive appearance with quick movements. Your style is versatile and changeable, often featuring bright colors, patterns, or trendy pieces. You prefer clothing that allows you to express different aspects of yourself.',
    Cancer: 'Cancer Rising often bestows a soft, nurturing appearance with expressive eyes. Your style is comfortable and sentimental, often featuring soft fabrics, pastels, or vintage pieces. You prefer clothing that feels like home and expresses your emotional nature.',
    Leo: 'Leo Rising often bestows a regal, confident appearance with a warm presence. Your style is bold and dramatic, often featuring golds, bright colors, or statement pieces. You prefer clothing that makes you stand out and expresses your natural charisma.',
    Virgo: 'Virgo Rising often bestows a refined, neat appearance with an intelligent look. Your style is precise and understated, often featuring earth tones, clean lines, and quality basics. You prefer clothing that is practical, well-fitted, and expresses your attention to detail.',
    Libra: 'Libra Rising often bestows a balanced, attractive appearance with a harmonious presence. Your style is elegant and pleasing, often featuring pastels, balanced colors, or artistic pieces. You prefer clothing that is beautiful, well-coordinated, and expresses your aesthetic sense.',
    Scorpio: 'Scorpio Rising often bestows a piercing gaze and a "fixed" look in the eyes. Your presence is felt even when you are silent. You likely prefer a style that is sleek, dark, or classic—clothing that acts as an armor rather than a cry for attention. There is a natural "coolness" to your demeanor that others find fascinating.',
    Sagittarius: 'Sagittarius Rising often bestows an athletic, optimistic appearance with an adventurous presence. Your style is casual and international, often featuring comfortable, travel-friendly pieces or cultural elements. You prefer clothing that allows freedom and expresses your love of adventure.',
    Capricorn: 'Capricorn Rising often bestows a serious, mature appearance with an authoritative presence. Your style is classic and professional, often featuring dark colors, structured pieces, or traditional elements. You prefer clothing that conveys respectability and expresses your ambition.',
    Aquarius: 'Aquarius Rising often bestows a unique, independent appearance with an innovative presence. Your style is original and unconventional, often featuring unusual colors, modern pieces, or futuristic elements. You prefer clothing that expresses your individuality and forward-thinking nature.',
    Pisces: 'Pisces Rising often bestows a dreamy, ethereal appearance with a sensitive presence. Your style is flowing and artistic, often featuring soft fabrics, pastels, or mystical elements. You prefer clothing that feels comfortable and expresses your creative, intuitive nature.'
  };
  return styles[sign] || 'Your physical presence reflects your Ascendant sign.';
}

export default Ascendant;