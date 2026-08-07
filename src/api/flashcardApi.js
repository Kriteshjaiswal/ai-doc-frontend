import api from './axiosConfig';

export const getFlashcards = async (documentId) => {
  const params = documentId ? { documentId } : {};
  return api.get('/flashcards', { params });
};

export const generateFlashcards = async (documentId, count = 5) => {
  return api.post('/flashcards/generate', null, {
    params: { documentId, count },
  });
};

export const updateFlashcardStatus = async (id, status, isFavorite) => {
  return api.put(`/flashcards/${id}/status`, { status, isFavorite });
};

export const deleteFlashcard = async (id) => {
  return api.delete(`/flashcards/${id}`);
};
