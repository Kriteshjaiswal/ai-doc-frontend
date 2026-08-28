import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api',
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

// Response interceptor — unwrap data and handle auth errors cleanly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/oauth');

    // Only redirect to login on 401/403 for PROTECTED endpoints, not during login/register!
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      localStorage.removeItem('aidoc_token');
      localStorage.removeItem('aidoc_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Extract exact backend error message if available
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail;

    if (!message) {
      if (status === 400) {
        message = 'Invalid request. Please check your inputs.';
      } else if (status === 401) {
        message = 'Invalid email or password. Please verify your credentials.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status === 409) {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (status === 413) {
        message = 'File size is too large (maximum 50MB allowed).';
      } else if (status >= 500) {
        message = 'Server encountered an issue. Please try again in a moment.';
      } else if (!error.response && error.request) {
        message = 'Unable to connect to server. Please check your network or server status.';
      } else {
        message = error.message || 'An unexpected error occurred. Please try again.';
      }
    }

    const customError = new Error(message);
    customError.status = status;
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default api;
