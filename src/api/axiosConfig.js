import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor — automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aidoc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data and handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    // Redirect to login on 401/403
    if (status === 401 || status === 403) {
      localStorage.removeItem('aidoc_token');
      localStorage.removeItem('aidoc_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
