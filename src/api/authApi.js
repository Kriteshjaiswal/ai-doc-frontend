import api from './axiosConfig';

export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async (fullName, email, password) => {
  return api.post('/auth/register', { fullName, email, password });
};

export const verifyOtp = async (email, otpCode) => {
  return api.post('/auth/verify-otp', { email, otpCode });
};

export const verifyMagicLink = async (token) => {
  return api.post('/auth/verify-link', { token });
};

export const resendOtp = async (email) => {
  return api.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
};

export const oauthLogin = async (provider, code, redirectUri) => {
  return api.post(`/auth/oauth/${provider}`, { code, redirectUri });
};

export const getOAuthConfig = async () => {
  return api.get('/auth/oauth/config');
};

export const setLocalPassword = async (newPassword) => {
  return api.post('/auth/set-password', { newPassword });
};

export const logoutUser = async () => {
  return api.post('/auth/logout');
};
