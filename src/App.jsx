import React, { useState, useEffect } from 'react';
import UploadButton from './components/UploadButton';
import StoryBar from './components/StoryBar';
import StoryViewer from './components/StoryViewer';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import { loadStories, cleanExpiredStories } from './utils/localStorageUtils';

function App() {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    cleanExpiredStories();
    setStories(loadStories());
    // Load posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts);
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

  const handleCreatePost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setShowCreatePost(false);
  };

  const handleLike = (postId, isLiked) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handleComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), {
            username: 'You',
            text: comment
          }]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>24hr Story</h1>
        <button 
          className="create-post-button"
          onClick={() => setShowCreatePost(true)}
        >
          Create Post
        </button>
      </header>
      
      <main>
        <StoryBar stories={stories} onStoryClick={handleStoryClick} />
        
        {showCreatePost && (
          <CreatePost onPost={handleCreatePost} />
        )}

        <div className="posts-container">
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>

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
