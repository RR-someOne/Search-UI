import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInterface from '../components/client/SearchInterface';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SearchInterface Empty Query Edge Cases', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockReset();
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockFetch.mockReset();
    jest.restoreAllMocks();
  });

  test('button is disabled when query is empty', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByTitle('Please enter a search query');
    
    // Ensure input is empty
    expect(searchInput.value).toBe('');
    
    // Button should be disabled when input is empty
    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveClass('search-button-disabled');
    
    // Clicking disabled button should not make API call
    await userEvent.click(searchButton);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('shows warning when attempting to search with empty query via Enter key', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Press Enter with empty input
    await userEvent.type(searchInput, '{enter}');
    
    // Should show warning message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Please enter a search query to get started')).toBeInTheDocument();
    
    // Should not make API call
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('shows warning when attempting to search with only whitespace', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    const searchButton = screen.getByTitle('Please enter a search query');
    
    // Type only whitespace
    await userEvent.type(searchInput, '   ');
    
    // Button should still be disabled
    expect(searchButton).toBeDisabled();
    
    // Try to search
    await userEvent.type(searchInput, '{enter}');
    
    // Should show warning message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Please enter a search query to get started')).toBeInTheDocument();
    
    // Should not make API call
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('clears warning when user starts typing valid query', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Trigger warning first
    await userEvent.type(searchInput, '{enter}');
    
    // Wait for warning to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Start typing a valid query
    await userEvent.type(searchInput, 'test query');
    
    // Warning should disappear
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('button becomes enabled when valid query is entered', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    let searchButton = screen.getByTitle('Please enter a search query');
    
    // Button should be disabled initially
    expect(searchButton).toBeDisabled();
    
    // Type a valid query
    await userEvent.type(searchInput, 'test query');
    
    // Button should now be enabled and title should change
    searchButton = screen.getByTitle('Search');
    expect(searchButton).not.toBeDisabled();
  });

  test('warning auto-hides after 3 seconds', async () => {
    jest.useFakeTimers();
    
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Trigger warning
    await userEvent.type(searchInput, '{enter}');
    
    // Wait for warning to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Fast-forward 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Warning should be gone
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test('quick actions clear warnings and work normally', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Trigger warning first
    await userEvent.type(searchInput, '{enter}');
    
    // Wait for warning to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Mock successful response for quick action
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        results: [{ id: '1', title: 'AI Research Result', snippet: 'Test snippet' }]
      })
    });
    
    // Click on a quick action
    const aiResearchButton = screen.getByText('Latest AI Research');
    await userEvent.click(aiResearchButton);
    
    // Warning should disappear
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    // Input should be populated
    expect(searchInput).toHaveValue('latest AI research');
    
    // API should be called
    expect(mockFetch).toHaveBeenCalledWith('/api/search?q=latest%20AI%20research');
  });

  test('input has proper accessibility attributes when warning is shown', async () => {
    render(<SearchInterface />);
    
    const searchInput = screen.getByPlaceholderText('What can I help you search for?');
    
    // Trigger warning
    await userEvent.type(searchInput, '{enter}');
    
    // Wait for warning to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Input should have aria-describedby pointing to warning
    expect(searchInput).toHaveAttribute('aria-describedby', 'empty-warning');
    
    // Warning should have proper id
    const warning = screen.getByRole('alert');
    expect(warning).toHaveAttribute('id', 'empty-warning');
  });
});