import api from './axiosConfig';

export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async (fullName, email, password) => {
  return api.post('/auth/register', { fullName, email, password });
};
