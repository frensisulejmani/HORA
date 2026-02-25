import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Users, Briefcase, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { astroAPI } from '../services/api';

const Sun = () => {
  const { signName } = useParams(); // Grabs the sign from the URL (e.g., /sun/Aries)
  const canvasRef = useRef(null);
  const { user } = useAuth();
  
  // State defaults to the URL parameter, otherwise fallback to Leo
  const [sunSign, setSunSign] = useState(signName || 'Leo');
  const [loading, setLoading] = useState(true);

  // Map symbols to signs for the hero section
  const getSymbol = (sign) => {
    const symbols = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
      Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
      Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return symbols[sign] || '✨';
  };

  // Logic to determine which sign to show
  useEffect(() => {
    const fetchSunSign = async () => {
      // If user clicked from the Grid, we use the URL name immediately
      if (signName) {
        setSunSign(signName);
        setLoading(false);
        return;
      }

      // If no URL name, try to fetch the logged-in user's sign
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

        if (response.data?.data?.sunSign) {
          setSunSign(response.data.data.sunSign);
        }
      } catch (err) {
        console.error('Failed to fetch sun sign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSunSign();
  }, [user, signName]);

  // Canvas Star Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

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

    const initStars = () => {
      stars = [];
      const count = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < count; i++) stars.push(new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
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

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-purple-500/30">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto pt-32 px-5 pb-20">
        
        {/* Back Link */}
        <Link to="/zodiac" className="inline-flex items-center gap-2 text-white/40 hover:text-purple-400 transition-colors mb-10 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to all signs
        </Link>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-16 text-center md:text-left">
          <div className="text-8xl md:text-9xl leading-none bg-linear-to-br from-purple-500 to-amber-400 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            {getSymbol(sunSign)}
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest mb-2">
              {loading ? 'Loading...' : sunSign}
            </h1>
            <p className="text-white/60 italic text-lg mb-6">
              {loading ? 'Calculating...' : `The Celestial Profile of ${sunSign} — ${getSunSignDescription(sunSign)}`}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetaItem label="Date" value={getSunSignDates(sunSign)} />
              <MetaItem label="Element" value={getSunSignElement(sunSign)} />
              <MetaItem label="Ruler" value={getSunSignRuler(sunSign)} />
            </div>
          </div>
        </section>

        {/* Essence Card */}
        {!loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-[30px] p-8 md:p-12 mb-8 hover:border-purple-500/50 transition-colors shadow-2xl">
            <h2 className="text-3xl font-semibold text-amber-400 mb-4">The Essence of {sunSign}</h2>
            <p className="text-lg leading-relaxed text-white/80 font-light">
              {getSunSignEssence(sunSign)}
            </p>
          </div>
        )}

        {/* Detail Cards */}
        {!loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-[30px] p-8 md:p-12 space-y-12 shadow-2xl">
            <ContentSection 
              Icon={Heart} 
              title="Love & Romance" 
              text={getSunSignLove(sunSign)} 
            />
            <ContentSection 
              Icon={Users} 
              title="Friends & Family" 
              text={getSunSignFriends(sunSign)} 
            />
            <ContentSection 
              Icon={Briefcase} 
              title="Career & Ambition" 
              text={getSunSignCareer(sunSign)} 
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// --- Helper Components ---

const MetaItem = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center transition-colors hover:bg-white/10">
    <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">{label}</span>
    <span className="text-base font-semibold">{value}</span>
  </div>
);

const ContentSection = ({ Icon, title, text }) => (
  <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-8 group">
    <div className="mx-auto md:mx-0 w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <Icon size={28} />
    </div>
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <p className="text-white/70 leading-relaxed font-light">{text}</p>
    </div>
  </div>
);

// --- Data & Helpers ---

const signData = {
  Aries: {
    dates: 'March 21 - April 19', element: 'Fire', ruler: 'Mars', description: 'The Cosmic Pioneer',
    essence: 'As the first sign of the zodiac, Aries represents the spark of life itself. You possess a raw, primal energy that refuses to be contained. You are not just a leader; you are a visionary who clears the path for others. Your soul thrives on the "first" – the first idea, the first ascent, the first victory. You embody the courage to exist in a world that often demands conformity. While others hesitate to weigh the risks, you have already leaped, driven by an internal flame that burns with the heat of a thousand suns. You are the archetypal warrior, defined by your resilience and an unbreakable spirit that views every obstacle as an invitation to prove your strength.',
    love: 'In the realm of romance, Aries loves with a fierce, uncompromising intensity. You do not believe in lukewarm affections; for you, love is a battlefield, a grand adventure, and a sacred bond all at once. You are direct, often startlingly so, skipping the games and moving straight to the heart of the matter. You need a partner who possesses their own gravity—someone who can stand firm against the gale-force winds of your passion without losing themselves. You are fiercely protective and will defend your beloved against any threat, but you also require a vast amount of freedom. To love an Aries is to embrace a whirlwind of excitement, where the only constant is the thrill of being truly seen.',
    friends: 'In your social circles, you are the catalyst. You are the friend who suggests the midnight road trip, the one who defends the underdog, and the one who speaks the uncomfortable truth when everyone else remains silent. People are drawn to your infectious vitality, though your bluntness can sometimes sting. However, those who truly know you understand that your honesty is a sign of respect. You have little patience for superficiality or "small talk," preferring deep, action-oriented connections. You are the ultimate ally—if a friend is in trouble, you are the first person at their door, ready to fight alongside them.',
    career: 'Career-wise, Aries is ill-suited for the mundane repetition of a cubicle. You crave a theater where your initiative can take center stage. You are a natural entrepreneur, athlete, or military leader—any field where quick thinking and physical or mental courage are rewarded. You are a "start-up" personality; you love the chaos of a new beginning but may struggle with the long-term maintenance of a project once the novelty fades. Your greatest professional success comes when you learn to channel your impulsive energy into sustained, strategic action. You don\'t just want a paycheck; you want a legacy built on your own terms.'
  },
  Taurus: {
    dates: 'April 20 - May 20', element: 'Earth', ruler: 'Venus', description: 'The Anchor of the Earth',
    essence: 'Taurus is the physical embodiment of the Earth’s stability and the richness of the natural world. Ruled by Venus, you possess an innate connection to the five senses, finding profound meaning in the texture of life. You are the anchor in the storm—unshakable, patient, and immensely powerful in your stillness. While others chase fleeting trends, you build for eternity. Your strength lies in your endurance; like the mountains, you are not easily moved, but when you do decide to shift, the world takes notice. You appreciate the "fine" things not out of vanity, but out of a deep respect for craftsmanship and quality. You understand that true growth takes time, and you are willing to wait decades to see your gardens bloom.',
    love: 'Love for a Taurus is a sensory experience and a sacred commitment. You seek a partner who feels like "home"—a sanctuary from the chaos of the outside world. You express affection through the tangible: a perfectly cooked meal, a gentle touch, or a beautiful environment. You are famously loyal; once you have given your heart, it is for keeps. However, your need for security can sometimes manifest as possessiveness. You value consistency above all else and can be deeply unsettled by sudden changes in a relationship. To be loved by you is to be wrapped in a blanket of absolute security, knowing that through every high and low, you will be there, steady and true.',
    friends: 'In friendship, you are the rock. You are the one your friends call when they need a voice of reason or a place to crash. You maintain friendships that span decades, valuing the history and shared memories more than the excitement of new acquaintances. You are an exceptional host, creating spaces where people feel safe and pampered. While you are slow to trust, once someone is in your "inner circle," they are family. You might be stubborn when challenged, but your loyalty is beyond reproach. You don\'t just give advice; you give support that is practical, grounded, and lasting.',
    career: 'Taurus thrives in environments that reward persistence and allow for tangible results. You have a natural affinity for finance, real estate, architecture, or any field involving the Earth (like agriculture or environmental science). You are the "closer"—the one who takes a chaotic idea and turns it into a profitable, lasting reality. You value a high standard of living and see your career as the vehicle to achieve that comfort. You aren\'t afraid of hard work, provided it leads to a secure and beautiful life. Your colleagues respect you for your reliability; they know that if a task is assigned to you, it will be completed with perfection, regardless of the time required.'
  },
  Gemini: {
    dates: 'May 21 - June 20', element: 'Air', ruler: 'Mercury', description: 'The Master of Duality',
    essence: 'Gemini is the sign of the eternal student and the cosmic messenger. Ruled by Mercury, you are a whirlwind of intellectual energy, possessing a mind that moves faster than light. You embody duality—the ability to see both sides of every coin, to exist in two worlds at once, and to bridge the gap between disparate ideas. Your soul is driven by an insatiable curiosity; you view the world as a vast library waiting to be read. You are a shapeshifter, adaptable and versatile, capable of blending into any environment. Your challenge is to find the common thread in your many interests, but your gift is the ability to communicate the complex in ways that sparkle with wit and clarity.',
    love: 'In love, Gemini seeks a mental sparring partner. For you, the most erotic organ is the brain. You need a relationship that is a constant conversation, filled with laughter, debate, and shared discovery. You are flirtatious and playful, viewing the initial stages of romance as a delightful game of wits. However, you can become restless if the mental connection fades or if the relationship becomes too predictable. You need space to breathe and to maintain your own social world. To love a Gemini is to embark on a journey of endless variety; you will never be bored, but you must be prepared to keep up with their ever-evolving interests and perspectives.',
    friends: 'You are the social glue of any group. Your phone is likely buzzing constantly with invitations and news. Friends value you for your humor, your encyclopedic knowledge of diverse topics, and your ability to lighten any mood. You are the one who knows everyone and everything, the connector who brings people together. While you have a wide network of acquaintances, your true inner circle consists of those who can handle your fast-paced lifestyle and your occasional bouts of indecision. You are a generous listener, provided the topic is engaging, and you always have the perfect recommendation for a book, movie, or hidden city gem.',
    career: 'Gemini excels in any field that requires communication, rapid information processing, or social networking. You are a natural journalist, publicist, teacher, or tech innovator. You thrive in chaotic environments where no two days are the same. You are a master of multitasking, often juggling several projects simultaneously with a grace that baffles others. Your greatest professional asset is your ability to translate data into story and to persuade others through the sheer power of your words. You succeed when you are given the autonomy to explore new ideas and the platform to share them with the world.'
  },
  Cancer: {
    dates: 'June 21 - July 22', element: 'Water', ruler: 'The Moon', description: 'The Guardian of the Soul',
    essence: 'Cancer is the sign of the tides, the home, and the deep well of human emotion. Ruled by the Moon, your moods wax and wane with a poetic rhythm that others may find mysterious, but which you understand as the heartbeat of life. You are the nurturer of the zodiac, possessing an intuitive empathy that allows you to feel the unspoken needs of those around you. Your strength is not a loud, aggressive force, but a quiet, tidal persistence that can wear down the hardest stone over time. You carry your home within you, and your protective shell serves as a sanctuary for the vulnerable. You are the bridge between the past and the present, holding the memories and traditions that give life its meaning.',
    love: 'For a Cancer, love is a profound emotional investment and a quest for total security. You do not give your heart lightly; you are the "gatekeeper," carefully vetting those who wish to enter your private world. Once you commit, you are the most devoted and protective partner imaginable. You express love through caretaking—nourishing your partner’s body and soul. You need a partner who values family, intimacy, and emotional depth. You are sensitive to criticism and can retreat into your shell if hurt, but your capacity for forgiveness and unconditional love is boundless. To be loved by a Cancer is to be cherished as a treasure, protected from the coldness of the world by a love that is as deep as the ocean.',
    friends: 'In friendship, you are the "parent" figure. You are the one who remembers every milestone, the one who brings soup when a friend is sick, and the one whose house is the designated meeting spot for holidays. You value loyalty above all else and view your friends as your "chosen family." You are an intuitive listener, often knowing what a friend needs before they do. While you can be private about your own struggles, you are the first to offer a shoulder to cry on. Your circle is typically small and tight-knit, built on years of shared history and mutual trust. If a friend enters your heart, they are there for life.',
    career: 'Cancer thrives in careers where they can care for, protect, or nourish others. You are an exceptional healer, teacher, interior designer, or chef. You have a natural instinct for business, particularly real estate or anything related to the home, driven by a desire to create security for yourself and your loved ones. You work best in environments that feel personal and supportive; you are not interested in the cold mechanics of a corporate ladder unless it serves a greater purpose. Your colleagues value you for your emotional intelligence and your ability to build a team that feels like a community. You are the soul of the workplace, ensuring that the human element is never forgotten.'
  },
  Leo: {
    dates: 'July 23 - August 22', element: 'Fire', ruler: 'The Sun', description: 'The Solar Sovereign',
    essence: 'Ruled by the Sun, the center of our planetary system, Leo is the radiant heart of the zodiac. You are born with a regal spirit and a natural sense of destiny. Your presence is like a hearth—it provides warmth, light, and a sense of safety to all who gather around it. You are the archetype of the Creative Creator; your life is a canvas, and you feel a deep responsibility to fill it with beauty, drama, and meaning. While your ego is often discussed, your true power lies in your massive capacity for generosity. You don\'t just want to shine; you want everyone in your orbit to shine with you. You possess a courage that is both physical and moral, standing up for your beliefs with a roar that can be heard across the stars.',
    love: 'In love, Leo is the ultimate romantic. You treat a relationship like a grand epic, filled with grand gestures, deep loyalty, and absolute adoration. You don\'t just "date"; you court. You need a partner who is your equal—someone who can hold their own in the spotlight and who isn\'t intimidated by your brilliance. You are incredibly generous, often showering your partner with gifts and attention, but you require the same in return. Validation is your oxygen. If you feel ignored or unappreciated, your light dims. But when you are loved correctly, you are the most devoted, protective, and playful partner in the zodiac, turning every day into a celebration of your union.',
    friends: 'You are the "Sun" of your social group. People are naturally drawn to your charisma and your ability to turn any gathering into an Event. You are fiercely loyal to your pride, and you would go to the ends of the earth to defend a friend. You are the one who organizes the parties, gives the most inspiring pep talks, and ensures that everyone feels included and special. However, you can be sensitive to slights and may struggle if you feel you aren\'t being given the respect you deserve. Your friendships are deep and often lifelong, built on a foundation of mutual admiration and shared joy.',
    career: 'Leos are not meant for the shadows. You belong where you can lead, inspire, and create. You are the natural CEO, the performer, the public speaker, or the creative director. You have a "larger-than-life" professional style and a flair for the dramatic that makes you exceptional in marketing, sales, and entertainment. You aren\'t just working for a paycheck; you are working for applause and a legacy. You have a high standard for your work and expect the same from your team. Your leadership style is benevolent but firm—you expect excellence, but you are also the first to reward it. You succeed most when you are allowed the freedom to express your unique vision.'
  },
  Virgo: {
    dates: 'August 23 - September 22', element: 'Earth', ruler: 'Mercury', description: 'The Alchemist of Order',
    essence: 'Virgo is the sign of the artisan, the healer, and the analyst. Ruled by Mercury, your mind is a precision instrument, capable of discerning the smallest flaw in a complex system. You seek to bring order to chaos, not out of a desire for control, but out of a deep love for the world and a wish to see it function at its highest potential. You are the "Alchemist of Order," taking the raw materials of life and refining them until they reach perfection. Your soul is dedicated to service, and you find your greatest fulfillment in being useful. While you are often critical of yourself, it is only because you see the magnificent potential that others miss. You are the backbone of reality, the one who ensures the details are right so the big picture can shine.',
    love: 'In love, Virgo is a slow burn. You do not believe in the "thunderbolt" of instant romance; you believe in the steady, intentional building of a shared life. You express love through acts of service—fixing what is broken, organizing the chaos, and providing a stable foundation for your partner. You are a discerning lover, seeking a partner who values growth, integrity, and self-improvement as much as you do. You can be reserved in your displays of affection, but your loyalty is absolute. You notice the small things—your partner’s favorite tea, the way they like their pillows—and you use that knowledge to create a life of quiet, perfect harmony. To be loved by a Virgo is to be truly supported in your journey toward becoming your best self.',
    friends: 'You are the "fixer" in your friend group. When a friend has a crisis, you are the one they call to help them make a plan. You provide the most practical, grounded advice, and you are always willing to do the hard work that others avoid. You value honesty and reliability in your friends and have little patience for drama or flakey behavior. While you may seem reserved at first, you are a deeply witty and observant companion. You show your friendship through your actions, not just your words. You are the one who proofreads the resume, helps with the move, and remembers the specific dietary needs of everyone at the dinner party.',
    career: 'Virgo excels in any field that requires precision, analysis, and a commitment to excellence. You are the perfect editor, researcher, scientist, or healthcare professional. You have a natural talent for organization and can turn the most disorganized project into a streamlined success. You are a hard worker who takes immense pride in a job well done, regardless of whether you receive public recognition. You work best in environments where there are clear standards and opportunities for continuous learning. Your colleagues rely on you for your accuracy and your integrity; you are the one who ensures that the final product is not just "good enough," but truly exceptional.'
  },
  Libra: {
    dates: 'September 23 - October 22', element: 'Air', ruler: 'Venus', description: 'The Architect of Harmony',
    essence: 'Libra is the sign of the scales, the diplomat, and the aesthete. Ruled by Venus, you are on a lifelong quest for balance, beauty, and justice. You possess a natural grace and a charm that can disarm even the most difficult personality. Your soul is driven by the desire for partnership; you understand that life is more meaningful when shared. You are the "Architect of Harmony," capable of seeing every perspective and finding the middle ground where others only see conflict. You have a deep appreciation for the arts and a refined sense of style, believing that a beautiful environment is essential for a peaceful mind. Your challenge is to find balance within yourself, rather than relying on the outside world to provide it.',
    love: 'For a Libra, love is the ultimate art form. You are a romantic at heart, seeking a "soulmate" connection that is as aesthetically pleasing as it is emotionally fulfilling. You hate conflict and will go to great lengths to maintain harmony in your relationships. You are a charming and attentive partner, always considering your lover’s needs and desires. You need a partner who is your equal—someone who values communication, fairness, and a beautiful lifestyle. You are prone to indecision, as you want to ensure every choice is the "right" one for the partnership. To be loved by a Libra is to live in a world of romance, where every date is planned with care and every disagreement is handled with diplomacy and grace.',
    friends: 'In your social life, you are the peacemaker and the social butterfly. You have a vast and diverse network of friends, as your ability to adapt and find common ground makes you popular in any circle. You are the one who organizes the elegant dinners, the museum trips, and the group outings. Friends value you for your fairness, your style, and your ability to give unbiased advice. You hate to see anyone left out and are always working to ensure the group dynamic is balanced and happy. While you may struggle to say "no" to invitations, those who are close to you know that you are a deeply loyal and supportive friend who will always advocate for justice and harmony.',
    career: 'Libra excels in careers that involve negotiation, law, design, or public relations. You are a natural mediator, capable of settling disputes and finding creative solutions that satisfy all parties. You have a keen eye for aesthetics, making you a successful interior designer, fashion stylist, or art curator. You work best in partnerships or collaborative environments where you can bounce ideas off others. You are not interested in the ruthless competition of the business world; you prefer a workplace that is characterized by fairness, beauty, and mutual respect. Your colleagues appreciate your diplomacy and your ability to make the office a more pleasant and harmonious place to be.'
  },
  Scorpio: {
    dates: 'October 23 - November 21', element: 'Water', ruler: 'Pluto', description: 'The Alchemist of the Soul',
    essence: 'Scorpio is the sign of ultimate depth, intensity, and profound transformation. Ruled by Pluto, the planet of the underworld, you are the detective of the zodiac, always looking for the truth that lies beneath the surface. You are not interested in the superficial or the "easy" answers. You understand that life is a cycle of death and rebirth, and you aren\'t afraid to walk through the fire to reinvent yourself. Your presence is magnetic and often mysterious; you possess a quiet power that can be felt the moment you enter a room. You are the alchemist, taking the dark, heavy lead of human experience and turning it into the gold of wisdom and spiritual strength.',
    love: 'Love for a Scorpio is a total soul-merger. You are not interested in casual flings; you seek a connection that is all-consuming and transformative. You are famously private and will test a potential partner’s loyalty before letting them in. But once you trust, you are the most loyal and intense partner in the zodiac. You value emotional honesty above all else and can detect a lie instantly. Your passion is legendary, but it is backed by a deep, psychic connection to your beloved. To be loved by a Scorpio is to be truly known—in all your light and all your shadow—and to be held with a devotion that never wavers.',
    friends: 'Your social circle is small by design. You prefer three deep, "die-for-you" friendships over a hundred casual acquaintances. You are the friend people call when their lives are falling apart, because you are the only one who isn\'t afraid of the dark. You provide a safe space for people to reveal their secrets without judgment. However, you have zero tolerance for betrayal. If someone breaks your trust, it is nearly impossible to earn it back. You are a silent observer, often knowing more about your friends than they know about themselves, and you use that knowledge to provide the most piercingly accurate advice.',
    career: 'Scorpio thrives in careers that require investigation, psychological depth, or the handling of power. You make an exceptional surgeon, psychiatrist, private investigator, or financial strategist. You love a challenge that others find "too intense" or "too dark." You work best when you have a secret project or a complex problem to solve. You are not interested in office politics, but you are a master of strategy, often moving the pieces behind the scenes to achieve your goals. Your professional success comes from your ability to focus your will with laser-like precision until you have achieved total mastery over your field.'
  },
  Sagittarius: {
    dates: 'November 22 - December 21', element: 'Fire', ruler: 'Jupiter', description: 'The Cosmic Voyager',
    essence: 'Sagittarius is the sign of the seeker, the philosopher, and the adventurer. Ruled by Jupiter, the planet of expansion, your soul is on a permanent quest for the "Truth." You view life as a grand expedition, and you are never content to stay in one place for too long—mentally or physically. You possess an infectious optimism and a booming laugh that can fill a stadium. You are the "Cosmic Voyager," driven by a desire to understand the laws of the universe and the cultures of the world. You value freedom above all else and possess a blunt honesty that, while sometimes shocking, is always rooted in a sincere search for authenticity. You are the one who asks "Why?" and refuses to stop until you find an answer that satisfies your soul.',
    love: 'In love, Sagittarius seeks a fellow traveler. You need a partner who is your co-pilot, someone who is ready to pack a bag and head to a new country on a moment\'s notice. You are fun-loving and adventurous in romance, viewing a relationship as a way to expand your world. You have a deep need for independence and can become "claustrophobic" if a partner tries to tie you down too tightly. You value intellectual connection and a shared philosophy of life above all else. You are honest to a fault, sometimes lacking a filter, but your partner will always know exactly where they stand. To love a Sagittarius is to embrace a life of constant growth, laughter, and the thrill of the unknown.',
    friends: 'You are the "life of the party" and the person your friends go to when they need to be reminded of the beauty of life. You have friends in every corner of the world, from every walk of life, as your lack of prejudice and your curiosity make you a welcome guest anywhere. You are the one who organizes the hiking trips, the philosophical debates, and the wild nights out. Friends value you for your wisdom, your humor, and your ability to see the "big picture" when they are bogged down in the details. While you may be hard to pin down for a coffee date, you are a deeply generous and supportive friend who will always encourage others to reach for their highest potential.',
    career: 'Sagittarius excels in any field that involves travel, higher education, law, or publishing. You are a natural teacher, motivational speaker, travel writer, or entrepreneur. You thrive in environments that offer variety and the opportunity to interact with new ideas. You are not interested in the fine print; you are a "big picture" person who excels at vision and strategy. You work best when you have a high degree of autonomy and the freedom to set your own schedule. Your colleagues admire you for your optimism and your ability to inspire a team during difficult times. You are the one who keeps everyone looking toward the horizon, reminding them of the grand goals they are working toward.',
  },
  Capricorn: {
    dates: 'December 22 - January 19', element: 'Earth', ruler: 'Saturn', description: 'The Mountain Architect',
    essence: 'Capricorn is the sign of the master, the leader, and the sage. Ruled by Saturn, you understand the value of time, structure, and hard work. You are the "Mountain Architect," possessing the patience to build a legacy stone by stone until it reaches the stars. You carry a heavy sense of responsibility from a young age, often feeling like an "old soul" in a young body. Your strength is your discipline and your ability to remain stoic in the face of adversity. While others seek shortcuts, you understand that true mastery requires time and sacrifice. You value tradition and excellence, and you have a deep respect for those who have earned their place through effort. Your journey is upward, always climbing toward the summit of your own high standards.',
    love: 'For a Capricorn, love is a serious commitment and a partnership of equals. You do not believe in superficial attractions; you are looking for a "power couple" dynamic where both partners support each other’s ambitions. You are a traditionalist in romance, expressing your love through loyalty, stability, and providing a secure future. You may be slow to open up emotionally, as you view vulnerability as a risk, but once you have committed, you are the most reliable and steadfast partner in the zodiac. You need a partner who shares your work ethic and your respect for boundaries. To be loved by a Capricorn is to know that someone has your back for the long haul, working tirelessly to build a life of success and comfort with you.',
    friends: 'In friendship, you are the "mentor" and the wise counselor. Your friends come to you for practical, no-nonsense advice and for your unwavering reliability. You are not interested in a huge social circle; you prefer a few close, high-quality friendships that have stood the test of time. You show your friendship through your loyalty and your willingness to help your friends achieve their goals. You are the one who keeps everyone on track, the "grounded" one who ensures the group is making responsible choices. While you may seem serious, those who are close to you know that you have a dry, wicked sense of humor and a deeply caring heart that you only reveal to the trusted few.',
    career: 'Capricorn is the natural leader of the professional world. You excel in business, finance, politics, or any field that requires long-term planning and management. You are a master of strategy and can manage complex organizations with ease. You are not interested in fame for fame\'s sake; you are interested in authority and the respect that comes with a job well done. You work best in hierarchical environments where there are clear paths for advancement. You are a tireless worker, often the first in and the last out, and you expect the same level of commitment from your subordinates. Your professional success is inevitable, as your persistence and your ability to plan for the future are unmatched.',
  },
  Aquarius: {
    dates: 'January 20 - February 18', element: 'Air', ruler: 'Uranus', description: 'The Visionary Rebel',
    essence: 'Aquarius is the sign of the genius, the humanitarian, and the eccentric. Ruled by Uranus, you are the "Visionary Rebel," always looking toward the future and questioning the status quo. You possess an intellectual independence that can make you seem "detached," but your detachment is what allows you to see the world with such clarity. You are deeply concerned with the collective and the advancement of humanity, often valuing the needs of the many over the needs of the few. You are original and unconventional, refusing to fit into any box that society tries to place you in. Your soul is a lightning bolt—sudden, brilliant, and capable of changing the world in an instant. You are the bridge to the future, holding the blueprint for a better world.',
    love: 'In love, Aquarius seeks a best friend and an intellectual partner. You are a non-conformist in romance, often rejecting traditional relationship roles in favor of something more unique and experimental. You need a vast amount of personal freedom and will quickly pull away if a partner becomes too possessive or emotionally demanding. You value honesty and transparency above all else and seek a partner who is as interested in the world as they are in the relationship. You express love through shared ideas and social causes. To love an Aquarius is to embrace a relationship that is a constant intellectual adventure, where your partner will always surprise you with their insights and their commitment to their own truth.',
    friends: 'You are the person who knows everyone, yet belongs to no one. Your social network is vast and incredibly diverse, as you are drawn to people who are unique, brilliant, or "on the fringe." You are the one who brings together the most unlikely groups of people and fosters a sense of community. Friends value you for your objectivity, your brilliant insights, and your unwavering support for their individuality. You are the one who will stand up for a friend’s right to be themselves, no matter how much the world disapproves. While you may struggle with deep emotional intimacy, you are a fiercely loyal ally to those who share your vision for the future.',
    career: 'Aquarius excels in any field that involves technology, social reform, or innovative thinking. You are a natural scientist, programmer, activist, or community leader. You thrive in environments that are forward-thinking and that offer the opportunity to work for a cause. You are not interested in tradition for tradition\'s sake; you are always looking for a "better way" to do things. You work best in collaborative, non-hierarchical environments where ideas are valued more than titles. Your colleagues admire you for your originality and your ability to see solutions that no one else has considered. You are the one who drags the workplace into the future, ensuring that your organization remains relevant in a changing world.',
  },
  Pisces: {
    dates: 'February 19 - March 20', element: 'Water', ruler: 'Neptune', description: 'The Mystical Dreamer',
    essence: 'As the final sign of the zodiac, Pisces is the soul that has lived a thousand lives. Ruled by Neptune, you exist at the intersection of reality and the divine, possessing a "thin skin" that allows you to absorb the emotions and the energies of the collective. You are the "Mystical Dreamer," a poet and an artist whose soul is expressed through symbols, music, and silence. You possess a boundless compassion and a natural ability to forgive, seeing the divinity in everyone you meet. Your strength is your fluidity—you can adapt to any situation and find empathy for any struggle. Your challenge is to maintain your boundaries and not lose yourself in the sea of others\' emotions, but your gift is a direct connection to the infinite well of cosmic love.',
    love: 'Love for a Pisces is a spiritual experience. You are a "soulmate" seeker, looking for a connection that transcends the physical world. You are the most romantic and selfless partner in the zodiac, often putting your lover’s needs far above your own. You express love through a deep, psychic understanding and a willingness to merge with your partner. You need a partner who is grounded and who can provide the stability that you sometimes lack. You are sensitive and can be easily hurt by the harshness of the world, needing a relationship that is a sanctuary of gentleness and art. To be loved by a Pisces is to be truly "seen" at a soul level, cherished with a devotion that is as vast and as deep as the ocean.',
    friends: 'In friendship, you are the "confidant" and the spiritual guide. You are the one people go to when they need to be understood without words. You have an incredible ability to listen and to hold space for others\' pain, often acting as a mirror that reflects back their own beauty. You value deep, emotional connections and are drawn to friends who are sensitive, creative, or in need of healing. You are the one who remembers the dream a friend told you years ago and understands the hidden meaning behind it. While you may need periods of solitude to "recharge" your emotional batteries, those who are close to you know that you are a deeply compassionate friend who will never judge them.',
    career: 'Pisces excels in any field that involves healing, the arts, or spirituality. You are a natural therapist, musician, painter, or spiritual teacher. You have a powerful imagination and can bring a touch of magic to even the most mundane task. You are not interested in the cold metrics of success; you are interested in the impact your work has on the human soul. You work best in environments that are creative, flexible, and supportive. You are not a "ladder climber"; you are a "flow seeker," following your intuition to wherever you can be of the most service. Your colleagues value you for your kindness, your creativity, and your ability to bring a sense of peace to the workplace.'
  }
};

function getSunSignDates(sign) { return signData[sign]?.dates || 'Unknown'; }
function getSunSignElement(sign) { return signData[sign]?.element || 'Unknown'; }
function getSunSignRuler(sign) { return signData[sign]?.ruler || 'Unknown'; }
function getSunSignDescription(sign) { return signData[sign]?.description || 'Your Sun Sign'; }
function getSunSignEssence(sign) { return signData[sign]?.essence || 'Your unique astrological essence.'; }
function getSunSignLove(sign) { return signData[sign]?.love || 'Your approach to love and relationships.'; }
function getSunSignFriends(sign) { return signData[sign]?.friends || 'Your approach to friendships.'; }
function getSunSignCareer(sign) { return signData[sign]?.career || 'Your approach to career and ambition.'; }

export default Sun;