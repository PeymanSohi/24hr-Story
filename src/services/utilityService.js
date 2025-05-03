import { REDIS_CONFIG, MINIO_CONFIG, APP_CONFIG } from '../config';
import axios from 'axios';

const utilityService = {
  // Cache Operations
  async getFromCache(key) {
    try {
      const response = await axios.get(`${REDIS_CONFIG.host}:${REDIS_CONFIG.port}/cache/${key}`);
      return response.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async setInCache(key, value, ttl = APP_CONFIG.cache.stories) {
    try {
      await axios.post(`${REDIS_CONFIG.host}:${REDIS_CONFIG.port}/cache/${key}`, {
        value,
        ttl
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  async deleteFromCache(key) {
    try {
      await axios.delete(`${REDIS_CONFIG.host}:${REDIS_CONFIG.port}/cache/${key}`);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  // File Operations
  async uploadFile(file, bucket = 'default') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await axios.post(`${MINIO_CONFIG.endpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  },

  async deleteFile(fileUrl) {
    try {
      await axios.delete(`${MINIO_CONFIG.endpoint}/files`, {
        data: { fileUrl }
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete file');
    }
  },

  // Validation
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > APP_CONFIG.maxFileSize) {
      throw new Error('File size exceeds limit');
    }

    if (!APP_CONFIG.supportedImageTypes.includes(file.type)) {
      throw new Error('Unsupported file type');
    }

    return true;
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password) {
    return password.length >= 8;
  },

  // Formatting
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Error Handling
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'Server error',
        status: error.response.status
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        status: 0
      };
    } else {
      // Error in request setup
      return {
        message: error.message || 'Request error',
        status: 0
      };
    }
  },

  // Pagination
  getPaginationParams(page, limit) {
    const defaultLimit = APP_CONFIG.pagination.defaultLimit;
    const maxLimit = APP_CONFIG.pagination.maxLimit;

    return {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(maxLimit, Math.max(1, parseInt(limit) || defaultLimit))
    };
  },

  // Search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Analytics
  trackEvent(category, action, label) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  },

  // Social Sharing
  shareOnSocial(platform, url, title) {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }
};

export default utilityService; 