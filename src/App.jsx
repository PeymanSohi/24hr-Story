import React, { useState, useEffect } from 'react';
import StoryBar from './components/StoryBar';
import StoryViewer from './components/StoryViewer';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CreateModal from './components/CreateModal';
import './styles.css';

function App() {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load stories and posts from localStorage
    const savedStories = JSON.parse(localStorage.getItem('stories')) || [];
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setStories(savedStories);
    setPosts(savedPosts);

    // Check for system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Update body class for dark mode
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleStoryClose = () => {
    setSelectedStory(null);
  };

  const handleCreatePost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setShowCreatePost(false);
    setShowCreateModal(false);
  };

  const handleCreateStory = () => {
    // Handle story creation
    setShowCreateModal(false);
  };

  const handleThemeChange = (darkMode) => {
    setIsDarkMode(darkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar onThemeChange={handleThemeChange} />
      
      <main className="main-content">
        <div className="stories-container">
          <StoryBar stories={stories} onStoryClick={handleStoryClick} />
        </div>

        <div className="posts-container">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={() => {
                const updatedPosts = posts.map((p) =>
                  p.id === post.id
                    ? { ...p, likes: p.likes + 1 }
                    : p
                );
                setPosts(updatedPosts);
                localStorage.setItem('posts', JSON.stringify(updatedPosts));
              }}
              onComment={(comment) => {
                const updatedPosts = posts.map((p) =>
                  p.id === post.id
                    ? {
                        ...p,
                        comments: [
                          ...p.comments,
                          {
                            id: Date.now(),
                            text: comment,
                            username: 'Current User',
                            timestamp: new Date().toISOString(),
                          },
                        ],
                      }
                    : p
                );
                setPosts(updatedPosts);
                localStorage.setItem('posts', JSON.stringify(updatedPosts));
              }}
            />
          ))}
        </div>
      </main>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={handleStoryClose}
          onNext={() => {
            const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
            if (currentIndex < stories.length - 1) {
              setSelectedStory(stories[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
            if (currentIndex > 0) {
              setSelectedStory(stories[currentIndex - 1]);
            }
          }}
        />
      )}

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreatePost={() => setShowCreatePost(true)}
          onCreateStory={handleCreateStory}
        />
      )}

      <BottomNav onOpenCreateModal={() => setShowCreateModal(true)} />
    </div>
  );
}

export default App;
