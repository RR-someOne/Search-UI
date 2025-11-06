import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the useAuth hook functionality for testing
const renderWithAuthProvider = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Navigation Component', () => {
  test('renders OpenAI-style sidebar brand', () => {
    renderWithAuthProvider(<Navigation />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
  });

  test('renders sidebar navigation menu', () => {
    renderWithAuthProvider(<Navigation />);
    
    expect(screen.getByText('Research')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithAuthProvider(<Navigation />);
    
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '#research');
  });

  test('renders login button when not authenticated', () => {
    renderWithAuthProvider(<Navigation />);
    
    const loginButton = screen.getByText('Log in');
    expect(loginButton.tagName).toBe('BUTTON');
    expect(loginButton).toHaveClass('sidebar-login');
  });

  test('sidebar has correct CSS structure', () => {
    renderWithAuthProvider(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sidebar');
    
    // Check that key elements are present indicating proper structure
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('brand text has proper styling', () => {
    renderWithAuthProvider(<Navigation />);
    
    const brandText = screen.getByText('Finance Search Tool');
    expect(brandText).toHaveClass('brand-text');
  });
});