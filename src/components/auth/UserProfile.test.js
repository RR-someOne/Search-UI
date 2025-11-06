import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth(),
}));

describe('UserProfile Component', () => {
  const mockLogout = jest.fn();
  
  const mockUser = {
    name: 'John Doe',
    given_name: 'John',
    email: 'john.doe@example.com',
    picture: 'https://example.com/profile.jpg',
    verified_email: true
  };

  const mockUserUnverified = {
    name: 'Jane Smith',
    given_name: 'Jane',
    email: 'jane.smith@example.com',
    picture: 'https://example.com/jane.jpg',
    verified_email: false
  };

  beforeEach(() => {
    mockLogout.mockClear();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout
    });
  });

  test('returns null when no user is provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout
    });

    render(<UserProfile />);
    
    // Component should not render anything when user is null
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders compact profile by default', () => {
    render(<UserProfile />);
    
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    
    // Should have compact styling classes
    expect(screen.getByRole('img')).toHaveClass('user-avatar-small');
    expect(screen.getByText('John')).toHaveClass('user-name-short');
  });

  test('renders compact profile when showFull is false', () => {
    render(<UserProfile showFull={false} />);
    
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    
    // Should not show full profile elements
    expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('✓ Verified')).not.toBeInTheDocument();
  });

  test('renders full profile when showFull is true', () => {
    render(<UserProfile showFull={true} />);
    
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('✓ Verified')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    
    // Should have full styling classes
    expect(screen.getByRole('img')).toHaveClass('user-avatar-large');
  });

  test('shows verified badge when user email is verified', () => {
    render(<UserProfile showFull={true} />);
    
    expect(screen.getByText('✓ Verified')).toBeInTheDocument();
  });

  test('does not show verified badge when user email is not verified', () => {
    mockUseAuth.mockReturnValue({
      user: mockUserUnverified,
      logout: mockLogout
    });

    render(<UserProfile showFull={true} />);
    
    expect(screen.queryByText('✓ Verified')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
  });

  test('calls logout when compact sign out button is clicked', () => {
    render(<UserProfile showFull={false} />);
    
    const signOutButton = screen.getByRole('button', { name: 'Sign out' });
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('calls logout when full profile sign out button is clicked', () => {
    render(<UserProfile showFull={true} />);
    
    const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('displays correct user image src and alt attributes', () => {
    render(<UserProfile />);
    
    const image = screen.getByRole('img', { name: 'John Doe' });
    expect(image).toHaveAttribute('src', 'https://example.com/profile.jpg');
    expect(image).toHaveAttribute('alt', 'John Doe');
  });

  test('handles missing user properties gracefully', () => {
    const incompleteUser = {
      name: 'Incomplete User',
      email: 'incomplete@example.com'
      // missing given_name, picture, verified_email
    };

    mockUseAuth.mockReturnValue({
      user: incompleteUser,
      logout: mockLogout
    });

    render(<UserProfile showFull={true} />);
    
    expect(screen.getByText('Incomplete User')).toBeInTheDocument();
    expect(screen.getByText('incomplete@example.com')).toBeInTheDocument();
    expect(screen.queryByText('✓ Verified')).not.toBeInTheDocument();
  });
});