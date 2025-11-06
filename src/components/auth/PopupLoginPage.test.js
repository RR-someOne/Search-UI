import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupLoginPage from './PopupLoginPage';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PopupLoginPage Component', () => {
  const mockOnClose = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockLogin.mockClear();
    mockUseAuth.mockReturnValue({
      isLoading: false,
      login: mockLogin
    });
  });

  test('renders login form with all provider buttons', () => {
    render(<PopupLoginPage onClose={mockOnClose} />);

    expect(screen.getByText('Log in or sign up')).toBeInTheDocument();
    expect(screen.getByText("You'll get smarter responses and can upload files, images, and more.")).toBeInTheDocument();
    
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
    expect(screen.getByText('Continue with Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Continue with phone')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  test('shows loading state when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      login: mockLogin
    });

    render(<PopupLoginPage onClose={mockOnClose} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Log in or sign up')).not.toBeInTheDocument();
  });

  test('handles Google login when button is clicked', () => {
    render(<PopupLoginPage onClose={mockOnClose} />);

    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    expect(mockLogin).toHaveBeenCalledWith({
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/40',
      given_name: 'Demo',
      family_name: 'User',
      verified_email: true,
      token: 'demo-token'
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handles email form submission', () => {
    render(<PopupLoginPage onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const continueButton = screen.getByText('Continue');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(continueButton);

    expect(mockLogin).toHaveBeenCalledWith({
      id: 'email-user-123',
      email: 'test@example.com',
      name: 'test',
      picture: 'https://via.placeholder.com/40',
      verified_email: false,
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('updates email input value', () => {
    render(<PopupLoginPage onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText('Email address');
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    
    expect(emailInput.value).toBe('user@example.com');
  });

  test('email form requires email input', () => {
    render(<PopupLoginPage onClose={mockOnClose} />);

    const emailInput = screen.getByPlaceholderText('Email address');
    
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});