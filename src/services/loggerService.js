import { APP_CONFIG } from '../config';

class LoggerService {
  constructor() {
    this.isDevelopment = APP_CONFIG.environment === 'development';
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    };
    this.currentLogLevel = this.isDevelopment ? this.logLevels.DEBUG : this.logLevels.INFO;
  }

  setLogLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLogLevel = this.logLevels[level];
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = {
      timestamp,
      level,
      message,
      environment: APP_CONFIG.environment,
      version: APP_CONFIG.version
    };

    if (data) {
      formattedMessage.data = data;
    }

    return formattedMessage;
  }

  log(level, message, data = null) {
    if (this.logLevels[level] >= this.currentLogLevel) {
      const formattedMessage = this.formatMessage(level, message, data);

      // Log to console in development
      if (this.isDevelopment) {
        const consoleMethod = level.toLowerCase();
        if (console[consoleMethod]) {
          console[consoleMethod](formattedMessage);
        } else {
          console.log(formattedMessage);
        }
      }

      // Send to logging service in production
      if (!this.isDevelopment) {
        this.sendToLoggingService(formattedMessage);
      }
    }
  }

  async sendToLoggingService(logEntry) {
    try {
      // Send to Logstash endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Fallback to console in case of error
      console.error('Failed to send log to logging service:', error);
      console.error('Log entry:', logEntry);
    }
  }

  debug(message, data = null) {
    this.log('DEBUG', message, data);
  }

  info(message, data = null) {
    this.log('INFO', message, data);
  }

  warn(message, data = null) {
    this.log('WARN', message, data);
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : null;
    this.log('ERROR', message, errorData);
  }

  // Performance logging
  async measurePerformance(name, callback) {
    const start = performance.now();
    try {
      const result = await callback();
      const duration = performance.now() - start;
      this.info(`Performance: ${name}`, { duration });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`Performance Error: ${name}`, { duration, error });
      throw error;
    }
  }

  // API request logging
  logApiRequest(method, url, params = null, response = null, error = null) {
    const logData = {
      method,
      url,
      params,
      response: response ? {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      } : null,
      error: error ? {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      } : null
    };

    if (error) {
      this.error(`API Request Failed: ${method} ${url}`, logData);
    } else {
      this.info(`API Request: ${method} ${url}`, logData);
    }
  }

  // User action logging
  logUserAction(userId, action, details = null) {
    this.info(`User Action: ${action}`, {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Error boundary logging
  logErrorBoundary(error, errorInfo) {
    this.error('React Error Boundary Caught Error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      componentStack: errorInfo.componentStack
    });
  }

  // Navigation logging
  logNavigation(from, to) {
    this.info('Navigation', {
      from,
      to,
      timestamp: new Date().toISOString()
    });
  }

  // Feature usage logging
  logFeatureUsage(feature, userId = null, details = null) {
    this.info(`Feature Usage: ${feature}`, {
      feature,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Security event logging
  logSecurityEvent(event, userId = null, details = null) {
    this.warn(`Security Event: ${event}`, {
      event,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

// Create a singleton instance
const loggerService = new LoggerService();

export default loggerService; 