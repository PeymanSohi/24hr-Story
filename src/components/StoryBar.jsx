import React from 'react';

function StoryBar({ stories, onStoryClick }) {
  return (
    <div className="story-bar">
      {stories.map((story, index) => (
        <div 
          key={story.id} 
          className="story-circle" 
          onClick={() => onStoryClick(index)}
        >
          <img 
            src={story.image} 
            alt={`Story ${index + 1}`} 
            className="story-preview"
          />
        </div>
      ))}
    </div>
  );
}

export default StoryBar;
