import axios from 'axios';
import Constants from 'expo-constants';

const apiBaseUrl =
  (Constants.manifest?.extra && Constants.manifest.extra.apiBaseUrl) ||
  (Constants.expoConfig?.extra && Constants.expoConfig.extra.apiBaseUrl) ||
  'http://localhost:5000';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const hdAPI = {
  generateHumanDesign: (data) => api.post('/api/hd/design', data)
};

export const destinyAPI = {
  calculateDestinyMatrix: (data) => api.post('/api/destiny/matrix', data)
};

export const astroAPI = {
  getNatal: (data) => api.post('/api/astro/natal', data)
};

