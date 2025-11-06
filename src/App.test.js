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
    expect(screen.getAllByText('Finance Search Tool')).toHaveLength(2); // Appears in nav and hero
    expect(screen.getByText('Finance Search Tool with AI')).toBeInTheDocument();
  });

  test('renders OpenAI-style sidebar navigation', () => {
    render(<App />);
    
    // Sidebar navigation elements
    expect(screen.getAllByText('Finance Search Tool')).toHaveLength(2);
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('renders finance search interface', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders finance-focused hero section', () => {
    render(<App />);
    
    expect(screen.getAllByText('Finance Search Tool')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
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

  test('shows login page when showLogin event is triggered and user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      GOOGLE_CLIENT_ID: 'test-client-id'
    });

    render(<App />);
    
    // Initially should show main app
    expect(screen.getAllByText('Finance Search Tool')).toHaveLength(2);
    
    // Trigger the showLogin event
    act(() => {
      window.dispatchEvent(new CustomEvent('showLogin'));
    });
    
    // Should now show login page
    await waitFor(() => {
      expect(screen.getByText('Sign in to access your personalized financial data and insights')).toBeInTheDocument();
    });
  });

  test('hides login page when user becomes authenticated', async () => {
    // Start with unauthenticated state and login page showing
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
    
    // Trigger login page
    act(() => {
      window.dispatchEvent(new CustomEvent('showLogin'));
    });
    
    // Verify login page is shown
    await waitFor(() => {
      expect(screen.getByText('Sign in to access your personalized financial data and insights')).toBeInTheDocument();
    });
    
    // Now simulate user becoming authenticated
    mockAuth.isAuthenticated = true;
    mockAuth.user = { name: 'Test User' };
    
    rerender(<App />);
    
    // Should now show main app instead of login page
    await waitFor(() => {
      expect(screen.getAllByText('Finance Search Tool')).toHaveLength(2);
    });
    
    // Login page should no longer be visible
    expect(screen.queryByText('Sign in to access your personalized financial data and insights')).not.toBeInTheDocument();
  });

  test('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<App />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('showLogin', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
