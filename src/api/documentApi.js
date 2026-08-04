import api from './axiosConfig';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAllDocuments = async () => {
  return api.get('/documents');
};

export const deleteDocument = async (id) => {
  return api.delete(`/documents/${id}`);
};
