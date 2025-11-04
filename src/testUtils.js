// Test utilities and helpers
export const mockSearchResults = [
  {
    title: 'Advanced AI Research in Natural Language Processing',
    snippet: 'Recent breakthroughs in transformer models and their applications in search technology...'
  },
  {
    title: 'Machine Learning Algorithms for Search Optimization',
    snippet: 'How modern ML techniques improve search relevance and user experience...'
  },
  {
    title: 'Real-time Search Processing with Cloud Infrastructure',
    snippet: 'Scalable architectures for handling millions of search queries efficiently...'
  }
];

export const mockEmptySearchResults = {
  results: []
};

export const mockSearchError = new Error('Network connection failed');

// Helper functions for tests
export const waitForSearchToComplete = (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const createMockFetch = (response, shouldReject = false) => {
  return jest.fn(() => {
    if (shouldReject) {
      return Promise.reject(response);
    }
    return Promise.resolve({
      json: () => Promise.resolve(response),
      ok: true,
      status: 200
    });
  });
};

// Mock implementations
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '#'
};

// Test data constants
export const TEST_QUERIES = {
  SIMPLE: 'test query',
  AI_RESEARCH: 'latest AI research',
  TECH_TRENDS: 'technology trends',
  DEV_TOOLS: 'development tools',
  EMPTY: '',
  WHITESPACE: '   '
};

export const QUICK_ACTIONS = [
  { icon: '🔬', text: 'Latest AI Research', query: 'latest AI research' },
  { icon: '📊', text: 'Technology Trends', query: 'technology trends' },
  { icon: '⚡', text: 'Development Tools', query: 'development tools' }
];