import React, { useState } from 'react';

function CreateModal({ onClose, onCreatePost, onCreateStory }) {
  const [activeTab, setActiveTab] = useState('post'); // 'post' or 'story'

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={e => e.stopPropagation()}>
        <div className="create-modal-header">
          <h2>Create New</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="create-modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'post' ? 'active' : ''}`}
            onClick={() => setActiveTab('post')}
          >
            <span className="tab-icon">📝</span>
            <span className="tab-label">Post</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            <span className="tab-icon">📸</span>
            <span className="tab-label">Story</span>
          </button>
        </div>

        <div className="create-modal-content">
          {activeTab === 'post' ? (
            <div className="create-post-options">
              <button className="create-option" onClick={onCreatePost}>
                <div className="option-icon">📷</div>
                <div className="option-content">
                  <h3>Photo Post</h3>
                  <p>Share a photo with your followers</p>
                </div>
              </button>
              <button className="create-option">
                <div className="option-icon">🎥</div>
                <div className="option-content">
                  <h3>Video Post</h3>
                  <p>Share a video with your followers</p>
                </div>
              </button>
              <button className="create-option">
                <div className="option-icon">📝</div>
                <div className="option-content">
                  <h3>Text Post</h3>
                  <p>Share your thoughts with your followers</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="create-story-options">
              <button className="create-option" onClick={onCreateStory}>
                <div className="option-icon">📸</div>
                <div className="option-content">
                  <h3>Photo Story</h3>
                  <p>Share a photo that disappears in 24 hours</p>
                </div>
              </button>
              <button className="create-option">
                <div className="option-icon">🎥</div>
                <div className="option-content">
                  <h3>Video Story</h3>
                  <p>Share a video that disappears in 24 hours</p>
                </div>
              </button>
              <button className="create-option">
                <div className="option-icon">🎵</div>
                <div className="option-content">
                  <h3>Music Story</h3>
                  <p>Share a story with music</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateModal; 