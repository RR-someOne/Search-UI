import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/client/Navigation';
import Hero from './components/client/Hero';
import SearchInterface from './components/client/SearchInterface';
import LoginPage from './components/auth/LoginPage';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleShowLogin = () => {
      setShowLogin(true);
    };

    window.addEventListener('showLogin', handleShowLogin);
    return () => {
      window.removeEventListener('showLogin', handleShowLogin);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="App loading-app">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (showLogin && !isAuthenticated) {
    return (
      <div className="App">
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <div className="chat-container">
          <Hero />
          <SearchInterface />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
