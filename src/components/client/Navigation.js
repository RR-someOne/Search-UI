import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../auth/UserProfile';

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  
  const sidebarItems = [
    'Research'
  ];

  const handleLoginClick = () => {
    // This will trigger showing the login page in the main app
    window.dispatchEvent(new CustomEvent('showLogin'));
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-text">Finance Search Tool</span>
        </div>
      </div>
      <div className="sidebar-menu">
        {sidebarItems.map((item, index) => (
          <a key={index} href={`#${item.toLowerCase().replace(' ', '-')}`} className="sidebar-link">
            {item}
          </a>
        ))}
      </div>
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <UserProfile />
        ) : (
          <button className="sidebar-login" onClick={handleLoginClick}>
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;