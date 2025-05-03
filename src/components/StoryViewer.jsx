import React, { useEffect, useState } from 'react';

function StoryViewer({ stories, activeIndex, onClose }) {
  const [index, setIndex] = useState(activeIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    if (index >= stories.length) return onClose();
    if (isPaused) return;

    const timer = setTimeout(() => {
      setIndex(index + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [index, isPaused]);

  const handleClick = (e) => {
    const { clientX } = e;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width * 0.3) {
      // Click on left side - go to previous story
      if (index > 0) {
        setIndex(index - 1);
      }
    } else if (clickPosition > width * 0.7) {
      // Click on right side - go to next story
      setIndex(index + 1);
    } else {
      // Click in middle - pause/resume
      setIsPaused(!isPaused);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const handleReaction = (type) => {
    // Here you would typically send the reaction to a backend
    setShowReactions(false);
  };

  if (index >= stories.length) return null;

  return (
    <div className="story-viewer" onClick={handleClick}>
      <div className="progress-bar-container">
        {stories.map((_, i) => (
          <div
            key={i}
            className={`progress-bar ${i < index ? 'done' : i === index ? 'active' : ''}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          />
        ))}
      </div>
      
      <div className="story-header">
        <div className="user-info">
          <img src={stories[index].userAvatar || '/default-avatar.png'} alt="user" className="user-avatar" />
          <span className="username">{stories[index].username || 'User'}</span>
          <span className="timestamp">{formatTime(stories[index].timestamp)}</span>
        </div>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="story-content">
        <img src={stories[index].image} alt="story" className="story-image" />
        {isPaused && (
          <div className="pause-indicator">
            <span>⏸</span>
          </div>
        )}
      </div>

      <div className="story-actions">
        <button 
          className="reaction-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowReactions(!showReactions);
          }}
        >
          ❤️
        </button>
        <button 
          className="message-button"
          onClick={(e) => {
            e.stopPropagation();
            // Handle message
          }}
        >
          💬
        </button>
        <button 
          className="share-button"
          onClick={(e) => {
            e.stopPropagation();
            // Handle share
          }}
        >
          📤
        </button>
      </div>

      {showReactions && (
        <div className="reactions-panel" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleReaction('like')}>❤️</button>
          <button onClick={() => handleReaction('love')}>😍</button>
          <button onClick={() => handleReaction('laugh')}>😂</button>
          <button onClick={() => handleReaction('wow')}>😮</button>
          <button onClick={() => handleReaction('sad')}>😢</button>
          <button onClick={() => handleReaction('angry')}>😠</button>
        </div>
      )}
    </div>
  );
}

export default StoryViewer;
