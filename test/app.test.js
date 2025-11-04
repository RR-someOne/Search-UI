const request = require('supertest');
const app = require('../server');

describe('Search UI API', () => {
    test('Health check endpoint', async () => {
        const response = await request(app)
            .get('/health')
            .expect(200);
            
        expect(response.body.status).toBe('healthy');
        expect(response.body.timestamp).toBeDefined();
    });
    
    test('Search endpoint with query', async () => {
        const response = await request(app)
            .get('/api/search?q=sample')
            .expect(200);
            
        expect(response.body.query).toBe('sample');
        expect(response.body.results).toBeDefined();
        expect(Array.isArray(response.body.results)).toBe(true);
        expect(response.body.total).toBeDefined();
    });
    
    test('Search endpoint without query', async () => {
        const response = await request(app)
            .get('/api/search')
            .expect(200);
            
        expect(response.body.query).toBe('');
        expect(response.body.results).toBeDefined();
        expect(Array.isArray(response.body.results)).toBe(true);
    });
    
    test('Static files are served', async () => {
        await request(app)
            .get('/')
            .expect(200);
    });
});