// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Redis Configuration
export const REDIS_CONFIG = {
  host: process.env.REACT_APP_REDIS_HOST || 'localhost',
  port: process.env.REACT_APP_REDIS_PORT || 6379,
  password: process.env.REACT_APP_REDIS_PASSWORD
};

// RabbitMQ Configuration
export const RABBITMQ_CONFIG = {
  host: process.env.REACT_APP_RABBITMQ_HOST || 'localhost',
  port: process.env.REACT_APP_RABBITMQ_PORT || 5672,
  username: process.env.REACT_APP_RABBITMQ_USERNAME || 'guest',
  password: process.env.REACT_APP_RABBITMQ_PASSWORD || 'guest'
};

// MinIO Configuration
export const MINIO_CONFIG = {
  endpoint: process.env.REACT_APP_MINIO_ENDPOINT || 'localhost:9000',
  accessKey: process.env.REACT_APP_MINIO_ACCESS_KEY,
  secretKey: process.env.REACT_APP_MINIO_SECRET_KEY,
  useSSL: process.env.REACT_APP_MINIO_USE_SSL === 'true'
};

// Application Configuration
export const APP_CONFIG = {
  name: '24hr Story',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: process.env.REACT_APP_DEBUG === 'true',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  },
  cache: {
    stories: 300, // 5 minutes
    user: 600, // 10 minutes
    trending: 900 // 15 minutes
  }
};

// Feature Flags
export const FEATURES = {
  enableNotifications: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  enableSocialSharing: process.env.REACT_APP_ENABLE_SOCIAL_SHARING === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDarkMode: process.env.REACT_APP_ENABLE_DARK_MODE === 'true'
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  enabled: FEATURES.enableAnalytics,
  trackingId: process.env.REACT_APP_GA_TRACKING_ID
};

// Social Media Configuration
export const SOCIAL_CONFIG = {
  facebook: {
    appId: process.env.REACT_APP_FACEBOOK_APP_ID
  },
  twitter: {
    apiKey: process.env.REACT_APP_TWITTER_API_KEY
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  auth: {
    invalidCredentials: 'Invalid email or password.',
    sessionExpired: 'Your session has expired. Please login again.',
    unauthorized: 'You are not authorized to perform this action.'
  },
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters long.',
    fileSize: 'File size must be less than 5MB.',
    fileType: 'Only JPEG, PNG and GIF files are allowed.'
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  story: {
    created: 'Story created successfully!',
    updated: 'Story updated successfully!',
    deleted: 'Story deleted successfully!'
  },
  user: {
    registered: 'Registration successful! Please login.',
    profileUpdated: 'Profile updated successfully!',
    passwordChanged: 'Password changed successfully!'
  }
}; 