// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ✅ Automatically include JWT token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // assuming you save token at login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
