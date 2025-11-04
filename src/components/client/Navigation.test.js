import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

// Mock the SearchInterface component since it has complex search functionality
jest.mock('./SearchInterface', () => {
  return function MockSearchInterface() {
    return <div data-testid="search-interface">Mock Search Interface</div>;
  };
});

describe('Navigation Component', () => {
  test('renders navigation brand', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Search Tool with Gen AI')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('href', '#api');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  });

  test('renders search section with title', () => {
    render(<Navigation />);
    
    expect(screen.getByText('What Can I help you with?')).toBeInTheDocument();
    expect(screen.getByTestId('search-interface')).toBeInTheDocument();
  });

  test('get started button is rendered as button element', () => {
    render(<Navigation />);
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton.tagName).toBe('BUTTON');
  });

  test('navigation has correct CSS classes', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('nav');
  });
});