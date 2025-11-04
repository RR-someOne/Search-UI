const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Main search endpoint
app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    
    // Mock search results
    const results = [
        { id: 1, title: 'Sample Result 1', url: '#', snippet: 'This is a sample search result' },
        { id: 2, title: 'Sample Result 2', url: '#', snippet: 'Another sample search result' },
        { id: 3, title: 'Sample Result 3', url: '#', snippet: 'Yet another search result' }
    ].filter(result => 
        query === '' || result.title.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
        query,
        results,
        total: results.length,
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Search UI server running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    // eslint-disable-next-line no-console
    console.log(`🔍 Search API: http://localhost:${PORT}/api/search?q=your-query`);
});

module.exports = app;