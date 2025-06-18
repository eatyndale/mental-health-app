import api from './api';

export const eftService = {
  startSession: async (problemDescription, initialIntensity) => {
    const response = await api.post('/eft/generate', {
      problem_description: problemDescription,
      initial_intensity: initialIntensity,
    });
    return response.data;
  },

  completeSession: async (sessionId, finalIntensity) => {
    const response = await api.put(`/eft/${sessionId}/complete`, {
      final_intensity: finalIntensity,
    });
    return response.data;
  },

  getSessionHistory: async () => {
    const response = await api.get('/eft/history');
    return response.data;
  },
}; 