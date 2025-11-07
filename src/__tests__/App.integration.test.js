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
    const mockResponse = { 
      response: 'Finance analysis response',
      data: { stocks: [] },
      sources: ['Test'],
      suggestions: []
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { unmount } = render(<App />);
    
    // Verify initial state
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...')).toBeInTheDocument();
    
    // Perform search
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'AAPL stock analysis');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await userEvent.click(searchButton);
    
    // Verify search was called with finance API
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/finance/search', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'AAPL stock analysis',
        context: 'search',
        includeData: true
      })
    }));
    
    // Wait for and verify results
    await waitFor(() => {
      expect(screen.getByText('Financial Analysis: AAPL stock analysis')).toBeInTheDocument();
    });
    
    // Clean up
    unmount();
  });

  test('navigation and hero sections work together', () => {
    render(<App />);
    
    // Navigation elements (OpenAI-style sidebar)
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    
    // Search interface (finance-focused)
    expect(screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...')).toBeInTheDocument();
  });

  test('search functionality works end-to-end', async () => {
    const mockResponse = { 
      response: 'Stock analysis response',
      data: { stocks: [] },
      sources: ['Test'],
      suggestions: []
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { unmount } = render(<App />);
    
    // Ensure clean state
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    await userEvent.clear(searchInput);
    
    // Type in search query
    await userEvent.type(searchInput, 'analyze AAPL stock performance');
    
    // Click search button
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await userEvent.click(searchButton);
    
    // Verify search was triggered with correct query
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/finance/search', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        query: 'analyze AAPL stock performance',
        context: 'search',
        includeData: true
      })
    }));
    
    // Verify input value
    expect(searchInput).toHaveValue('analyze AAPL stock performance');
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Financial Analysis: analyze AAPL stock performance')).toBeInTheDocument();
    });
    
    // Clean up
    unmount();
  });

  test('finance interface displays correctly with search functionality', () => {
    render(<App />);
    
    // Verify finance-focused interface elements
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    
    // Verify search is accessible with finance focus
    expect(screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...')).toBeInTheDocument();
  });

  test('OpenAI-style sidebar navigation works with search functionality', () => {
    render(<App />);
    
    // Verify sidebar navigation content
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    
    // Verify search is still functional
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    expect(searchInput).toBeInTheDocument();
  });

  test('error handling works across the entire app', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    const { unmount } = render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Finance search error:', expect.any(Error));
    });
    
    // Verify fallback response is shown
    await waitFor(() => {
      expect(screen.getByText('Finance Search: test query')).toBeInTheDocument();
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
    expect(screen.getByText('Finance Search Tool')).toBeInTheDocument(); // sidebar only
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('accessibility features work throughout the app', () => {
    render(<App />);
    
    // Check for proper form controls
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder');
    expect(searchInput.getAttribute('placeholder')).toBe('Ask about stocks, market trends, or financial analysis...');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeInTheDocument();
    
    // Check navigation accessibility (OpenAI-style sidebar)
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Check main content accessibility
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});