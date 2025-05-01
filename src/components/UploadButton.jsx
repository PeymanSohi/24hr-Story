import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveStory } from '../utils/localStorageUtils';
import { resizeImage } from '../utils/imageUtils';

function UploadButton({ onUpload }) {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await resizeImage(file);
    const story = {
      id: uuidv4(),
      image: base64,
      createdAt: Date.now()
    };

    saveStory(story);
    onUpload();
  };

  return (
    <div className="upload-button">
      <label>
        <span className="plus-circle">＋</span>
        <input type="file" accept="image/*" onChange={handleFile} hidden />
      </label>
    </div>
  );
}

export default UploadButton;
