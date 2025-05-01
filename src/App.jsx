import React, { useState, useEffect } from 'react';
import UploadButton from './components/UploadButton';
import StoryBar from './components/StoryBar';
import StoryViewer from './components/StoryViewer';
import { loadStories, cleanExpiredStories } from './utils/localStorageUtils';

function App() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    cleanExpiredStories();
    setStories(loadStories());
  }, []);

  const handleStoryClick = (index) => {
    setActiveIndex(index);
  };

  const closeViewer = () => {
    setActiveIndex(null);
  };

  const reloadStories = () => {
    setStories(loadStories());
  };

  return (
    <div className="app-container">
      <StoryBar stories={stories} onStoryClick={handleStoryClick} />
      <UploadButton onUpload={reloadStories} />
      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}

export default App;
