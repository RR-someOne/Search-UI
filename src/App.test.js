import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main finance application', () => {
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
});
