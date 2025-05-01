import React from 'react';

function StoryBar({ stories, onStoryClick }) {
  return (
    <div className="story-bar">
      {stories.map((story, index) => (
        <div key={story.id} className="story-circle" onClick={() => onStoryClick(index)} />
      ))}
    </div>
  );
}

export default StoryBar;
