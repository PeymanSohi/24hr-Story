import { RABBITMQ_CONFIG } from '../config';
import axios from 'axios';

class NotificationService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  connect() {
    try {
      this.socket = new WebSocket(`ws://${RABBITMQ_CONFIG.host}:${RABBITMQ_CONFIG.port}/ws`);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.authenticate();
      };

      this.socket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          this.handleNotification(notification);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.handleReconnect();
    }
  }

  authenticate() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'auth',
        username: RABBITMQ_CONFIG.username,
        password: RABBITMQ_CONFIG.password
      }));
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  handleNotification(notification) {
    const { type, data } = notification;
    const subscribers = this.subscribers.get(type) || [];
    subscribers.forEach(callback => callback(data));
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type).push(callback);

    // Subscribe to the channel if not already connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'subscribe',
        channel: type
      }));
    }
  }

  unsubscribe(type, callback) {
    if (this.subscribers.has(type)) {
      const subscribers = this.subscribers.get(type);
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        this.subscribers.delete(type);
        // Unsubscribe from the channel
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({
            type: 'unsubscribe',
            channel: type
          }));
        }
      }
    }
  }

  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${RABBITMQ_CONFIG.host}:${RABBITMQ_CONFIG.port}/notifications`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${RABBITMQ_CONFIG.host}:${RABBITMQ_CONFIG.port}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }

  async markAllAsRead() {
    try {
      const response = await axios.put(`${RABBITMQ_CONFIG.host}:${RABBITMQ_CONFIG.port}/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId) {
    try {
      await axios.delete(`${RABBITMQ_CONFIG.host}:${RABBITMQ_CONFIG.port}/notifications/${notificationId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscribers.clear();
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService; 