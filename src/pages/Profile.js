import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-content">
        <p>Welcome, {user?.username || 'User'}!</p>
        <p>Your profile information will be displayed here.</p>
      </div>
    </div>
  );
};

export default Profile; 