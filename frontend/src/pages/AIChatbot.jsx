import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api'; // Import the default api instance

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Greetings, traveler. I am the Hora Oracle. Ask me about your Natal Chart, Human Design, or Destiny Matrix. The stars are listening.",
      sender: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  const chatWindowRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Star Background Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random(),
          speed: Math.random() * 0.005 + 0.002,
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resize);
    resize();
    drawStars();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Auto-scroll to bottom of chat ---
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      // Call the general chat endpoint directly using api.post
      const response = await api.post('/api/ai/chat', {
        message: currentInput
      });
      
      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (err) {
      console.error('AI Chat Error:', err);
      setError('The cosmic connection was interrupted. Please try again.');
      
      const errorResponse = {
        id: Date.now() + 1,
        text: 'The stars are temporarily obscured. Please try asking again in a moment.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const tags = ["Natal Chart", "Human Design", "Destiny Matrix", "Zodiac"];

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-hidden">
      {/* Background Layers */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-1" />
      <div className="fixed inset-0 z-2 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 bg-[radial-gradient(circle,rgba(168,85,247,0.4),transparent_70%)] animate-[drift_15s_infinite_alternate_ease-in-out]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-30 px-5 pb-15">
        <div className="w-full max-w-200 h-[75vh] bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-[rgba(168,85,247,0.3)] rounded-3xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Chat Window */}
          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth scrollbar-thin scrollbar-thumb-purple-500"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-4 rounded-[18px] text-[0.95rem] leading-normal whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'self-end bg-[rgba(168,85,247,0.2)] border border-cosmic-primary text-white'
                    : 'self-start bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="self-start bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4 rounded-[18px] text-[0.95rem] opacity-70 animate-pulse">
                Reading the constellations...
              </div>
            )}
          </div>

          {/* Topic Tags */}
          <div className="flex flex-wrap justify-center gap-2.5 px-6 pb-4">
            {tags.map((tag) => (
              <span 
                key={tag}
                onClick={() => setInputValue(tag)}
                className="text-[0.7rem] py-1 px-3 rounded-full bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.3)] text-cosmic-primary uppercase tracking-widest cursor-pointer hover:bg-[rgba(168,85,247,0.2)] hover:border-cosmic-primary transition-all"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[rgba(0,0,0,0.2)] border-t border-[rgba(255,255,255,0.05)] flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
              placeholder="Type your cosmic question..."
              disabled={isTyping}
              className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] p-4 rounded-xl text-white outline-none focus:border-cosmic-primary transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping}
              className="bg-cosmic-primary hover:bg-[#9333ea] text-white w-12.5 h-12.5 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(4%, 6%) scale(1.1); }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #a855f7;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AIChatbot;