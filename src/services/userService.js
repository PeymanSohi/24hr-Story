import axios from 'axios';
import { API_URL } from '../config';

const userService = {
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  },

  async updateProfile(userData) {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await axios.put(`${API_URL}/users/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axios.post(`${API_URL}/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  },

  async getUserById(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  async followUser(userId) {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to follow user');
    }
  },

  async unfollowUser(userId) {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unfollow user');
    }
  },

  async getFollowers(userId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/followers`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get followers');
    }
  },

  async getFollowing(userId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/following`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get following');
    }
  },

  async searchUsers(query, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },

  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/notifications`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get notifications');
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await axios.put(`${API_URL}/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  async markAllNotificationsAsRead() {
    try {
      const response = await axios.put(`${API_URL}/users/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
};

export default userService; 