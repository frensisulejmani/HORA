import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Globe, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const canvasRef = useRef(null);

  // --- Star Animation System (Consistent with your About page) ---
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

    const initStars = () => {
      stars = [];
      const count = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random(),
          speed: Math.random() * 0.01 + 0.002,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0.1) star.speed = -star.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
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

  const policySections = [
    {
      icon: <Database size={28} />,
      title: "Data Collection",
      content: "To provide accurate astrological readings, we collect birth data including date, exact time, and location of birth. This data is used solely for generating your celestial charts and personalized 'Hora AI' insights."
    },
    {
      icon: <Lock size={28} />,
      title: "Security & Encryption",
      content: "Your personal details are encrypted using industry-standard SSL/TLS protocols. We store your cosmic profile in secure, partitioned databases to prevent unauthorized access."
    },
    {
      icon: <EyeOff size={28} />,
      title: "Third-Party Disclosure",
      content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This excludes trusted partners who assist us in operating our website, so long as they keep this information confidential."
    },
    {
      icon: <Globe size={28} />,
      title: "Cookies & Tracking",
      content: "Hora uses 'cookies' to enhance your experience, such as remembering your birth chart settings. You can choose to disable cookies through your browser settings, though some features may lose functionality."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden relative font-sans">
      {/* Background Layer */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 pointer-events-none" />
      
      {/* Background Glows */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-cosmic-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#3b82f6]/15 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmic-primary/10 text-cosmic-primary mb-6 border border-cosmic-primary/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/40 uppercase tracking-[2px] text-xs font-semibold">
            Last Updated: October 2023
          </p>
        </div>

        {/* Intro Card */}
        <section className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg mb-12">
          <p className="text-white/70 leading-relaxed italic">
            "At Hora, we believe your spiritual journey is private. This policy outlines our commitment to protecting the cosmic data you entrust to us while bridging ancient wisdom with modern security."
          </p>
        </section>

        {/* Policy Grid */}
        <div className="space-y-6 mb-16">
          {policySections.map((section, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-3xl bg-white/3 border border-white/5 hover:border-cosmic-primary/30 transition-all duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 rounded-2xl bg-white/5 text-cosmic-primary group-hover:bg-cosmic-primary group-hover:text-white transition-all duration-500">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{section.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Content Placeholder */}
        <div className="prose prose-invert max-w-none text-white/40 text-sm space-y-8 px-4 border-l border-white/10">
          <section>
            <h4 className="text-white/80 font-medium text-lg flex items-center gap-2">
              <Bell size={18} /> Changes to this Policy
            </h4>
            <p>
              We reserve the right to update this policy as we refine our technology. Users will be notified of significant changes via the email address associated with their account or through a prominent notice on our application.
            </p>
          </section>

          <section>
            <h4 className="text-white/80 font-medium text-lg">Contact Our Privacy Officer</h4>
            <p>
              If you have questions regarding your data, celestial or otherwise, please reach out to our team at 
              <span className="text-cosmic-primary ml-1">privacy@hora-astrology.com</span>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;