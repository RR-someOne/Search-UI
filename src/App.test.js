import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main application', () => {
    render(<App />);
    
    // Check if main components are rendered
    expect(screen.getAllByText('Search Tool with Gen AI')).toHaveLength(2);
    expect(screen.getByText('What Can I help you with?')).toBeInTheDocument();
  });

  test('renders navigation menu', () => {
    render(<App />);
    
    // Use getAllByText since Features appears in both nav and footer
    expect(screen.getAllByText('Features')).toHaveLength(2);
    expect(screen.getAllByText('API')).toHaveLength(2);
    expect(screen.getAllByText('About')).toHaveLength(2);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('renders search interface', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders hero section', () => {
    render(<App />);
    
    expect(screen.getByText(/Intelligent search powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/artificial intelligence/i)).toBeInTheDocument();
  });
});
