import { REDIS_CONFIG, APP_CONFIG } from '../config';
import axios from 'axios';

class CacheService {
  constructor() {
    this.host = REDIS_CONFIG.host;
    this.port = REDIS_CONFIG.port;
    this.password = REDIS_CONFIG.password;
  }

  async get(key) {
    try {
      const response = await axios.get(`${this.host}:${this.port}/cache/${key}`, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = APP_CONFIG.cache.stories) {
    try {
      await axios.post(`${this.host}:${this.port}/cache/${key}`, {
        value,
        ttl
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await axios.delete(`${this.host}:${this.port}/cache/${key}`, {
        headers: {
          'X-Password': this.password
        }
      });
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const response = await axios.get(`${this.host}:${this.port}/cache/${key}/exists`, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async ttl(key) {
    try {
      const response = await axios.get(`${this.host}:${this.port}/cache/${key}/ttl`, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data.ttl;
    } catch (error) {
      console.error('Cache ttl error:', error);
      return -1;
    }
  }

  async increment(key, amount = 1) {
    try {
      const response = await axios.post(`${this.host}:${this.port}/cache/${key}/increment`, {
        amount
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data.value;
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  async decrement(key, amount = 1) {
    try {
      const response = await axios.post(`${this.host}:${this.port}/cache/${key}/decrement`, {
        amount
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data.value;
    } catch (error) {
      console.error('Cache decrement error:', error);
      return null;
    }
  }

  async getMultiple(keys) {
    try {
      const response = await axios.post(`${this.host}:${this.port}/cache/mget`, {
        keys
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data;
    } catch (error) {
      console.error('Cache getMultiple error:', error);
      return {};
    }
  }

  async setMultiple(entries, ttl = APP_CONFIG.cache.stories) {
    try {
      await axios.post(`${this.host}:${this.port}/cache/mset`, {
        entries,
        ttl
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return true;
    } catch (error) {
      console.error('Cache setMultiple error:', error);
      return false;
    }
  }

  async deleteMultiple(keys) {
    try {
      await axios.post(`${this.host}:${this.port}/cache/mdel`, {
        keys
      }, {
        headers: {
          'X-Password': this.password
        }
      });
      return true;
    } catch (error) {
      console.error('Cache deleteMultiple error:', error);
      return false;
    }
  }

  async clear() {
    try {
      await axios.delete(`${this.host}:${this.port}/cache/clear`, {
        headers: {
          'X-Password': this.password
        }
      });
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  async getKeys(pattern = '*') {
    try {
      const response = await axios.get(`${this.host}:${this.port}/cache/keys`, {
        params: { pattern },
        headers: {
          'X-Password': this.password
        }
      });
      return response.data.keys;
    } catch (error) {
      console.error('Cache getKeys error:', error);
      return [];
    }
  }

  async getStats() {
    try {
      const response = await axios.get(`${this.host}:${this.port}/cache/stats`, {
        headers: {
          'X-Password': this.password
        }
      });
      return response.data;
    } catch (error) {
      console.error('Cache getStats error:', error);
      return null;
    }
  }
}

// Create a singleton instance
const cacheService = new CacheService();

export default cacheService; 