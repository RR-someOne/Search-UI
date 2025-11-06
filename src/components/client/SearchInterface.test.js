import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInterface from './SearchInterface';
import React from 'react';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Component key to force complete re-renders
let componentKey = 0;

// Test wrapper to ensure fresh component instances
const TestWrapper = ({ children }) => {
  return <div key={componentKey}>{children}</div>;
};

describe('SearchInterface Component', () => {
  beforeEach(async () => {
    // Reset all mocks completely
    mockFetch.mockReset();
    mockFetch.mockClear();
    
    // Force complete DOM cleanup
    cleanup();
    document.body.innerHTML = '';
    
    // Increment component key for fresh instance
    componentKey++;
    
    // Clear any React component state
    jest.clearAllMocks();
    jest.clearAllTimers();
    
    // Wait for any pending async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  afterEach(async () => {
    // Ensure complete cleanup
    await act(async () => {
      cleanup();
    });
    mockFetch.mockReset();
    jest.restoreAllMocks();
  });

  // Helper function to render with fresh instance
  const renderSearchInterface = () => {
    return render(
      <TestWrapper>
        <SearchInterface key={componentKey} />
      </TestWrapper>
    );
  };

  test('renders search input and button', () => {
    renderSearchInterface();
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('renders quick action buttons', () => {
    renderSearchInterface();
    
    expect(screen.getByText('Stock Analysis')).toBeInTheDocument();
    expect(screen.getByText('Market Trends')).toBeInTheDocument();
    expect(screen.getByText('Investment Strategy')).toBeInTheDocument();
  });

  test('displays welcome message initially', () => {
    renderSearchInterface();
    
    expect(screen.getByText('Finance Search Tool with AI')).toBeInTheDocument();
    expect(screen.getByText('Ask me about stocks, market trends, investment strategies, or any financial topic.')).toBeInTheDocument();
  });

  test('updates search input value when typing', async () => {
    const { unmount } = renderSearchInterface();
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    
    // Ensure clean state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'AAPL stock analysis');
    
    expect(searchInput).toHaveValue('AAPL stock analysis');
    
    // Clean up
    unmount();
  });

  test('performs search when search button is clicked', async () => {
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

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    // Clear the input first to ensure clean state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'AAPL stock analysis');
    await userEvent.click(searchButton);
    
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/finance/search', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'AAPL stock analysis',
        context: 'search',
        includeData: true
      })
    }));
    
    // Clean up
    unmount();
  });

  test('performs search when Enter key is pressed', async () => {
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

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    
    // Clear and type fresh
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query{enter}');
    
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/finance/search', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'test query',
        context: 'search',
        includeData: true
      })
    }));
    
    // Clean up
    unmount();
  });

  test('shows loading state during search', async () => {
    // Mock a slow response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ response: 'test', data: null, sources: [], suggestions: [] })
        }), 100)
      )
    );

    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    expect(screen.getByText('Searching with AI...')).toBeInTheDocument();
  });

  test('displays search results after successful search', async () => {
    const mockResponse = {
      response: 'Finance analysis for test query',
      data: { stocks: [] },
      sources: ['Test Source'],
      suggestions: []
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Analysis: test query')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Finance analysis for test query')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      // Look for text that contains "1 result found for" - the text might be split across elements
      return element && element.className === 'results-header' && content.includes('result found for');
    })).toBeInTheDocument();
    
    // Clean up
    unmount();
  });

  test('displays search results even with empty response', async () => {
    const mockResponse = { response: '', data: null, sources: [], suggestions: [] };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    // Clear and search with fresh state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Analysis: test query')).toBeInTheDocument();
    });
    
    // The component should still show the result header even with empty response
    expect(screen.getByText((content, element) => {
      return element && element.className === 'results-header' && content.includes('result found for');
    })).toBeInTheDocument();
    
    // Clean up
    unmount();
  });

  test('quick action buttons trigger search with predefined queries', async () => {
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

    render(<SearchInterface />);
    
    const stockAnalysisButton = screen.getByText('Stock Analysis');
    await userEvent.click(stockAnalysisButton);
    
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/finance/search', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'analyze AAPL stock performance',
        context: 'search',
        includeData: true
      })
    }));
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    expect(searchInput).toHaveValue('analyze AAPL stock performance');
  });

  test('handles search errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Finance search error:', expect.any(Error));
    });
    
    // Check that fallback results are shown
    await waitFor(() => {
      expect(screen.getByText('Finance Search: test query')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test('does not perform search with empty query', async () => {
    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('Ask about stocks, market trends, or financial analysis...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    // Ensure input is empty
    await userEvent.clear(searchInput);
    await userEvent.click(searchButton);
    
    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.getByText('Finance Search Tool with AI')).toBeInTheDocument();
    
    // Clean up
    unmount();
  });
});