import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginModal.css';

const PopupLoginPage = ({ onClose }) => {
  const { isLoading, login } = useAuth();
  const [email, setEmail] = useState('');

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    onClose(); // Close modal on successful login
  };

  const handleGoogleLogin = () => {
    // For demo purposes, simulate a successful Google login
    const mockUserData = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/40',
      given_name: 'Demo',
      family_name: 'User',
      verified_email: true,
      token: 'demo-token'
    };
    
    login(mockUserData);
    handleLoginSuccess(mockUserData);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email login here
    console.log('Email login:', email);
    // For demo, also trigger login
    const mockUserData = {
      id: 'email-user-123',
      email: email,
      name: email.split('@')[0],
      picture: 'https://via.placeholder.com/40',
      verified_email: false,
    };
    login(mockUserData);
    handleLoginSuccess(mockUserData);
  };

  if (isLoading) {
    return (
      <div className="login-modal-content">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-modal-content">
      <div className="login-modal-header">
        <h1 className="login-modal-title">Log in or sign up</h1>
        <p className="login-modal-subtitle">
          You'll get smarter responses and can upload files, images, and more.
        </p>
      </div>

      <div className="login-modal-providers">
        {/* Google Login */}
        <button className="login-provider-button google-login-button" onClick={handleGoogleLogin}>
          <svg className="provider-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Apple Login */}
        <button className="login-provider-button">
          <svg className="provider-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Continue with Apple
        </button>

        {/* Microsoft Login */}
        <button className="login-provider-button">
          <svg className="provider-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
          </svg>
          Continue with Microsoft
        </button>

        {/* Phone Login */}
        <button className="login-provider-button">
          <svg className="provider-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Continue with phone
        </button>
      </div>

      <div className="login-divider">OR</div>

      <form className="login-email-form" onSubmit={handleEmailSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            className="login-email-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            backgroundColor: '#fbbf24',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            ⚠️
          </div>
        </div>
        <button type="submit" className="login-continue-button">
          Continue
        </button>
      </form>
    </div>
  );
};

export default PopupLoginPage;