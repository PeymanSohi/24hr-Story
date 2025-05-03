import React, { useState, useEffect } from 'react';

function Navbar({ onThemeChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    onThemeChange(!isDarkMode);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">24hr Story</h1>
        </div>

        <div className="navbar-center">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button className="search-button">🔍</button>
          </div>
        </div>

        <div className="navbar-right">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <div className="notification-container">
            <button 
              className="notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                      <img src={notification.avatar} alt="" className="notification-avatar" />
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="create-post-button">
            <span className="plus-icon">+</span>
            <span className="button-text">Create</span>
          </button>

          <div className="user-menu">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" 
              alt="User" 
              className="user-avatar"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 