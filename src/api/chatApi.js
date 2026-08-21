import api from './axiosConfig';

export const askQuestion = async (documentId, question) => {
  return api.post('/chat/ask', { documentId, question });
};

export const getChatHistory = async (documentId) => {
  if (documentId) {
    return api.get(`/chat/history/${documentId}`);
  }
  return api.get('/chat/history');
};

export const deleteChat = async (chatId) => {
  return api.delete(`/chat/${chatId}`);
};

export const deleteChatsByDocument = async (documentId) => {
  return api.delete(`/chat/document/${documentId}`);
};

