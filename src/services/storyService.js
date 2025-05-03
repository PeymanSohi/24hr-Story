import axios from 'axios';
import { API_URL } from '../config';

const storyService = {
  async createStory(storyData) {
    try {
      const response = await axios.post(`${API_URL}/stories`, storyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create story');
    }
  },

  async getStories(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/stories`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stories');
    }
  },

  async getStoryById(id) {
    try {
      const response = await axios.get(`${API_URL}/stories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch story');
    }
  },

  async updateStory(id, storyData) {
    try {
      const response = await axios.put(`${API_URL}/stories/${id}`, storyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update story');
    }
  },

  async deleteStory(id) {
    try {
      await axios.delete(`${API_URL}/stories/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete story');
    }
  },

  async likeStory(id) {
    try {
      const response = await axios.post(`${API_URL}/stories/${id}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like story');
    }
  },

  async unlikeStory(id) {
    try {
      const response = await axios.delete(`${API_URL}/stories/${id}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike story');
    }
  },

  async addComment(storyId, comment) {
    try {
      const response = await axios.post(`${API_URL}/stories/${storyId}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  async getComments(storyId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/stories/${storyId}/comments`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  async searchStories(query, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/stories/search`, {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search stories');
    }
  },

  async getUserStories(userId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/stories`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user stories');
    }
  },

  async getTrendingStories(limit = 5) {
    try {
      const response = await axios.get(`${API_URL}/stories/trending`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trending stories');
    }
  }
};

export default storyService; 