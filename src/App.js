import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/client/Navigation';
import SearchInterface from './components/client/SearchInterface';
import LoginModal from './components/auth/LoginModal';
import PopupLoginPage from './components/auth/PopupLoginPage';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleShowLogin = () => {
      setShowLoginModal(true);
    };

    window.addEventListener('showLogin', handleShowLogin);
    return () => {
      window.removeEventListener('showLogin', handleShowLogin);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  if (isLoading) {
    return (
      <div className="App loading-app">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <div className="chat-container">
          <SearchInterface />
        </div>
      </main>
      
      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal}>
        <PopupLoginPage onClose={handleCloseLoginModal} />
      </LoginModal>
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
