import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  test('renders hero title', () => {
    render(<Hero />);
    
    expect(screen.getByText(/Intelligent search powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/artificial intelligence/i)).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<Hero />);
    
    const description = screen.getByText(/Experience next-generation search with AI-powered insights/i);
    expect(description).toBeInTheDocument();
  });

  test('hero title has correct structure with gradient text', () => {
    render(<Hero />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass('hero-title');
    
    const gradientText = screen.getByText('artificial intelligence');
    expect(gradientText).toHaveClass('gradient-text');
  });

  test('renders complete hero section structure', () => {
    render(<Hero />);
    
    // Test that both title and description are present together
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Experience next-generation search/i)).toBeInTheDocument();
  });

  test('hero description mentions key features', () => {
    render(<Hero />);
    
    const description = screen.getByText(/natural language processing/i);
    expect(description).toBeInTheDocument();
    
    const instantResults = screen.getByText(/instant intelligent results/i);
    expect(instantResults).toBeInTheDocument();
  });
});