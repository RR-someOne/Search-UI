import {
  mockSearchResults,
  mockEmptySearchResults,
  mockSearchError,
  waitForSearchToComplete,
  createMockFetch,
  mockLocalStorage,
  mockLocation,
  TEST_QUERIES,
  QUICK_ACTIONS
} from '../testUtils';

describe('testUtils', () => {
  describe('mock data exports', () => {
    test('mockSearchResults contains expected structure', () => {
      expect(mockSearchResults).toHaveLength(3);
      expect(mockSearchResults[0]).toHaveProperty('title');
      expect(mockSearchResults[0]).toHaveProperty('snippet');
      expect(mockSearchResults[0].title).toContain('Advanced AI Research');
    });

    test('mockEmptySearchResults has empty results array', () => {
      expect(mockEmptySearchResults.results).toEqual([]);
      expect(mockEmptySearchResults.results).toHaveLength(0);
    });

    test('mockSearchError is an Error instance', () => {
      expect(mockSearchError).toBeInstanceOf(Error);
      expect(mockSearchError.message).toBe('Network connection failed');
    });
  });

  describe('helper functions', () => {
    test('waitForSearchToComplete resolves after timeout', async () => {
      const startTime = Date.now();
      await waitForSearchToComplete(100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(95); // Allow for timing variations
    });

    test('waitForSearchToComplete uses default timeout', async () => {
      const startTime = Date.now();
      await waitForSearchToComplete();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(950); // Default 1000ms timeout
    });

    test('createMockFetch returns successful response', async () => {
      const mockResponse = { data: 'test' };
      const mockFetch = createMockFetch(mockResponse);
      
      const response = await mockFetch();
      const data = await response.json();
      
      expect(data).toEqual(mockResponse);
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    test('createMockFetch handles rejection when shouldReject is true', async () => {
      const mockError = new Error('Test error');
      const mockFetch = createMockFetch(mockError, true);
      
      await expect(mockFetch()).rejects.toThrow('Test error');
    });

    test('createMockFetch with shouldReject false returns resolved promise', async () => {
      const mockResponse = { success: true };
      const mockFetch = createMockFetch(mockResponse, false);
      
      const response = await mockFetch();
      expect(response.ok).toBe(true);
      expect(await response.json()).toEqual(mockResponse);
    });
  });

  describe('mock implementations', () => {
    test('mockLocalStorage has all required methods', () => {
      expect(typeof mockLocalStorage.getItem).toBe('function');
      expect(typeof mockLocalStorage.setItem).toBe('function');
      expect(typeof mockLocalStorage.removeItem).toBe('function');
      expect(typeof mockLocalStorage.clear).toBe('function');
    });

    test('mockLocalStorage methods are jest functions', () => {
      expect(jest.isMockFunction(mockLocalStorage.getItem)).toBe(true);
      expect(jest.isMockFunction(mockLocalStorage.setItem)).toBe(true);
      expect(jest.isMockFunction(mockLocalStorage.removeItem)).toBe(true);
      expect(jest.isMockFunction(mockLocalStorage.clear)).toBe(true);
    });

    test('mockLocation has expected properties', () => {
      expect(mockLocation.href).toBe('http://localhost:3000');
      expect(mockLocation.pathname).toBe('/');
      expect(mockLocation.search).toBe('');
      expect(mockLocation.hash).toBe('#');
    });
  });

  describe('test data constants', () => {
    test('TEST_QUERIES contains expected queries', () => {
      expect(TEST_QUERIES.SIMPLE).toBe('test query');
      expect(TEST_QUERIES.AI_RESEARCH).toBe('latest AI research');
      expect(TEST_QUERIES.TECH_TRENDS).toBe('technology trends');
      expect(TEST_QUERIES.DEV_TOOLS).toBe('development tools');
      expect(TEST_QUERIES.EMPTY).toBe('');
      expect(TEST_QUERIES.WHITESPACE).toBe('   ');
    });

    test('QUICK_ACTIONS contains expected structure', () => {
      expect(QUICK_ACTIONS).toHaveLength(3);
      expect(QUICK_ACTIONS[0]).toHaveProperty('icon');
      expect(QUICK_ACTIONS[0]).toHaveProperty('text');
      expect(QUICK_ACTIONS[0]).toHaveProperty('query');
      expect(QUICK_ACTIONS[0].icon).toBe('🔬');
      expect(QUICK_ACTIONS[0].text).toBe('Latest AI Research');
      expect(QUICK_ACTIONS[0].query).toBe('latest AI research');
    });

    test('all QUICK_ACTIONS have required properties', () => {
      QUICK_ACTIONS.forEach(action => {
        expect(action).toHaveProperty('icon');
        expect(action).toHaveProperty('text');
        expect(action).toHaveProperty('query');
        expect(typeof action.icon).toBe('string');
        expect(typeof action.text).toBe('string');
        expect(typeof action.query).toBe('string');
      });
    });
  });
});