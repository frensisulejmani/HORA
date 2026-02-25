let BASE_URL = process.env.HORA_API_BASE_URL || 'http://localhost:5000';
let AUTH_TOKEN = null;

function setBaseUrl(url) {
  BASE_URL = url.replace(/\/$/, '');
}

function setAuthToken(token) {
  AUTH_TOKEN = token || null;
}

async function http(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Users
async function registerUser(payload) {
  return http('POST', '/api/users/register', payload);
}

async function loginUser(payload) {
  return http('POST', '/api/users/login', payload);
}

async function getMe() {
  return http('GET', '/api/users/me');
}

async function updateProfile(payload) {
  return http('PUT', '/api/users/profile', payload);
}

// Astro
async function getNatal(payload) {
  return http('POST', '/api/astro/natal', payload);
}

// AI Reading
async function generateReading(payload) {
  return http('POST', '/api/ai/reading', payload);
}

async function interpretDream(payload) {
  return http('POST', '/api/ai/dream', payload);
}

async function pastLife(payload) {
  return http('POST', '/api/ai/past-life', payload);
}

async function getDailyQuiz() {
  return http('GET', '/api/quiz/daily');
}

async function submitQuiz(payload) {
  return http('POST', '/api/quiz/submit', payload);
}

async function dailyCheckin() {
  return http('POST', '/api/gamify/checkin');
}

// Human Design
async function generateHumanDesign(payload) {
  return http('POST', '/api/hd/design', payload);
}

module.exports = {
  setBaseUrl,
  setAuthToken,
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getNatal,
  generateReading,
  generateHumanDesign
  ,interpretDream
  ,pastLife
  ,getDailyQuiz
  ,submitQuiz
  ,dailyCheckin
};


