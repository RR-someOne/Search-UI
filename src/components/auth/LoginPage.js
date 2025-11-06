import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { isLoading } = useAuth();

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
  };

  const handleLoginError = (error) => {
    console.error('Login failed:', error);
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Finance Search Tool</h1>
          <p>Sign in to access your personalized financial data and insights</p>
        </div>
        
        <div className="login-content">
          <div className="login-benefits">
            <h3>Why sign in?</h3>
            <ul>
              <li>📊 Personalized financial insights</li>
              <li>📈 Track your favorite stocks and indices</li>
              <li>💼 Save your search history</li>
              <li>🔔 Get personalized market alerts</li>
              <li>🎯 Customized investment recommendations</li>
            </ul>
          </div>
          
          <div className="login-form">
            <GoogleLoginButton 
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
            
            <p className="privacy-notice">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Your data is secure and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;