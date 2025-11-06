import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component to use the auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <button 
        onClick={() => login({ name: 'Test User', email: 'test@example.com' })}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('handles user login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
  });

  test('handles user logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    // Then logout
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('persists user data in localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(localStorage.getItem('user')).toBeTruthy();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser.name).toBe('Test User');
  });

  test('throws error when useAuth is used outside AuthProvider', () => {
    // Temporarily override console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  test('handles corrupted localStorage data', () => {
    // Set invalid JSON in localStorage to trigger the error handling
    localStorage.setItem('user', 'invalid-json');
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should handle the error gracefully and clear the invalid data
    expect(consoleSpy).toHaveBeenCalledWith('Error parsing saved user:', expect.any(SyntaxError));
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    
    consoleSpy.mockRestore();
  });

  test('restores user from valid localStorage data', () => {
    // Set valid user data in localStorage
    const validUser = { name: 'Stored User', email: 'stored@example.com' };
    localStorage.setItem('user', JSON.stringify(validUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should restore the user from localStorage
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
  });

  test('handles Google sign-out when window.google is available', () => {
    // Mock Google accounts API
    const mockDisableAutoSelect = jest.fn();
    window.google = {
      accounts: {
        id: {
          disableAutoSelect: mockDisableAutoSelect
        }
      }
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    act(() => {
      screen.getByTestId('login-btn').click();
    });

    // Then logout to trigger Google sign-out
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(mockDisableAutoSelect).toHaveBeenCalled();
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    
    // Clean up
    delete window.google;
  });
});