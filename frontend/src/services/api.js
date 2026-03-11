import axios from 'axios';

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // For normal authenticated calls, a 401 should log the user out.
    // But for login/register endpoints we want to show the error message
    // instead of instantly refreshing the page.
    const isAuthAttempt =
      url.includes('/api/users/login') || url.includes('/api/users/register');

    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
  getCurrentUser: () => api.get('/api/users/me'),
  updateProfile: (profileData) => api.put('/api/users/profile', profileData),
  deleteProfile: () => api.delete('/api/users/profile')
};

// Astrology endpoints
export const astroAPI = {
  getNatal: (data) => api.post('/api/astro/natal', data),
  getAstrocartography: (data) => api.post('/api/astro/astrocartography', data)
};

// AI endpoints
export const aiAPI = {
  generateReading: (data) => api.post('/api/ai/reading', data),
  interpretDream: (data) => api.post('/api/ai/dream', data),
  pastLife: (data) => api.post('/api/ai/past-life', data)
};

// Quiz endpoints
export const quizAPI = {
  getDailyQuiz: () => api.get('/api/quiz/daily'),
  submitQuiz: (data) => api.post('/api/quiz/submit', data)
};

// Gamification endpoints
export const gamifyAPI = {
  dailyCheckin: () => api.post('/api/gamify/checkin')
};

// Human Design endpoints
export const hdAPI = {
  generateHumanDesign: (data) => api.post('/api/hd/design', data)
};

// Destiny Matrix endpoints
export const destinyAPI = {
  calculateDestinyMatrix: (data) => api.post('/api/destiny/matrix', data)
};

// Auth helper to set token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Get stored token
export const getAuthToken = () => localStorage.getItem('auth_token');

// Logout helper
export const logout = () => {
  setAuthToken(null);
  window.location.href = '/login';
};

export default api;
