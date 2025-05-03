import React from 'react';
import { useParams } from 'react-router-dom';

const Story = () => {
  const { id } = useParams();

  return (
    <div className="story-container">
      <h1>Story {id}</h1>
      <p>Story content will be displayed here.</p>
    </div>
  );
};

export default Story; 