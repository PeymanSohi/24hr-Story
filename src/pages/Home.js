import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Home.css';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`home-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="home-header">
        <h1>24hr Story</h1>
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </header>
      
      <main className="home-content">
        <section className="welcome-section">
          <h2>Welcome to 24hr Story</h2>
          <p>Share your stories, connect with others, and discover new perspectives.</p>
        </section>

        <section className="features-section">
          <h3>Features</h3>
          <ul>
            <li>Create and share stories</li>
            <li>Connect with other storytellers</li>
            <li>Discover trending stories</li>
            <li>Engage with comments and likes</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Home; 