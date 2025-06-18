import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authService = {
  async signup(userData) {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  },

  async login(credentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
    return response.data;
  },

  async getProfile(token) {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async resetPassword(email) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
    return response.data;
  },

  async updatePassword(token, newPassword) {
    const response = await axios.post(`${API_URL}/auth/update-password`, {
      token,
      new_password: newPassword
    });
    return response.data;
  }
};

export default authService; 