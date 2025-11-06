import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the AuthContext
const mockLogin = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
    login: mockLogin,
  }),
}));

// Mock window.google
const mockGoogleAccounts = {
  id: {
    initialize: jest.fn(),
    renderButton: jest.fn(),
    disableAutoSelect: jest.fn(),
  }
};

Object.defineProperty(window, 'google', {
  value: { accounts: mockGoogleAccounts },
  writable: true
});

// Mock atob
global.atob = jest.fn();

// Mock document methods properly for JSDOM compatibility
const mockElement = {
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  contains: jest.fn(() => true)
};

Object.defineProperty(document, 'head', {
  value: mockElement,
  writable: true
});

describe('GoogleLoginButton Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  let realCreateElement;

  beforeAll(() => {
    realCreateElement = document.createElement.bind(document);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    global.atob.mockReturnValue(JSON.stringify({
      sub: '123456789',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
      given_name: 'Test',
      family_name: 'User',
      email_verified: true,
    }));

    // Reset document mocks
    mockElement.appendChild.mockClear();
    mockElement.removeChild.mockClear();
    mockElement.contains.mockReturnValue(true);
    
    // Mock createElement to avoid Node type issues
    document.createElement = jest.fn((tagName) => {
      if (tagName === 'script') {
        return {
          src: '',
          async: false,
          defer: false,
          onload: null,
          remove: jest.fn(),
        };
      }
      return realCreateElement(tagName);
    });
    
    document.getElementById = jest.fn(() => ({ id: 'google-login-button' }));
  });

  afterAll(() => {
    document.createElement = realCreateElement;
  });

  test('renders component', () => {
    render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
  });

  test('executes useEffect and script setup', () => {
    render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );

    // Verify script creation
    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(mockElement.appendChild).toHaveBeenCalled();
  });

  test('calls actual handleCredentialResponse when Google responds', () => {
    let capturedCallback;

    // Mock the script element and capture onload
    const mockScript = {
      src: '',
      async: false,
      defer: false,
      onload: null,
      remove: jest.fn(),
    };

    document.createElement = jest.fn((tagName) => {
      if (tagName === 'script') {
        return mockScript;
      }
      return realCreateElement(tagName);
    });

    render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );

    // Trigger the script onload
    act(() => {
      if (mockScript.onload) {
        mockScript.onload();
      }
    });

    // Capture the callback passed to initialize
    expect(mockGoogleAccounts.id.initialize).toHaveBeenCalled();
    capturedCallback = mockGoogleAccounts.id.initialize.mock.calls[0][0].callback;

    // Test the actual handleCredentialResponse
    act(() => {
      capturedCallback({ credential: 'header.payload.signature' });
    });
    
    expect(mockLogin).toHaveBeenCalledWith(expect.objectContaining({
      id: '123456789',
      email: 'test@example.com',
      name: 'Test User',
      token: 'header.payload.signature',
    }));
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('handles parseJwt errors properly', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    global.atob.mockImplementation(() => {
      throw new Error('Invalid base64');
    });

    let capturedCallback;

    const mockScript = {
      src: '',
      async: false,
      defer: false,
      onload: null,
      remove: jest.fn(),
    };

    document.createElement = jest.fn((tagName) => {
      if (tagName === 'script') return mockScript;
      return realCreateElement(tagName);
    });

    render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );

    act(() => {
      if (mockScript.onload) mockScript.onload();
    });

    capturedCallback = mockGoogleAccounts.id.initialize.mock.calls[0][0].callback;

    act(() => {
      capturedCallback({ credential: 'invalid.token' });
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error parsing JWT token:', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Error handling Google credential response:', expect.any(Error));
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test('parseJwt character replacement works', () => {
    global.atob.mockImplementation((input) => {
      expect(input).not.toContain('-');
      expect(input).not.toContain('_');
      return JSON.stringify({ sub: '123', email: 'test@example.com' });
    });

    let capturedCallback;

    const mockScript = {
      src: '',
      async: false,
      defer: false,
      onload: null,
      remove: jest.fn(),
    };

    document.createElement = jest.fn((tagName) => {
      if (tagName === 'script') return mockScript;
      return realCreateElement(tagName);
    });

    render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );

    act(() => {
      if (mockScript.onload) mockScript.onload();
    });

    capturedCallback = mockGoogleAccounts.id.initialize.mock.calls[0][0].callback;

    act(() => {
      capturedCallback({ credential: 'header.url-safe_chars.signature' });
    });

    expect(mockLogin).toHaveBeenCalled();
  });

  test('cleanup on unmount works', () => {
    const mockScript = {
      src: '',
      async: false,
      defer: false,
      onload: null,
      remove: jest.fn(),
    };

    document.createElement = jest.fn((tagName) => {
      if (tagName === 'script') return mockScript;
      return realCreateElement(tagName);
    });

    const { unmount } = render(
      <AuthProvider>
        <GoogleLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
      </AuthProvider>
    );

    expect(mockElement.appendChild).toHaveBeenCalledWith(mockScript);

    unmount();
    
    expect(mockElement.contains).toHaveBeenCalledWith(mockScript);
    expect(mockElement.removeChild).toHaveBeenCalledWith(mockScript);
  });
});
