import { ANALYTICS_CONFIG, FEATURES } from '../config';
import loggerService from './loggerService';

class AnalyticsService {
  constructor() {
    this.enabled = ANALYTICS_CONFIG.enabled;
    this.trackingId = ANALYTICS_CONFIG.trackingId;
    this.initialized = false;
    this.queue = [];
  }

  initialize() {
    if (!this.enabled || this.initialized) return;

    try {
      // Initialize Google Analytics
      if (this.trackingId) {
        this.loadGoogleAnalytics();
      }

      // Initialize custom analytics
      this.initializeCustomAnalytics();

      this.initialized = true;
      this.processQueue();
    } catch (error) {
      loggerService.error('Failed to initialize analytics', error);
    }
  }

  loadGoogleAnalytics() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.trackingId);
  }

  initializeCustomAnalytics() {
    // Initialize any custom analytics services here
    if (FEATURES.enableAnalytics) {
      // Add custom analytics initialization code
    }
  }

  processQueue() {
    while (this.queue.length > 0) {
      const { type, data } = this.queue.shift();
      this.trackEvent(type, data);
    }
  }

  trackEvent(category, action, label = null, value = null) {
    if (!this.enabled) return;

    const eventData = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };

    if (!this.initialized) {
      this.queue.push({ type: 'event', data: eventData });
      return;
    }

    try {
      // Track in Google Analytics
      if (window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
      }

      // Track in custom analytics
      this.trackCustomEvent(eventData);

      // Log the event
      loggerService.info('Analytics Event', eventData);
    } catch (error) {
      loggerService.error('Failed to track analytics event', error);
    }
  }

  trackCustomEvent(eventData) {
    if (FEATURES.enableAnalytics) {
      // Add custom event tracking logic here
      // This could include sending to your own analytics endpoint
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      }).catch(error => {
        loggerService.error('Failed to send custom analytics event', error);
      });
    }
  }

  trackPageView(path, title) {
    if (!this.enabled) return;

    const pageData = {
      path,
      title,
      timestamp: new Date().toISOString()
    };

    if (!this.initialized) {
      this.queue.push({ type: 'pageview', data: pageData });
      return;
    }

    try {
      // Track in Google Analytics
      if (window.gtag) {
        window.gtag('config', this.trackingId, {
          page_path: path,
          page_title: title
        });
      }

      // Track in custom analytics
      this.trackCustomPageView(pageData);

      // Log the page view
      loggerService.info('Analytics Page View', pageData);
    } catch (error) {
      loggerService.error('Failed to track page view', error);
    }
  }

  trackCustomPageView(pageData) {
    if (FEATURES.enableAnalytics) {
      // Add custom page view tracking logic here
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      }).catch(error => {
        loggerService.error('Failed to send custom page view', error);
      });
    }
  }

  trackUserAction(userId, action, details = null) {
    if (!this.enabled) return;

    const actionData = {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };

    this.trackEvent('user_action', action, userId, null);
    this.trackCustomUserAction(actionData);
  }

  trackCustomUserAction(actionData) {
    if (FEATURES.enableAnalytics) {
      fetch('/api/analytics/user-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionData)
      }).catch(error => {
        loggerService.error('Failed to send custom user action', error);
      });
    }
  }

  trackError(error, context = null) {
    if (!this.enabled) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };

    this.trackEvent('error', 'application_error', error.message);
    this.trackCustomError(errorData);
  }

  trackCustomError(errorData) {
    if (FEATURES.enableAnalytics) {
      fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      }).catch(error => {
        loggerService.error('Failed to send custom error tracking', error);
      });
    }
  }

  trackPerformance(metric) {
    if (!this.enabled) return;

    const performanceData = {
      ...metric,
      timestamp: new Date().toISOString()
    };

    this.trackEvent('performance', metric.name, null, metric.value);
    this.trackCustomPerformance(performanceData);
  }

  trackCustomPerformance(performanceData) {
    if (FEATURES.enableAnalytics) {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(performanceData)
      }).catch(error => {
        loggerService.error('Failed to send custom performance tracking', error);
      });
    }
  }

  setUserProperties(userId, properties) {
    if (!this.enabled) return;

    const userData = {
      userId,
      properties,
      timestamp: new Date().toISOString()
    };

    if (window.gtag) {
      window.gtag('set', 'user_id', userId);
      Object.entries(properties).forEach(([key, value]) => {
        window.gtag('set', `user_${key}`, value);
      });
    }

    this.trackCustomUserProperties(userData);
  }

  trackCustomUserProperties(userData) {
    if (FEATURES.enableAnalytics) {
      fetch('/api/analytics/user-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      }).catch(error => {
        loggerService.error('Failed to send custom user properties', error);
      });
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService; 