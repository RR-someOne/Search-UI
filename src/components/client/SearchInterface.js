import React, { useState, useCallback } from 'react';

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const quickActions = [
    { icon: '�', text: 'Stock Analysis', query: 'analyze AAPL stock performance' },
    { icon: '�', text: 'Market Trends', query: 'current market trends and outlook' },
    { icon: '🏦', text: 'Investment Strategy', query: 'portfolio diversification strategies' }
  ];

  const performSearch = useCallback(async (query = searchQuery) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Connect to Finance GPT API
      const response = await fetch('http://localhost:5001/api/finance/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: trimmedQuery,
          context: 'search',
          includeData: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform AI response into result format
      const transformedResults = [{
        title: `Financial Analysis: ${trimmedQuery}`,
        snippet: data.response,
        data: data.data,
        sources: data.sources,
        suggestions: data.suggestions,
        timestamp: data.timestamp
      }];
      
      setResults(transformedResults);
    } catch (error) {
      console.error('Finance search error:', error);
      
      // Fallback to mock data when API is unavailable
      const fallbackResults = [{
        title: `Finance Search: ${trimmedQuery}`,
        snippet: `Unable to connect to Finance GPT API. This is a fallback response for "${trimmedQuery}". Please ensure the Finance API server is running on port 5001.`,
        data: null,
        sources: ['Fallback Mode'],
        suggestions: ['Check API server status', 'Verify network connection'],
        timestamp: new Date().toISOString()
      }];
      
      setResults(fallbackResults);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleQuickAction = (query) => {
    setSearchQuery(query);
    performSearch(query);
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
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>�</div>
          <div style={{ fontWeight: '600', fontSize: '28px', marginBottom: '8px' }}>
            Finance Search Tool with AI
          </div>
          <div>Ask me about stocks, market trends, investment strategies, or any financial topic.</div>
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
            <div className="result-snippet" style={{ whiteSpace: 'pre-wrap' }}>
              {result.snippet}
            </div>
            
            {/* Display financial data if available */}
            {result.data && (
              <div className="financial-data" style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Live Market Data:</div>
                
                {result.data.stocks && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Stocks:</strong>
                    {result.data.stocks.map((stock, i) => (
                      <span key={i} style={{ marginLeft: '8px', fontSize: '14px' }}>
                        {stock.symbol}: ${stock.price} ({stock.change})
                      </span>
                    ))}
                  </div>
                )}
                
                {result.data.indices && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Indices:</strong>
                    {result.data.indices.map((index, i) => (
                      <span key={i} style={{ marginLeft: '8px', fontSize: '14px' }}>
                        {index.name}: {index.value} ({index.change})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Display sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="sources" style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                <strong>Sources:</strong> {result.sources.join(', ')}
              </div>
            )}
            
            {/* Display suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="suggestions" style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>💡 Related searches:</div>
                {result.suggestions.map((suggestion, i) => (
                  <button 
                    key={i}
                    onClick={() => handleQuickAction(suggestion)}
                    style={{ 
                      margin: '2px 4px 2px 0', 
                      padding: '4px 8px', 
                      fontSize: '12px', 
                      background: '#e3f2fd', 
                      border: '1px solid #1976d2', 
                      borderRadius: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
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
            className="search-input"
            placeholder="Ask about stocks, market trends, or financial analysis..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          <button 
            className="search-button" 
            type="button"
            onClick={handleSearch}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"></circle>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className="quick-action" 
              onClick={() => handleQuickAction(action.query)}
            >
              <span className="quick-action-icon">{action.icon}</span>
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