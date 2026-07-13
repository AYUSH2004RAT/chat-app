import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error || error?.message || 'Network error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: async (username) => {
    const { data } = await api.post('/api/auth/login', { username });
    return data.data;
  },
  getOnlineUsers: async () => {
    const { data } = await api.get('/api/auth/online');
    return data.data;
  },
};

export const messagesAPI = {
  getHistory: async (limit = 100) => {
    const { data } = await api.get(`/api/messages?limit=${limit}`);
    return data.data;
  },
};

export default api;
