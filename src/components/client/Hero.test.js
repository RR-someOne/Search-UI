import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  test('renders finance hero title', () => {
    render(<Hero />);
    
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument();
  });

  test('hero title has correct structure', () => {
    render(<Hero />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass('hero-title');
    expect(title).toHaveTextContent('Finance Search Tool');
  });

  test('renders complete hero section structure', () => {
    render(<Hero />);
    
    // Test that hero section and title are present
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Verify the hero container structure
    const heroElement = screen.getByRole('heading', { level: 1 }).closest('.hero');
    expect(heroElement).toBeInTheDocument();
  });

  test('hero focuses on finance functionality', () => {
    render(<Hero />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Finance Search Tool');
  });

  test('hero component has proper semantic structure', () => {
    render(<Hero />);
    
    // Check that heading is properly structured
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('hero-title');
  });
});