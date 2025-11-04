import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { mockSearchResults } from '../testUtils';

// Mock fetch globally for integration tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks completely
    mockFetch.mockReset();
    mockFetch.mockClear();
    
    // Reset DOM between tests
    document.body.innerHTML = '';
    
    // Clear any React component state
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Ensure complete cleanup
    mockFetch.mockReset();
    jest.restoreAllMocks();
  });

  test('complete search flow from navigation to results', async () => {
    const mockResponse = { results: mockSearchResults };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<App />);
    
    // Verify initial state
    expect(screen.getByText('What Can I help you with?')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Search Tool with Gen AI')).toBeInTheDocument();
    
    // Perform search
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'artificial intelligence');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    
    // Verify search was called
    expect(mockFetch).toHaveBeenCalledWith('/api/search?q=artificial%20intelligence');
    
    // Wait for and verify results
    await waitFor(() => {
      expect(screen.getByText('Advanced AI Research in Natural Language Processing')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Machine Learning Algorithms for Search Optimization')).toBeInTheDocument();
    expect(screen.getByText('Real-time Search Processing with Cloud Infrastructure')).toBeInTheDocument();
    
    // Clean up
    unmount();
  });

  test('navigation and hero sections work together', () => {
    render(<App />);
    
    // Navigation elements
    expect(screen.getAllByText('Search Tool with Gen AI')).toHaveLength(2);
    expect(screen.getAllByText('Features')).toHaveLength(2);
    expect(screen.getAllByText('API')).toHaveLength(2);
    expect(screen.getAllByText('About')).toHaveLength(2);
    
    // Hero section
    expect(screen.getByText(/Intelligent search powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/artificial intelligence/i)).toBeInTheDocument();
    
    // Search interface
    expect(screen.getByPlaceholderText('What can I help you search for?')).toBeInTheDocument();
  });

  test('quick actions work end-to-end', async () => {
    const mockResponse = { results: mockSearchResults };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<App />);
    
    // Ensure clean state
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    await userEvent.clear(searchInput);
    
    // Click on a quick action
    const aiResearchButton = screen.getByText('Latest AI Research');
    await userEvent.click(aiResearchButton);
    
    // Verify search was triggered with correct query
    expect(mockFetch).toHaveBeenCalledWith('/api/search?q=latest%20AI%20research');
    
    // Verify input was updated
    expect(searchInput).toHaveValue('latest AI research');
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Advanced AI Research in Natural Language Processing')).toBeInTheDocument();
    });
    
    // Clean up
    unmount();
  });

  test('features section displays correctly with search functionality', () => {
    render(<App />);
    
    // Verify features are displayed
    expect(screen.getByText('AI-Powered Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Secure & Private')).toBeInTheDocument();
    
    // Verify search is still accessible
    expect(screen.getByPlaceholderText('What can I help you search for?')).toBeInTheDocument();
  });

  test('footer links are accessible while search functionality works', () => {
    render(<App />);
    
    // Verify footer content
    expect(screen.getByText(/© 2025 Search Tool with Gen AI/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Support' })).toBeInTheDocument();
    
    // Verify search is still functional
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    expect(searchInput).toBeInTheDocument();
  });

  test('error handling works across the entire app', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    const { unmount } = render(<App />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Search error:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
    unmount();
  });

  test('responsive layout works with all components', () => {
    // Mock different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<App />);
    
    // Verify all main components render in responsive layout
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('What Can I help you with?')).toBeInTheDocument();
    expect(screen.getByText(/Intelligent search powered by/i)).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Intelligence')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('accessibility features work throughout the app', () => {
    render(<App />);
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1, name: /What Can I help you with/i });
    expect(mainHeading).toBeInTheDocument();
    
    const heroHeading = screen.getByRole('heading', { level: 1, name: /Intelligent search powered by/i });
    expect(heroHeading).toBeInTheDocument();
    
    // Check for proper form controls
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    
    // Check navigation accessibility
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Check footer accessibility
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});