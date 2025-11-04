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
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('renders quick action buttons', () => {
    renderSearchInterface();
    
    expect(screen.getByText('Latest AI Research')).toBeInTheDocument();
    expect(screen.getByText('Technology Trends')).toBeInTheDocument();
    expect(screen.getByText('Development Tools')).toBeInTheDocument();
  });

  test('displays welcome message initially', () => {
    renderSearchInterface();
    
    expect(screen.getByText('Welcome to Search Tool with Gen AI')).toBeInTheDocument();
    expect(screen.getByText('Enter your search query above or try one of the quick actions to get started.')).toBeInTheDocument();
  });

  test('updates search input value when typing', async () => {
    const { unmount } = renderSearchInterface();
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Ensure clean state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    
    expect(searchInput).toHaveValue('test query');
    
    // Clean up
    unmount();
  });

  test('performs search when search button is clicked', async () => {
    const mockResponse = {
      results: [
        { title: 'Test Result', snippet: 'Test snippet' }
      ]
    };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Clear the input first to ensure clean state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    expect(mockFetch).toHaveBeenCalledWith('/api/search?q=test%20query');
    
    // Clean up
    unmount();
  });

  test('performs search when Enter key is pressed', async () => {
    const mockResponse = {
      results: [
        { title: 'Test Result', snippet: 'Test snippet' }
      ]
    };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Clear and type fresh
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query{enter}');
    
    expect(mockFetch).toHaveBeenCalledWith('/api/search?q=test%20query');
    
    // Clean up
    unmount();
  });

  test('shows loading state during search', async () => {
    // Mock a slow response
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          json: async () => ({ results: [] })
        }), 100)
      )
    );

    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    expect(screen.getByText('Searching with AI...')).toBeInTheDocument();
  });

  test('displays search results after successful search', async () => {
    const mockResponse = {
      results: [
        { title: 'Test Result 1', snippet: 'Test snippet 1' },
        { title: 'Test Result 2', snippet: 'Test snippet 2' }
      ]
    };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Result 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Result 2')).toBeInTheDocument();
    expect(screen.getByText('Test snippet 1')).toBeInTheDocument();
    expect(screen.getByText('Test snippet 2')).toBeInTheDocument();
    
    // Clean up
    unmount();
  });

  test('displays no results message when search returns empty', async () => {
    const mockResponse = { results: [] };
    
    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Clear and search with fresh state
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
    
    // Use a more flexible text matcher
    expect(screen.getByText((content, element) => {
      return content.includes('Try different keywords') && content.includes('test query');
    })).toBeInTheDocument();
    
    // Clean up
    unmount();
  });

  test('quick action buttons trigger search with predefined queries', async () => {
    const mockResponse = {
      results: [
        { title: 'AI Research Result', snippet: 'AI research snippet' }
      ]
    };
    
    fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    render(<SearchInterface />);
    
    const aiResearchButton = screen.getByText('Latest AI Research');
    await userEvent.click(aiResearchButton);
    
    expect(fetch).toHaveBeenCalledWith('/api/search?q=latest%20AI%20research');
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    expect(searchInput).toHaveValue('latest AI research');
  });

  test('handles search errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(searchInput, 'test query');
    await userEvent.click(searchButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Search error:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('does not perform search with empty query', async () => {
    const { unmount } = render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Ensure input is empty
    await userEvent.clear(searchInput);
    await userEvent.click(searchButton);
    
    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.getByText('Welcome to Search Tool with Gen AI')).toBeInTheDocument();
    
    // Clean up
    unmount();
  });
});