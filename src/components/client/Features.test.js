import { render, screen } from '@testing-library/react';
import Features from './Features';

describe('Features Component', () => {
  test('renders all three feature cards', () => {
    render(<Features />);
    
    expect(screen.getByText('AI-Powered Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Secure & Private')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(<Features />);
    
    expect(screen.getByText(/Advanced machine learning algorithms provide contextual and relevant search results/i)).toBeInTheDocument();
    expect(screen.getByText(/Get instant results with our optimized search infrastructure/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise-grade security with privacy-first design/i)).toBeInTheDocument();
  });

  test('renders feature icons', () => {
    render(<Features />);
    
    expect(screen.getByText('🧠')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
  });

  test('feature titles are rendered as headings', () => {
    render(<Features />);
    
    const aiTitle = screen.getByRole('heading', { name: 'AI-Powered Intelligence' });
    const speedTitle = screen.getByRole('heading', { name: 'Lightning Fast' });
    const securityTitle = screen.getByRole('heading', { name: 'Secure & Private' });
    
    expect(aiTitle).toBeInTheDocument();
    expect(speedTitle).toBeInTheDocument();
    expect(securityTitle).toBeInTheDocument();
  });

  test('features section has correct structure', () => {
    render(<Features />);
    
    // Check that all features are present in the component
    const features = screen.getAllByText(/AI-Powered Intelligence|Lightning Fast|Secure & Private/);
    expect(features).toHaveLength(3);
  });

  test('feature descriptions contain key terms', () => {
    render(<Features />);
    
    expect(screen.getByText(/machine learning/i)).toBeInTheDocument();
    expect(screen.getByText(/real-time processing/i)).toBeInTheDocument();
    expect(screen.getByText(/data protection/i)).toBeInTheDocument();
  });

  test('renders features with proper accessibility', () => {
    render(<Features />);
    
    // Check that headings are properly structured
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
    
    expect(headings[0]).toHaveTextContent('AI-Powered Intelligence');
    expect(headings[1]).toHaveTextContent('Lightning Fast');
    expect(headings[2]).toHaveTextContent('Secure & Private');
  });
});