import React, { useEffect, useState } from 'react';

function StoryViewer({ stories, activeIndex, onClose }) {
  const [index, setIndex] = useState(activeIndex);
  const [isPaused, setIsPaused] = useState(false);

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
      
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      <div className="story-content">
        <img src={stories[index].image} alt="story" className="story-image" />
        {isPaused && (
          <div className="pause-indicator">
            <span>⏸</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryViewer;
