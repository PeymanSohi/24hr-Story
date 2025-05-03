import React, { useState } from 'react';

function UploadButton({ onUpload }) {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a default username if not provided
    const displayName = username || `User_${Math.floor(Math.random() * 1000)}`;
    
    // Create a default avatar if not provided
    const avatar = userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      const newStory = {
        id: Date.now(),
        image: e.target.result,
        timestamp: Date.now(),
        username: displayName,
        userAvatar: avatar,
        reactions: []
      };
      
      stories.push(newStory);
      localStorage.setItem('stories', JSON.stringify(stories));
      onUpload();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-button">
      <input
        type="file"
        id="story-upload"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <label htmlFor="story-upload" className="plus-circle">
        +
      </label>
      <div className="upload-form">
        <input
          type="text"
          placeholder="Your username (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <input
          type="text"
          placeholder="Avatar URL (optional)"
          value={userAvatar}
          onChange={(e) => setUserAvatar(e.target.value)}
          className="avatar-input"
        />
      </div>
    </div>
  );
}

export default UploadButton;
