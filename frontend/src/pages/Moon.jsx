import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // 1. Added useParams
import { Waves, Anchor, Sparkle, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Moon = () => {
  const { signName } = useParams(); // 2. Grab the sign from URL
  const canvasRef = useRef(null);
  const { user } = useAuth();
  
  // 3. Helper to capitalize the first letter (e.g., leo -> Leo)
  const normalizeSign = (name) => {
    if (!name) return null;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const [moonSign, setMoonSign] = useState(normalizeSign(signName) || 'Cancer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoonSign = async () => {
      // 4. PRIORITY 1: If sign is in the URL, use it and stop loading
      if (signName) {
        setMoonSign(normalizeSign(signName));
        setLoading(false);
        return;
      }

      // 5. PRIORITY 2: If no URL sign, look for logged-in user data
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

        const sign = response.data?.data?.planets?.find(p => p.name === 'Moon')?.sign || 
                     response.data?.data?.moonSign;
        
        if (sign) {
          setMoonSign(normalizeSign(sign));
        }
      } catch (err) {
        console.error('Failed to fetch moon sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoonSign();
  }, [user, signName]);

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
        <section className="text-center mb-16">
          <div className="text-8xl mb-4 inline-block drop-shadow-[0_0_20px_rgba(129,140,248,0.5)] animate-bounce-slow">
            {getMoonEmoji(moonSign)}
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

        <div className="space-y-8">
          {!loading && (
            <>
              <GlassPanel icon={<Waves className="text-[#818cf8]" />} title="Inner Landscape">
                <p>{getMoonSignDescription(moonSign)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <TraitItem label="Needs" value={getMoonSignNeeds(moonSign)} />
                  <TraitItem label="Style" value={getMoonSignStyle(moonSign)} />
                  <TraitItem label="Element" value={getMoonSignElement(moonSign)} />
                </div>
              </GlassPanel>
              <GlassPanel icon={<Anchor className="text-[#818cf8]" />} title="Emotional Habits">
                <p className="mb-6">{getMoonSignHabits(moonSign)}</p>
              </GlassPanel>
              <GlassPanel icon={<Sparkle className="text-[#818cf8]" />} title="How to Nurture Yourself">
                <p>{getMoonSignNurture(moonSign)}</p>
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
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

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

function getMoonEmoji(sign) {
  const moonPhases = {
    Aries: '🌑', Taurus: '🌒', Gemini: '🌓', Cancer: '🌔',
    Leo: '🌕', Virgo: '🌖', Libra: '🌗', Scorpio: '🌘',
    Sagittarius: '🌙', Capricorn: '🪐', Aquarius: '☄️', Pisces: '🌊'
  };
  return moonPhases[sign] || '🌙';
}

function getMoonSignDescription(sign) {
  const descriptions = {
    Aries: 'With a Moon in Aries, your emotional architecture is built for speed and impact. You process the world through a lens of "firstness," where feelings are experienced as sudden, electric surges of energy. You don\'t just experience an emotion; you react to it with a primal, warrior-like instinct. Your inner world is a landscape of constant ignition, seeking the thrill of a new emotional frontier.',
    Taurus: 'With a Moon in Taurus, your emotions are an ancient, fertile earth. You find your center through the tangible—the weight of a blanket, the scent of the rain, the reliability of a routine. Your feelings are steady and slow to build, but once rooted, they are unshakable. You possess an innate emotional intelligence that values peace over chaos and quality over novelty.',
    Gemini: 'With a Moon in Gemini, your emotions are a kaleidoscopic network of ideas. You translate feelings into language, seeking to understand the "why" behind every mood. Your inner landscape is restless and versatile, thriving on the exchange of information. You process emotional pain by talking, writing, or learning, often possessing a "dual" emotional nature that allows you to see every side of a situation.',
    Cancer: 'The Moon is at home in Cancer, its own domicile. Your emotions are vast and tidal, governed by the lunar cycles. You possess a psychic-like sensitivity to your environment, absorbing the unspoken moods of others like a sponge. Your inner world is a sacred sanctuary, a "shell" that protects a heart of immense depth, nostalgia, and protective ferocity.',
    Leo: 'With a Moon in Leo, your heart is a radiant sun. Your emotions are warm, grand, and demand a certain level of theatrical expression. You feel most secure when you are appreciated and allowed to lead with your heart. You possess a royal-like loyalty and a generous spirit that seeks to turn every emotional experience into a creative masterpiece.',
    Virgo: 'With a Moon in Virgo, your emotions are refined through the lens of service and order. You process feelings by analyzing them into smaller, manageable parts. You find emotional safety in being useful and knowing the details of how things work. Your inner world is clean, organized, and focused on self-improvement and the quiet devotion to those you love.',
    Libra: 'With a Moon in Libra, your emotions seek the grace of the scales. You process your feelings through the "Other," finding your center in partnership and aesthetic harmony. You have an instinctual need for fairness and can feel physically unsettled by discord or injustice. Your emotional well-being is tied to the beauty and balance of your surroundings.',
    Scorpio: 'With a Moon in Scorpio, your emotions are a deep, subterranean ocean of alchemical power. You feel with a profound, sometimes piercing intensity that others can sense but rarely understand. You seek the truth beneath the surface, finding security in vulnerability and total transformation. Your heart is a fortress that only a few are ever allowed to enter.',
    Sagittarius: 'With a Moon in Sagittarius, your emotions are a vast, unmapped horizon. You find security in freedom and the ability to expand your mind through adventure. You possess a "hope-springs-eternal" emotional nature, processing pain through philosophical inquiry and travel. You need a life that feels like an epic quest to feel truly at home in your skin.',
    Capricorn: 'With a Moon in Capricorn, your emotions are a mountain peak—solitary, ambitious, and enduring. You find safety in structure, achievement, and the ability to provide for yourself. You may process feelings slowly, preferring to "deal with them" through hard work and responsibility. Your heart is a legacy that is built brick-by-brick over time.',
    Aquarius: 'With a Moon in Aquarius, your emotions are detached, electric, and humanitarian. You process feelings through the lens of logic and the collective good, often feeling like a "watcher" of your own moods. You find security in your uniqueness and your independence, seeking emotional connections that respect your need for space and intellectual freedom.',
    Pisces: 'With a Moon in Pisces, your emotions are a boundaryless sea of empathy and dreams. You possess a "thin skin" that allows the entire world to flow through you. You find your center in the mystical, the artistic, and the spiritual. Your inner world is a poetic landscape where the line between reality and the divine is beautifully blurred.'
  };
  return descriptions[sign] || descriptions.Cancer;
}

function getMoonSignNeeds(sign) {
  const needs = {
    Aries: 'Challenge', Taurus: 'Stability', Gemini: 'Stimulation', Cancer: 'Belonging',
    Leo: 'Admiration', Virgo: 'Utility', Libra: 'Equilibrium', Scorpio: 'Intimacy',
    Sagittarius: 'Expansion', Capricorn: 'Respect', Aquarius: 'Autonomy', Pisces: 'Tranquility'
  };
  return needs[sign] || 'Balance';
}

function getMoonSignStyle(sign) {
  const styles = {
    Aries: 'Impulsive', Taurus: 'Sensual', Gemini: 'Cerebral', Cancer: 'Intuitive',
    Leo: 'Radiant', Virgo: 'Discriminating', Libra: 'Diplomatic', Scorpio: 'Magnetic',
    Sagittarius: 'Wandering', Capricorn: 'Stoic', Aquarius: 'Unorthodox', Pisces: 'Ethereal'
  };
  return styles[sign] || 'Harmonious';
}

function getMoonSignElement(sign) {
  const elements = {
    Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
    Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
  };
  return elements[sign] || 'Water';
}

function getMoonSignHabits(sign) {
  const habits = {
    Aries: 'Your emotional habit is one of "Instant Combustion." You process feelings in explosive bursts, viewing emotional stillness as stagnation. When stressed, your primal instinct is "fight"—you may become abrasive or impulsive to regain a sense of control. You struggle with the concept of simmering; for you, resolution must be immediate. Calibration is found through intense physical exertion, which acts as a pressure valve for your high-voltage inner world.',
    Taurus: 'You are an architect of "Sensory Preservation." Your habit is to seek emotional safety through the familiar and the tangible. When stressed, you may become remarkably stubborn, "digging in your heels" or overindulging in material comforts to soothe a perceived threat to your security. You require time to digest your feelings slowly. You find balance by grounding yourself in nature or physical rituals that remind you that you are safe in the "here and now."',
    Gemini: 'Your habit is "Intellectual Displacement." You tend to narrate your feelings rather than feeling them, searching for logic in the midst of a storm. When stressed, your mind becomes a high-speed processor, leading to erratic speech or nervous anxiety as you hunt for data to explain your mood. You need a constant rotation of mental outlets—journaling, debating, or learning—to prevent your internal circuitry from short-circuiting under the weight of "un-analyzed" emotions.',
    Cancer: 'Your habit is "Lunar Fluctuating Retreat." You experience the world in tidal waves, instinctively pulling back into your psychic "shell" when the environment feels harsh. You find comfort in the architecture of the past—nostalgia, heirlooms, and ancestral rituals. When stressed, you may become passive-aggressive or hyper-protective. You require a private, sacred space where you can weep or rest without being witnessed, allowing your internal tides to ebb and flow naturally.',
    Leo: 'Your habit is "Creative Externalization." You possess a theatrical emotional nature that views the heart as a radiant stage. When stressed, you may subconsciously amplify your pain to ensure it is validated by an audience, fearing that unseen emotions are unvalued. You need to feel special and respected to maintain your emotional equilibrium. Your soul calibrates through acts of generosity and unapologetic self-expression that transform private pain into a noble radiation of warmth.',
    Virgo: 'Your habit is "Systemic Refinement." You process the messy chaos of emotion by breaking it down into a to-do list. When stressed, your inner critic takes the wheel, leading to obsessive cleaning, micromanaging, or hyper-fixation on physical health. You find emotional safety in being useful and knowing the exact mechanics of your psyche. Calibration occurs when you translate your emotional energy into a tangible act of service or the organization of your physical environment.',
    Libra: 'Your habit is "Relational Mirroring." You tend to calibrate your internal temperature based on the people around you. When stressed, you may prioritize the "peace" of the room over your own truth, leading to indecisiveness or a loss of self. You find safety in symmetry and aesthetic grace. You need to periodically decouple your identity from your partnerships to ensure that your inner scales are balanced by your own weight, not the expectations of others.',
    Scorpio: 'Your habit is "Subterranean Intensity." You operate on a frequency of absolute truth, often keeping your feelings in a state of high-pressure containment. When stressed, you become a silent observer, hyper-vigilant and prone to suspicion as you probe for the "hidden" agenda. You require total privacy to undergo the alchemical process of emotional death and rebirth. You find power in the "shedding"—the willingness to burn away obsolete feelings to emerge stronger and more resilient.',
    Sagittarius: 'Your habit is "Philosophical Escape." You view emotional heavy-lifting as a cage, instinctively seeking the "Big Picture" to bypass the discomfort of the mundane. When stressed, you may become restless, preachy, or physically flighty, needing to outrun the "smallness" of a current mood. You find security in the horizon. Your heart is nurtured by travel, high-level learning, and the belief that every emotional crisis is simply a necessary lesson in your grand spiritual odyssey.',
    Capricorn: 'Your habit is "Structural Stoicism." You treat your emotions like a corporate legacy—valuing endurance, privacy, and long-term results over immediate relief. When stressed, you become the "rock" or the "provider," burying your vulnerability under a mountain of responsibility and cold efficiency. You find safety in status and self-sufficiency. Calibration requires you to acknowledge that "leaning on someone" is not a structural failure, but a necessary part of your long-term sustainability.',
    Aquarius: 'Your habit is "Cerebral Detachment." You often view your own emotions as a scientific experiment, observing your moods from a bird’s-eye view. When stressed, you may become "aloof" or radically rebellious, pushing others away to protect your intellectual autonomy. You find safety in your uniqueness and your "tribe" of like-minded misfits. You need to feel that your emotional life serves a higher purpose or a collective ideal to feel truly comfortable with its intensity.',
    Pisces: 'Your habit is "Psychic Diffusion." You lack a traditional emotional boundary, often absorbing the collective grief or joy of the room as if it were your own. When stressed, your instinct is "flight" through dissociation, daydreaming, or spiritual escapism. You find safety in the invisible world of art and mysticism. To calibrate, you must practice "psychic hygiene"—regularly clearing out the energetic debris of others to reconnect with the soft, poetic core of your own true feelings.'
  };
  return habits[sign] || habits.Cancer;
}

function getMoonSignNurture(sign) {
  const nurture = {
    Aries: 'To nurture your spirit, you must engage in "Physical Catharsis." Your soul requires regular proof of its own bravery and strength. Ritualize your self-care through high-intensity movement, competitive play, or starting a project that feels slightly "dangerous" to your comfort zone. Allow yourself the radical freedom to be "unapologetically selfish" for a window of time each day—answering only to your own impulses without the weight of others’ expectations. You find peace not in stillness, but in the triumphant exhaustion that follows a challenge.',
    Taurus: 'Your soul is nurtured through "Somatosensory Stability." You require a sanctuary that honors the five senses to feel emotionally safe. Ritualize your peace by grounding your body—plant your bare feet in the soil, bake bread from scratch, or invest in tactile luxuries like high-grade linens and weighted blankets. You must consciously decouple your worth from your productivity, allowing your frequency to slow down to the pace of the Earth. You find your center when you realize that your security is an internal state, supported by the beauty of the physical world.',
    Gemini: 'Nurture yourself through "Cerebral Fluidity." Your spirit thrives on the intake and reorganization of information. Ritualize your self-care by maintaining a "kaleidoscopic" lifestyle—keep three different books on your nightstand, drive to a zip code you’ve never explored, or write letters to your future self that you never intend to mail. You need a mental "playground" where curiosity has no consequences. Your soul is refreshed when you allow yourself to be many people at once, finding liberation in the constant flux of your own brilliant mind.',
    Cancer: 'The Moon’s child requires "Domestic Sanctity and Fluid Release." You must nurture yourself through water and walls. Ritualize your peace by creating a "Safe House" environment—surround yourself with soft textures, nostalgic heirlooms, and the scents of your childhood. Submerging yourself in water (baths, salt pools, or the ocean) is your primary medicine; it allows you to wash away the emotional debris you’ve absorbed from others. Honor the lunar cycle by retreating into your shell during the Dark Moon to ensure your own tides stay balanced.',
    Leo: 'Your spirit is nurtured through "Creative Sovereignty and Radiant Play." You require a sense of "royalty" in your private life to sustain your public warmth. Ritualize your self-care by creating a "Temple of the Self"—buy yourself something gold, perform for a mirror, or host a small gathering where you are truly seen and celebrated. You must learn that joy is not a luxury, but your most rebellious act of survival. Your soul is restored when you give yourself permission to be the protagonist of your own story, radiating warmth from a heart that is fully filled.',
    Virgo: 'Nurture yourself through the "Art of Refinement." Your soul finds its anchor in the quiet devotion to order and wellness. Ritualize your self-care through the "Zen of the Mundane"—organize a drawer, perfect a botanical skincare routine, or curate a meticulous to-do list that values rest as a productive task. You must practice radical self-compassion, reminding yourself that being "under construction" is a sacred state of growth rather than a failure. You find emotional safety in the precision of your habits and the purity of your environment.',
    Libra: 'Your spirit requires "Aesthetic and Relational Equilibrium." You are nurtured by the presence of grace and the absence of discord. Ritualize your peace by curating your visual landscape—fresh flowers, symmetrical art, and soft lighting are not extras; they are necessities for your nervous system. You must practice "Relational Detox," learning to find harmony within your own company so that you don’t over-adjust to the needs of others. Your soul settles when you see the world as a balanced, beautiful reflection of your own internal scales.',
    Scorpio: 'Nurture yourself through "Alchemical Depth and Sacred Privacy." Your soul requires regular periods of total "disappearance" to undergo its necessary transformations. Ritualize your self-care through the "occult" or the profound—dive into a psychological thriller, engage in deep shadow work, or perform a literal ritual of release by burning symbols of your past. You must allow your old versions to "die" so that the new phoenix can emerge. Your heart is restored when you face your own shadows with clinical honesty and emerge with absolute, unshakable power.',
    Sagittarius: 'Your soul is nurtured by the "Horizon of Possibility." You find safety in the belief that the world is too vast for any single problem to define you. Ritualize your self-care through "Intellectual Nomadism"—book a spontaneous flight, get lost in a library of ancient philosophy, or watch documentaries that explore the furthest reaches of the cosmos. You need to feel that your life is an epic quest, not a closed loop. Your spirit is restored the moment you realize that your freedom is a permanent state of being, regardless of your physical location.',
    Capricorn: 'Nurture yourself through "Architectural Solitude and Legacy Building." Your soul finds its center in the climb and the quiet respect of its own capabilities. Ritualize your peace by planning your next five-year legacy in total silence, or by investing in "Status Symbols" that remind you of your own hard-won endurance. You need to feel that you are the authority of your own life. Your soul is restored when you stop being the "rock" for the world and allow yourself the quiet dignity of your own private mountaintop.',
    Aquarius: 'Your spirit requires "Technological and Social Detachment." You are nurtured by the fringe and the future. Ritualize your self-care by seeking out your "Cosmic Tribe"—those who speak your language of radical ideas and unorthodox truths. You need regular periods of "Experimental Independence," where you can bypass societal expectations to explore a new technology or a humanitarian vision. Your soul is refreshed when you realize that your "weirdness" is actually your greatest contribution to the collective evolution.',
    Pisces: 'Nurture yourself through "Ethereal Dissolution." Your soul is a boundaryless sea that needs a regular "Digital and Psychic Detox." Ritualize your peace through the invisible—meditate to ambient frequencies, lose yourself in abstract art, or sit in total silence by a body of water. You must learn to build psychic walls so that you do not drown in the emotions of the world. Your soul is restored when you let the material world fade away, allowing your consciousness to drift back into the infinite flow from which it came.'
  };
  return nurture[sign] || nurture.Cancer;
}

export default Moon;