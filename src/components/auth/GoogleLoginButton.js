import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { GOOGLE_CLIENT_ID, login } = useAuth();

  const handleCredentialResponse = useCallback((response) => {
    try {
      // Decode the JWT token to get user info
      const decoded = parseJwt(response.credential);
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        verified_email: decoded.email_verified,
        token: response.credential
      };

      login(userData);
      
      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      if (onError) {
        onError(error);
      }
    }
  }, [login, onSuccess, onError]);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
            width: 250,
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [GOOGLE_CLIENT_ID, handleCredentialResponse]);

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      throw error;
    }
  };

  return (
    <div className="google-login-container">
      <div id="google-login-button"></div>
    </div>
  );
};

export default GoogleLoginButton;