import api from './axiosConfig';

export const getCurrentUserProfile = async () => {
  return api.get('/users/me');
};

export const updateProfile = async (fullName, avatarUrl) => {
  return api.put('/users/me', { fullName, avatarUrl });
};

export const getAllUsers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.query) queryParams.append('query', params.query);
  if (params.role) queryParams.append('role', params.role);
  if (params.provider) queryParams.append('provider', params.provider);
  if (params.status) queryParams.append('status', params.status);
  if (params.page !== undefined) queryParams.append('page', params.page);
  if (params.size !== undefined) queryParams.append('size', params.size);

  return api.get(`/users/all?${queryParams.toString()}`);
};

export const getUserDetail = async (userId) => {
  return api.get(`/users/${userId}`);
};

export const updateUserStatus = async (userId, role, status) => {
  return api.patch(`/users/${userId}/status`, { role, status });
};

export const deleteUser = async (userId) => {
  return api.delete(`/users/${userId}`);
};

// Session Management APIs
export const getActiveSessions = async () => {
  return api.get('/sessions/active');
};

export const revokeSession = async (sessionId) => {
  return api.delete(`/sessions/revoke/${sessionId}`);
};

export const revokeOtherSessions = async () => {
  return api.delete('/sessions/revoke-others');
};
