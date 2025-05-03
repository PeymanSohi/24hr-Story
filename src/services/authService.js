// Mock user data for development
const MOCK_USER = {
  id: process.env.REACT_APP_MOCK_USER_ID || '1',
  username: process.env.REACT_APP_MOCK_USERNAME || 'testuser',
  email: process.env.REACT_APP_MOCK_EMAIL || 'test@example.com',
  password: process.env.REACT_APP_MOCK_PASSWORD || 'password123' // In a real app, this would be hashed
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (email, password) => {
  await delay(Number(process.env.REACT_APP_API_DELAY) || 1000); // Simulate network delay
  
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const { password: _, ...userWithoutPassword } = MOCK_USER;
    return {
      user: userWithoutPassword,
      token: process.env.REACT_APP_JWT_SECRET || 'mock-jwt-token'
    };
  }
  
  throw new Error('Invalid email or password');
};

export const registerUser = async (username, email, password) => {
  await delay(Number(process.env.REACT_APP_API_DELAY) || 1000); // Simulate network delay
  
  if (email === MOCK_USER.email) {
    throw new Error('Email already exists');
  }
  
  return {
    user: {
      id: Date.now().toString(),
      username,
      email
    },
    token: process.env.REACT_APP_JWT_SECRET || 'mock-jwt-token'
  };
};

export const logoutUser = async () => {
  await delay(Number(process.env.REACT_APP_API_DELAY) / 2 || 500); // Simulate network delay
  return true;
};

export const getCurrentUser = async () => {
  await delay(Number(process.env.REACT_APP_API_DELAY) / 2 || 500); // Simulate network delay
  
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  return {
    id: MOCK_USER.id,
    username: MOCK_USER.username,
    email: MOCK_USER.email
  };
};

export const updateUserProfile = async (userData) => {
  await delay(Number(process.env.REACT_APP_API_DELAY) || 1000); // Simulate network delay
  
  return {
    ...MOCK_USER,
    ...userData
  };
}; 