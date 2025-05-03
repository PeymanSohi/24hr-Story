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
      <header className="header">
        <h1>24hr Story</h1>
      </header>
      
      <main>
        <StoryBar stories={stories} onStoryClick={handleStoryClick} />
        <UploadButton onUpload={reloadStories} />
      </main>

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
