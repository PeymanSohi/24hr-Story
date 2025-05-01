import React, { useEffect, useState } from 'react';

function StoryViewer({ stories, activeIndex, onClose }) {
  const [index, setIndex] = useState(activeIndex);

  useEffect(() => {
    if (index >= stories.length) return onClose();

    const timer = setTimeout(() => {
      setIndex(index + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [index]);

  if (index >= stories.length) return null;

  return (
    <div className="story-viewer" onClick={() => setIndex(index + 1)}>
      <div className="progress-bar-container">
        {stories.map((_, i) => (
          <div
            key={i}
            className={`progress-bar ${i < index ? 'done' : i === index ? 'active' : ''}`}
          />
        ))}
      </div>
      <img src={stories[index].image} alt="story" className="story-image" />
    </div>
  );
}

export default StoryViewer;
