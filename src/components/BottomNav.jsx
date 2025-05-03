import React, { useState } from 'react';

function BottomNav({ onOpenCreateModal }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => setActiveTab('search')}
      >
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Search</span>
      </button>

      <button 
        className="nav-item create-button"
        onClick={onOpenCreateModal}
      >
        <div className="create-button-inner">
          <span className="plus-icon">+</span>
        </div>
      </button>

      <button 
        className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}
        onClick={() => setActiveTab('activity')}
      >
        <span className="nav-icon">❤️</span>
        <span className="nav-label">Activity</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </button>
    </nav>
  );
}

export default BottomNav; 