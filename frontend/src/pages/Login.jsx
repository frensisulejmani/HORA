import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [stars, setStars] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const starArray = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(starArray);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-cosmic-bg overflow-hidden]">
      
      {/* --- Left Side: Branding (Cosmic) --- */}
      <section className="relative hidden lg:flex flex-1 flex-col justify-end p-16 overflow-hidden">
        {/* Stars Background */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Purple Glow */}
        <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-cosmic-primary opacity-20 blur-[100px] rounded-full" />

        {/* Logo */}
        <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
          <img 
            src={logo}
            alt="Logo" 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <span className="text-white text-xl font-bold">Hora</span>
        </div>

        <h1 className="text-white/80 text-8xl font-black leading-none z-10 select-none">
          Hello!
        </h1>
      </section>

      {/* --- Right Side: Form --- */}
      <section className="flex-[1.1] flex items-center justify-center p-5 bg-cosmic-bg lg:bg-transparent">
        <div className="bg-white/80 backdrop-blur-sm w-full max-w-135 h-[94vh] p-10 rounded-[50px] overflow-y-auto scrollbar-hide">
          
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Log In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cosmic-primary/20 transition-all text-black"
                required 
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cosmic-primary/20 transition-all text-black"
                required 
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#240334]/90 text-white rounded-[30px] font-bold mt-4 hover:bg-[#240334] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {/* Separator */}
            <div className="relative text-center my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#240334]/30"></span>
              </div>
              <span className="relative bg-[#CFCFCF] px-4 py-1 text-xs font-bold text-black/70 rounded-md">OR</span>
            </div>

            {/* Social Auth */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                  window.location.href = `${base}/auth/google`;
                }}
                className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-300 bg-white rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-all text-black"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5" alt="Google" />
                Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account? <Link to="/signup" className="text-[#240334] font-bold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;