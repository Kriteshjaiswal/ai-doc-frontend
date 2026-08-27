import api from './axiosConfig';

export const askQuestion = async (arg1, arg2) => {
  let documentId = null;
  let question = '';

  // Flexibly handle (documentId, question) OR (question, documentId)
  if (typeof arg1 === 'number' || (typeof arg1 === 'string' && !isNaN(Number(arg1)) && isFinite(arg1))) {
    documentId = Number(arg1);
    question = arg2;
  } else if (typeof arg2 === 'number' || (typeof arg2 === 'string' && !isNaN(Number(arg2)) && isFinite(arg2))) {
    documentId = Number(arg2);
    question = arg1;
  } else {
    documentId = arg1;
    question = arg2;
  }

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
