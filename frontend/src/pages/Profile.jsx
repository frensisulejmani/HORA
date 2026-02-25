import React, { useEffect, useRef, useState } from 'react';
import { User, Edit3, Check, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, astroAPI } from '../services/api';
import LocationPicker from '../components/LocationPicker';

const Profile = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sunSign, setSunSign] = useState('');
  const [moonSign, setMoonSign] = useState('');
  const [ascendant, setAscendant] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthday: '',
    birthTime: '',
    birthPlace: '',
    latitude: 0,
    longitude: 0
  });

  // Simple timezone calculation from longitude
  const calculateTimezone = (longitude) => {
    let tz = Math.round(longitude / 15);
    return Math.max(-12, Math.min(14, tz));
  };

  // Load user data from auth context
  useEffect(() => {
    // Wait for auth loading to finish before deciding to redirect
    if (authLoading) return;

    if (user) {
      setFormData({
        fullName: user.name || user.fullName || '',
        email: user.email || '',
        birthday: user.birth?.date ? `${user.birth.year}-${String(user.birth.month).padStart(2, '0')}-${String(user.birth.date).padStart(2, '0')}` : '',
        birthTime: user.birth?.hour ? `${String(user.birth.hour).padStart(2, '0')}:${String(user.birth.minute || 0).padStart(2, '0')}` : '',
        birthPlace: user.birth?.place || ''
      });

      // Fetch astrological data if birth info available
      if (user.birth?.date) {
        fetchAstroData();
      }
    } else {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchAstroData = async () => {
    try {
      setLoading(true);
      // Fetch natal chart data with correct format
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

      if (response.data?.data) {
        // Extract the signs from the response
        const astroData = response.data.data;
        setSunSign(astroData.sunSign || 'Calculating...');
        setMoonSign(astroData.moonSign || 'Calculating...');
        setAscendant(astroData.ascendant || 'Calculating...');
      }
    } catch (err) {
      console.log('Could not fetch astro data:', err.message);
      // Fallback: just show generic message
      setSunSign('Get Chart Data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
      }));
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, s.opacity)})`;
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

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    // Validate birth info is provided (mandatory)
    if (!formData.birthday || !formData.birthTime || !formData.birthPlace) {
      setError('Birth date, time, and place are required for cosmic calculations');
      return;
    }

    // Validate date format
    if (!formData.birthday.includes('-')) {
      setError('Invalid birth date format');
      return;
    }

    setLoading(true);
    try {
      // Parse the birthday - it could be in YYYY-MM-DD format or another format
      const dateparts = formData.birthday.split('-');
      if (dateparts.length !== 3) {
        throw new Error('Invalid date format');
      }

      const year = parseInt(dateparts[0]);
      const month = parseInt(dateparts[1]);
      const dateVal = parseInt(dateparts[2]);

      if (isNaN(year) || isNaN(month) || isNaN(dateVal)) {
        throw new Error('Invalid date values');
      }

      // Parse time
      const timeparts = formData.birthTime.split(':');
      const hour = timeparts[0] ? parseInt(timeparts[0]) : 0;
      const minute = timeparts[1] ? parseInt(timeparts[1]) : 0;

      // Prepare update data
      const timezone = calculateTimezone(formData.longitude);
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        birth: {
          date: dateVal,
          month,
          year,
          hour,
          minute,
          place: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: timezone
        }
      };

      await authAPI.updateProfile(updateData);
      setIsEditing(false);
      setError('');
      alert('Your cosmic records have been updated!');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        await authAPI.deleteProfile();
        logout();
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white relative overflow-x-hidden ">
      {/* Background Elements */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-purple-500/20 blur-[100px] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 flex flex-col items-center pt-32 px-5 pb-20">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-purple-500/20 rounded-[30px] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
              Cosmic Identity
            </h1>
            <p className="text-white/60 mt-2">Welcome, {formData.fullName || 'Seeker'}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Astrological Info Display */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-purple-500/10 rounded-xl">
              <div className="text-center">
                <p className="text-purple-400 text-[10px] uppercase tracking-widest font-bold">Sun Sign</p>
                <p className="text-white text-lg font-semibold mt-2">{sunSign || 'Loading...'}</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-[10px] uppercase tracking-widest font-bold">Moon Sign</p>
                <p className="text-white text-lg font-semibold mt-2">{moonSign || 'Loading...'}</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-[10px] uppercase tracking-widest font-bold">Ascendant</p>
                <p className="text-white text-lg font-semibold mt-2">{ascendant || 'Loading...'}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 disabled:opacity-50 transition-all text-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 disabled:opacity-50 text-white"
                />
              </div>

              {/* Birth Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Birth Date</label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 disabled:opacity-50 text-white"
                />
              </div>

              {/* Birth Time */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Birth Time</label>
                <input
                  type="time"
                  disabled={!isEditing}
                  value={formData.birthTime}
                  onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 disabled:opacity-50 text-white"
                />
              </div>

              {/* Birth Place */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Birth Place (City, Country)</label>
                {isEditing ? (
                  <LocationPicker
                    value={formData.birthPlace}
                    onChange={(value) => setFormData({...formData, birthPlace: value})}
                    onCoordinatesChange={(coords) => setFormData({...formData, ...coords})}
                    placeholder="Search city, country..."
                  />
                ) : (
                  <input
                    type="text"
                    disabled={true}
                    value={formData.birthPlace}
                    className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 disabled:opacity-50 text-white"
                  />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                  
                  <button
                    type="button"
                    disabled={loading}
                    className="flex-1 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Logout
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    className="flex-1 border border-red-600/50 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 size={18} /> Delete Account
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Check size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(false);
                    }}
                    className="flex-1 border border-gray-500/50 text-gray-400 hover:bg-gray-500 hover:text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;