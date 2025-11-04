import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders footer brand and description', () => {
    render(<Footer />);
    
    expect(screen.getByText('Search Tool with Gen AI')).toBeInTheDocument();
    expect(screen.getByText('Powered by advanced AI and modern web technologies')).toBeInTheDocument();
  });

  test('renders all footer sections', () => {
    render(<Footer />);
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  test('renders product section links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('href', '#api');
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '#pricing');
  });

  test('renders company section links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '#blog');
    expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '#careers');
  });

  test('renders resources section links', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '#docs');
    expect(screen.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '#support');
    expect(screen.getByRole('link', { name: 'Status' })).toHaveAttribute('href', '#status');
  });

  test('renders copyright notice', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2025 Search Tool with Gen AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Built with React and GitHub Actions CI\/CD/i)).toBeInTheDocument();
  });

  test('section titles are rendered as headings', () => {
    render(<Footer />);
    
    const productHeading = screen.getByRole('heading', { name: 'Product' });
    const companyHeading = screen.getByRole('heading', { name: 'Company' });
    const resourcesHeading = screen.getByRole('heading', { name: 'Resources' });
    
    expect(productHeading).toBeInTheDocument();
    expect(companyHeading).toBeInTheDocument();
    expect(resourcesHeading).toBeInTheDocument();
  });

  test('renders correct number of links', () => {
    render(<Footer />);
    
    // Total of 9 links (3 sections × 3 links each)
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(9);
  });

  test('footer has semantic structure', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('all links have valid href attributes', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^#\w+$/);
    });
  });
});