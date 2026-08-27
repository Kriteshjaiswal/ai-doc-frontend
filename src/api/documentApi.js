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

export const getDocumentById = async (id) => {
  return api.get(`/documents/${id}`);
};

export const getDocumentAnalysis = async (id) => {
  return api.get(`/documents/${id}/analysis`);
};

export const reanalyzeDocument = async (id) => {
  return api.post(`/documents/${id}/analyze`);
};

export const renameDocument = async (id, newFileName) => {
  return api.patch(`/documents/${id}/rename`, { newFileName });
};

export const executeQuickAction = async (id, action, targetLanguage, scope, page) => {
  return api.post(`/documents/${id}/quick-action`, {
    action,
    targetLanguage,
    scope,
    page,
  });
};

export const getDocumentFileUrl = (id) => {
  const baseURL = api.defaults.baseURL || '/api';
  const token = localStorage.getItem('aidoc_token');
  return `${baseURL}/documents/${id}/file${token ? `?token=${encodeURIComponent(token)}` : ''}`;
};

export const getDocumentPageUrl = (id, pageNumber) => {
  const baseURL = api.defaults.baseURL || '/api';
  const token = localStorage.getItem('aidoc_token');
  return `${baseURL}/documents/${id}/pages/${pageNumber}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
};

export const fetchDocumentPageBlob = async (id, pageNumber) => {
  const baseURL = api.defaults.baseURL || '/api';
  const token = localStorage.getItem('aidoc_token');
  const res = await fetch(`${baseURL}/documents/${id}/pages/${pageNumber}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Failed to render page ${pageNumber}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const getDocumentNotes = async (id) => {
  return api.get(`/documents/${id}/notes`);
};

export const addDocumentNote = async (id, note) => {
  return api.post(`/documents/${id}/notes`, note);
};

export const deleteDocumentNote = async (id, noteId) => {
  return api.delete(`/documents/${id}/notes/${noteId}`);
};

export const getDocumentBookmarks = async (id) => {
  return api.get(`/documents/${id}/bookmarks`);
};

export const addDocumentBookmark = async (id, bookmark) => {
  return api.post(`/documents/${id}/bookmarks`, bookmark);
};

export const deleteDocumentBookmark = async (id, bookmarkId) => {
  return api.delete(`/documents/${id}/bookmarks/${bookmarkId}`);
};

export const deleteDocument = async (id) => {
  return api.delete(`/documents/${id}`);
};
