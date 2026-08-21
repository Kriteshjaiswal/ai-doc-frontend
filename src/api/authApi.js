import api from './axiosConfig';

export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async (fullName, email, password) => {
  return api.post('/auth/register', { fullName, email, password });
};

export const oauthLogin = async (provider, code, redirectUri) => {
  return api.post(`/auth/oauth/${provider}`, { code, redirectUri });
};

export const getOAuthConfig = async () => {
  return api.get('/auth/oauth/config');
};
