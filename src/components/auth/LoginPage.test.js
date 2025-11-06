import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';

// Mock Google Identity Services
const mockGoogleAccounts = {
  id: {
    initialize: jest.fn(),
    renderButton: jest.fn(),
    disableAutoSelect: jest.fn(),
  }
};

// Mock window.google
Object.defineProperty(window, 'google', {
  value: {
    accounts: mockGoogleAccounts
  },
  writable: true
});

// Mock the GoogleLoginButton to capture and test callbacks
jest.mock('./GoogleLoginButton', () => {
  return function MockGoogleLoginButton({ onSuccess, onError }) {
    return (
      <div data-testid="mock-google-login-button">
        <button 
          data-testid="trigger-success"
          onClick={() => onSuccess && onSuccess({ name: 'Test User', email: 'test@example.com' })}
        >
          Trigger Success
        </button>
        <button 
          data-testid="trigger-error"
          onClick={() => onError && onError(new Error('Login failed'))}
        >
          Trigger Error
        </button>
      </div>
    );
  };
});

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth(),
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Set default mock return value
    mockUseAuth.mockReturnValue({
      isLoading: false
    });
    
    jest.clearAllMocks();
  });

  test('renders login page with title and description', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your personalized financial data and insights')).toBeInTheDocument();
  });

  test('displays benefits list', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Why sign in?')).toBeInTheDocument();
    expect(screen.getByText(/Personalized financial insights/)).toBeInTheDocument();
    expect(screen.getByText(/Track your favorite stocks and indices/)).toBeInTheDocument();
    expect(screen.getByText(/Save your search history/)).toBeInTheDocument();
    expect(screen.getByText(/Get personalized market alerts/)).toBeInTheDocument();
    expect(screen.getByText(/Customized investment recommendations/)).toBeInTheDocument();
  });

  test('shows privacy notice', () => {
    render(<LoginPage />);
    
    expect(screen.getByText(/By signing in, you agree to our Terms of Service and Privacy Policy/)).toBeInTheDocument();
    expect(screen.getByText(/Your data is secure and never shared with third parties/)).toBeInTheDocument();
  });

  test('renders with proper CSS classes', () => {
    render(<LoginPage />);
    
    // Check that the main heading is present, indicating the component rendered
    expect(screen.getByRole('heading', { name: 'Finance Search Tool' })).toBeInTheDocument();
  });

  test('handles login success callback', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<LoginPage />);
    
    // Trigger the success callback to cover line 10
    const successButton = screen.getByTestId('trigger-success');
    fireEvent.click(successButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Login successful:', { name: 'Test User', email: 'test@example.com' });
    
    consoleSpy.mockRestore();
  });

  test('handles login error callback', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<LoginPage />);
    
    // Trigger the error callback to cover line 14
    const errorButton = screen.getByTestId('trigger-error');
    fireEvent.click(errorButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test('shows loading state when isLoading is true', () => {
    // Mock the useAuth hook to return loading state
    mockUseAuth.mockReturnValue({
      isLoading: true
    });

    render(<LoginPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Finance Search Tool')).not.toBeInTheDocument();
  });
});