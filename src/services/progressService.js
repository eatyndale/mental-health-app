import api from './api';

export const progressService = {
  getProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getMoodHistory: async () => {
    const response = await api.get('/progress/mood');
    return response.data;
  },

  getAnxietyHistory: async () => {
    const response = await api.get('/progress/anxiety');
    return response.data;
  },

  getDepressionHistory: async () => {
    const response = await api.get('/progress/depression');
    return response.data;
  },
}; 