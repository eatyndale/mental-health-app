import api from './api';

export const crisisService = {
  getHotlines: async () => {
    const response = await api.get('/crisis/hotlines');
    return response.data;
  },

  getResources: async () => {
    const response = await api.get('/crisis/resources');
    return response.data;
  },

  getEmergencyContacts: async () => {
    const response = await api.get('/crisis/emergency-contacts');
    return response.data;
  },
}; 