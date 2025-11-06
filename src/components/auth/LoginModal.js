import React from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="login-modal-backdrop" onClick={handleBackdropClick} data-testid="modal-backdrop">
      <div className="login-modal-container" data-testid="modal-container">
        <button className="login-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default LoginModal;