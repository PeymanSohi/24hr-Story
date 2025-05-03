import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateStory = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement story creation
      console.log('Creating story:', { title, content });
      navigate('/');
    } catch (error) {
      console.error('Story creation failed:', error);
    }
  };

  return (
    <div className="create-story-container">
      <h1>Create Story</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          />
        </div>
        <button type="submit">Create Story</button>
      </form>
    </div>
  );
};

export default CreateStory; 