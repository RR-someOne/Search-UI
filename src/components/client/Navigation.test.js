import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseAuth.mockReset();
  });

  test('renders OpenAI-style sidebar brand', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
  });

  test('renders sidebar navigation menu', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    expect(screen.getByText('Research')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '#research');
  });

  test('renders login button when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    const loginButton = screen.getByText('Log in');
    expect(loginButton.tagName).toBe('BUTTON');
    expect(loginButton).toHaveClass('sidebar-login');
  });

  test('renders UserProfile when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    render(<Navigation />);
    
    // UserProfile should be rendered instead of login button
    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
    // Note: UserProfile component should be present, but we don't test its internals here
  });

  test('sidebar has correct CSS structure', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sidebar');
    
    // Check that key elements are present indicating proper structure
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('brand text has proper styling', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    render(<Navigation />);
    
    const brandText = screen.getByText('Finance Search Tool');
    expect(brandText).toHaveClass('brand-text');
  });

  test('login button dispatches showLogin event when clicked', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    
    // Create a spy for the window.dispatchEvent method
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    
    render(<Navigation />);
    
    const loginButton = screen.getByText('Log in');
    await userEvent.click(loginButton);
    
    // Verify that dispatchEvent was called with the correct CustomEvent
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'showLogin'
      })
    );
    
    // Clean up the spy
    dispatchEventSpy.mockRestore();
  });
});