import React, { useState } from 'react';

function CreatePost({ onPost }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [preview, setPreview] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const displayName = username || `User_${Math.floor(Math.random() * 1000)}`;
      const avatar = userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

      const newPost = {
        id: Date.now(),
        image: reader.result,
        caption,
        username: displayName,
        userAvatar: avatar,
        timestamp: Date.now(),
        likes: 0,
        comments: []
      };

      onPost(newPost);
      // Reset form
      setImage(null);
      setCaption('');
      setPreview(null);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="create-post-header">
          <h2>Create New Post</h2>
        </div>

        <div className="create-post-content">
          <div className="create-post-image-section">
            {preview ? (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="upload-image-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <div className="upload-image-placeholder">
                  <span>📷</span>
                  <p>Click to upload image</p>
                </div>
              </label>
            )}
          </div>

          <div className="create-post-details">
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
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="caption-input"
              rows="4"
            />
          </div>
        </div>

        <div className="create-post-actions">
          <button 
            type="submit" 
            className="create-post-button"
            disabled={!image}
          >
            Share Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost; 