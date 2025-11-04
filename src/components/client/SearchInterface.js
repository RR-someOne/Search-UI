import React, { useState, useCallback } from 'react';

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  const quickActions = [
    { text: 'Search with AI', query: 'search with AI', category: 'primary' },
    { text: 'Learn about AI Business', query: 'learn about AI business', category: 'secondary' },
    { text: 'Talk with AI', query: 'talk with AI', category: 'secondary' },
    { text: 'Research', query: 'research', category: 'secondary' },
    { text: 'More', query: 'more options', category: 'secondary' }
  ];

  const performSearch = useCallback(async (query = searchQuery) => {
    const trimmedQuery = query.trim();
    
    // Clear any previous warnings
    setShowEmptyWarning(false);
    
    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(false);
      setShowEmptyWarning(true);
      
      // Auto-hide warning after 3 seconds
      setTimeout(() => setShowEmptyWarning(false), 3000);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
      const data = await response.json();
      
      // Simulate network delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      // Focus back on input for better UX
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    performSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();
      
      if (!trimmedQuery) {
        // Keep focus on input when query is empty
        e.target.focus();
      }
      
      performSearch();
    }
  };

  const handleQuickAction = (query) => {
    setSearchQuery(query);
    setShowEmptyWarning(false); // Clear any warnings when using quick actions
    performSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear warning when user starts typing
    if (showEmptyWarning && value.trim()) {
      setShowEmptyWarning(false);
    }
  };



  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span className="loading-text">Searching with AI...</span>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="no-results">
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🚀</div>
          <div style={{ fontWeight: '600', fontSize: '28px', marginBottom: '8px' }}>
            Welcome to Search Tool with Gen AI
          </div>
          <div>Enter your search query above or try one of the quick actions to get started.</div>
        </div>
      );
    }

    if (!results || results.length === 0) {
      return (
        <div className="no-results">
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontWeight: '600', fontSize: '28px', marginBottom: '8px' }}>
            No results found
          </div>
          <div>
            Try different keywords or check your spelling for "{searchQuery}"
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="results-header">
          <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} found for 
          <strong> "{searchQuery}"</strong> • Generated with AI assistance
        </div>
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <div className="result-title">{result.title}</div>
            <div className="result-snippet">{result.snippet}</div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <div className="search-input-container">
          <input 
            type="text" 
            className={`search-input ${showEmptyWarning ? 'search-input-warning' : ''}`}
            placeholder="Message AI" 
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoComplete="off"
            aria-describedby={showEmptyWarning ? "empty-warning" : undefined}
          />
          <button 
            className={`search-button ${!searchQuery.trim() ? 'search-button-disabled' : ''}`}
            type="button"
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            title={!searchQuery.trim() ? "Please enter a search query" : "Search"}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"></circle>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
        
        {/* Empty Query Warning */}
        {showEmptyWarning && (
          <div id="empty-warning" className="empty-warning" role="alert">
            <span className="warning-icon">⚠️</span>
            Please enter a search query to get started
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className={`quick-action ${action.category}`} 
              onClick={() => handleQuickAction(action.query)}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div className="results-container">
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchInterface;