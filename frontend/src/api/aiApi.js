import axiosInstance from './axiosInstance';

export const sendMessage = (message) =>
  axiosInstance.post('/ai/chat', { message });

export const getConversationHistory = () =>
  axiosInstance.get('/ai/history');

export const clearHistory = () =>
  axiosInstance.delete('/ai/history');
