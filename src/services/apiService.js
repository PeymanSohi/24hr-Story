import axios from 'axios';
import { API_URL, ERROR_MESSAGES } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken
          });

          const { token } = response.data;
          localStorage.setItem('token', token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || ERROR_MESSAGES.server;
    return Promise.reject(new Error(errorMessage));
  }
);

class ApiService {
  // Auth endpoints
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  // User endpoints
  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }

  async changePassword(passwordData) {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Story endpoints
  async createStory(storyData) {
    const response = await api.post('/stories', storyData);
    return response.data;
  }

  async getStories(page = 1, limit = 10) {
    const response = await api.get('/stories', {
      params: { page, limit }
    });
    return response.data;
  }

  async getStoryById(id) {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  }

  async updateStory(id, storyData) {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  }

  async deleteStory(id) {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  }

  async likeStory(id) {
    const response = await api.post(`/stories/${id}/like`);
    return response.data;
  }

  async unlikeStory(id) {
    const response = await api.delete(`/stories/${id}/like`);
    return response.data;
  }

  async addComment(storyId, comment) {
    const response = await api.post(`/stories/${storyId}/comments`, { comment });
    return response.data;
  }

  async getComments(storyId, page = 1, limit = 10) {
    const response = await api.get(`/stories/${storyId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Search endpoints
  async searchStories(query, page = 1, limit = 10) {
    const response = await api.get('/stories/search', {
      params: { query, page, limit }
    });
    return response.data;
  }

  async searchUsers(query, page = 1, limit = 10) {
    const response = await api.get('/users/search', {
      params: { query, page, limit }
    });
    return response.data;
  }

  // Social endpoints
  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  }

  async unfollowUser(userId) {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  }

  async getFollowers(userId, page = 1, limit = 10) {
    const response = await api.get(`/users/${userId}/followers`, {
      params: { page, limit }
    });
    return response.data;
  }

  async getFollowing(userId, page = 1, limit = 10) {
    const response = await api.get(`/users/${userId}/following`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Notification endpoints
  async getNotifications(page = 1, limit = 10) {
    const response = await api.get('/notifications', {
      params: { page, limit }
    });
    return response.data;
  }

  async markNotificationAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }

  // Analytics endpoints
  async trackEvent(category, action, label) {
    const response = await api.post('/analytics/event', {
      category,
      action,
      label
    });
    return response.data;
  }

  async getAnalytics(startDate, endDate) {
    const response = await api.get('/analytics', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  // Health check
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 