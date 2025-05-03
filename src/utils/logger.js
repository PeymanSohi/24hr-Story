import axios from 'axios';

const LOG_SERVER = 'http://localhost:5000';

class Logger {
  static async log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
      type: '24hr-story'
    };

    try {
      // Send log to Logstash
      await axios.post(LOG_SERVER, logEntry);
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${level.toUpperCase()}] ${message}`, data);
      }
    } catch (error) {
      console.error('Failed to send log to Logstash:', error);
    }
  }

  static info(message, data = {}) {
    return this.log('info', message, data);
  }

  static error(message, data = {}) {
    return this.log('error', message, data);
  }

  static warn(message, data = {}) {
    return this.log('warn', message, data);
  }

  static debug(message, data = {}) {
    return this.log('debug', message, data);
  }
}

export default Logger; 