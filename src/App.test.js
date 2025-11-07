import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App';

// Mock the AuthContext to control authentication state
jest.mock('./contexts/AuthContext', () => {
  const originalModule = jest.requireActual('./contexts/AuthContext');
  return {
    ...originalModule,
    AuthProvider: ({ children }) => children,
    useAuth: jest.fn(),
  };
});

describe('App Component', () => {
  const mockUseAuth = require('./contexts/AuthContext').useAuth;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    });
  });

  test('renders the main finance application when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { name: 'Test User' },
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    });

    render(<App />);
    
    // Check if main components are rendered (OpenAI-style finance app)
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...')).toBeInTheDocument();
  });

  test('renders OpenAI-style sidebar navigation', () => {
    render(<App />);
    
    // Sidebar navigation elements
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('renders finance search interface', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders main application layout', () => {
    render(<App />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    expect(searchInput).toBeInTheDocument();
  });

  test('shows loading state when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    });

    render(<App />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows login modal when showLogin event is triggered and user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    });

    render(<App />);
    
    // Initially should show main app and no modal
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.queryByText('Log in or sign up')).not.toBeInTheDocument();
    
    // Trigger the showLogin event
    act(() => {
      window.dispatchEvent(new CustomEvent('showLogin'));
    });
    
    // Should now show login modal
    await waitFor(() => {
      expect(screen.getByText('Log in or sign up')).toBeInTheDocument();
    });
    
    // Verify modal subtitle is also present
    expect(screen.getByText("You'll get smarter responses and can upload files, images, and more.")).toBeInTheDocument();
  });

  test('hides login modal when user becomes authenticated', async () => {
    // Start with unauthenticated state
    const mockAuth = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    };
    
    mockUseAuth.mockReturnValue(mockAuth);
    
    const { rerender } = render(<App />);
    
    // Trigger login modal
    act(() => {
      window.dispatchEvent(new CustomEvent('showLogin'));
    });
    
    // Verify login modal is shown
    await waitFor(() => {
      expect(screen.getByText('Log in or sign up')).toBeInTheDocument();
    });
    
    // Now simulate user becoming authenticated
    mockAuth.isAuthenticated = true;
    mockAuth.user = { name: 'Test User' };
    
    rerender(<App />);
    
    // Should still show main app and modal should be hidden
    await waitFor(() => {
      expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    });
    
    // Login modal should no longer be visible
    expect(screen.queryByText('Log in or sign up')).not.toBeInTheDocument();
  });

  test('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<App />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('showLogin', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
