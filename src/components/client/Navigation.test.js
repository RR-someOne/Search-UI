import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  test('renders OpenAI-style sidebar brand', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
  });

  test('renders sidebar navigation menu', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Research')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '#research');
  });

  test('renders login button', () => {
    render(<Navigation />);
    
    const loginButton = screen.getByText('Log in');
    expect(loginButton.tagName).toBe('BUTTON');
    expect(loginButton).toHaveClass('sidebar-login');
  });

  test('sidebar has correct CSS structure', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sidebar');
    
    // Check that key elements are present indicating proper structure
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('brand text has proper styling', () => {
    render(<Navigation />);
    
    const brandText = screen.getByText('Finance Search Tool');
    expect(brandText).toHaveClass('brand-text');
  });
});