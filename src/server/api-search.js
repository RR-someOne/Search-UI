/**
 * API Search Entry Point
 * Simple wrapper to start the Finance GPT API server
 */

require('dotenv').config();
const FinanceGPTAPI = require('./finance-gpt-api');

// Initialize and start the Finance GPT API
const financeAPI = new FinanceGPTAPI();

// Start server on specified port
const PORT = process.env.PORT || 5000;
financeAPI.start(PORT);

console.log('🔍 Finance Search API initialized');
console.log(`📈 Ready to handle intelligent financial queries on port ${PORT}`);