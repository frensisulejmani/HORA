import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, astroAPI } from '../services/api';
import LocationPicker from '../components/LocationPicker';

const Onboarding = () => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthCoordinates, setBirthCoordinates] = useState({ latitude: 0, longitude: 0 });
  const navigate = useNavigate();
  const { user, loading: authLoading, refetchUser } = useAuth();

  // Simple timezone calculation from longitude
  const calculateTimezone = (longitude) => {
    let tz = Math.round(longitude / 15);
    return Math.max(-12, Math.min(14, tz));
  };

  useEffect(() => {
    const starArray = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(starArray);

    // Wait for auth to load, then check if user is logged in
    if (authLoading) return;
    
    if (!user) {
      navigate('/login');
    } else if (user.birth && user.birth.date && user.birth.place) {
      // User already has birth info, go to home
      navigate('/home');
    }
  }, [user, authLoading, navigate]);

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.target);

      const birthData = {
        date: Number(formData.get('date')),
        month: Number(formData.get('month')),
        year: Number(formData.get('year')),
        hour: Number(formData.get('hour')),
        minute: Number(formData.get('minute')),
        place: birthPlace,
        latitude: birthCoordinates.latitude || 0,
        longitude: birthCoordinates.longitude || 0,
        timezone: calculateTimezone(birthCoordinates.longitude || 0)
      };

      // Validate birth data
      if (birthData.date < 1 || birthData.date > 31) {
        setError('Please enter a valid day (1-31)');
        setLoading(false);
        return;
      }
      if (birthData.month < 1 || birthData.month > 12) {
        setError('Please enter a valid month (1-12)');
        setLoading(false);
        return;
      }
      if (birthData.year < 1900 || birthData.year > new Date().getFullYear()) {
        setError('Please enter a valid birth year');
        setLoading(false);
        return;
      }
      if (birthData.hour < 0 || birthData.hour > 23) {
        setError('Please enter a valid hour (0-23)');
        setLoading(false);
        return;
      }
      if (birthData.minute < 0 || birthData.minute > 59) {
        setError('Please enter a valid minute (0-59)');
        setLoading(false);
        return;
      }
      if (!birthPlace.trim()) {
        setError('Please select your birth place');
        setLoading(false);
        return;
      }

      // Save birth data to user profile
      await authAPI.updateProfile({ birth: birthData });

      // Refetch user to get updated birth data
      await refetchUser();

      // Fetch astrological data using the API with correct format
      const chartResponse = await astroAPI.getNatal({
        date: birthData.date,
        month: birthData.month,
        year: birthData.year,
        hour: birthData.hour,
        minute: birthData.minute,
        latitude: birthData.latitude || 0,
        longitude: birthData.longitude || 0,
        timezone: birthData.timezone || 0
      });

      console.log('Astrological Chart:', chartResponse.data);
      
      // Navigate to home - the fresh user data with birth info will be loaded
      navigate('/home');
    } catch (err) {
      console.error('Error completing profile:', err);
      setError(err.response?.data?.message || 'Failed to calculate your chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-cosmic-bg overflow-hidden text-white">
      
      {/* --- Left Side: Branding --- */}
      <section className="relative hidden lg:flex flex-1 flex-col justify-end p-16 overflow-hidden">
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

        <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-cosmic-primary opacity-20 blur-[100px] rounded-full" />

        <div className="absolute top-10 left-10 flex items-center gap-3 z-10">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
          <span className="text-white text-xl font-bold">Hora</span>
        </div>

        <h1 className="text-white/80 text-7xl font-black leading-none z-10 select-none">
          Almost<br />There!
        </h1>
      </section>

      {/* --- Right Side: Form --- */}
      <section className="flex-[1.1] flex items-center justify-center p-5 bg-cosmic-bg lg:bg-transparent">
        <div className="bg-white/85 backdrop-blur-md w-full max-w-137.5 h-[94vh] p-10 rounded-[50px] overflow-y-auto scrollbar-hide text-gray-900">
          
          <h2 className="text-3xl font-extrabold mb-2">Final Steps</h2>
          <p className="text-gray-600 mb-8 text-sm">We need your birth details to calculate your cosmic chart accurately.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCompleteProfile} className="space-y-6">
            
            {/* Date of Birth Grid */}
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-1">Date of Birth</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Day</label>
                  <input name="date" type="number" placeholder="DD" min="1" max="31" className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cosmic-primary/20" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Month</label>
                  <input name="month" type="number" placeholder="MM" min="1" max="12" className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cosmic-primary/20" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Year</label>
                  <input name="year" type="number" placeholder="YYYY" min="1900" max={new Date().getFullYear()} className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cosmic-primary/20" required />
                </div>
              </div>
            </div>

            {/* Time of Birth Grid */}
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-1">Time of Birth</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hour (0-23)</label>
                  <input name="hour" type="number" placeholder="14" min="0" max="23" className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cosmic-primary/20" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Minute</label>
                  <input name="minute" type="number" placeholder="30" min="0" max="59" className="w-full p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cosmic-primary/20" required />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-1">Location</div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Birth Place</label>
                <LocationPicker
                  value={birthPlace}
                  onChange={setBirthPlace}
                  onCoordinatesChange={setBirthCoordinates}
                  placeholder="Search city, country..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#240334] text-white rounded-[30px] font-bold mt-4 hover:scale-[1.02] transition-transform shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating Your Chart...' : 'Calculate My Chart'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Onboarding;