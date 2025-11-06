import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = ({ showFull = false }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  if (!showFull) {
    // Compact version for navigation bar
    return (
      <div className="user-profile-compact">
        <img 
          src={user.picture} 
          alt={user.name}
          className="user-avatar-small"
        />
        <span className="user-name-short">{user.given_name}</span>
        <button 
          onClick={handleLogout}
          className="logout-button-small"
          title="Sign out"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Full profile view
  return (
    <div className="user-profile-full">
      <div className="profile-header">
        <img 
          src={user.picture} 
          alt={user.name}
          className="user-avatar-large"
        />
        <div className="user-info">
          <h3 className="user-full-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
          {user.verified_email && (
            <span className="verified-badge">✓ Verified</span>
          )}
        </div>
      </div>
      
      <div className="profile-actions">
        <button 
          onClick={handleLogout}
          className="logout-button-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;