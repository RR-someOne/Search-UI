/**
 * Finance GPT API - Specialized LLM integration for financial searches and analysis
 * Provides intelligent financial data retrieval, analysis, and insights
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

class FinanceGPTAPI {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    
    // Finance-specific configurations
    this.financeAPIs = {
      // Add your API keys here
      openai: process.env.OPENAI_API_KEY,
      alphaVantage: process.env.ALPHA_VANTAGE_API_KEY,
      finnhub: process.env.FINNHUB_API_KEY,
      iex: process.env.IEX_API_KEY
    };

    this.financePrompts = {
      analysis: `You are a professional financial analyst AI. Provide comprehensive, accurate financial analysis based on the user's query. 
                 Include relevant market data, trends, and actionable insights. Format responses in a clear, professional manner.`,
      
      search: `You are a finance search specialist. Help users find specific financial information, stocks, market data, 
               economic indicators, and investment insights. Provide detailed, factual responses with data sources when possible.`,
      
      advisory: `You are a financial advisory AI. Provide educational financial guidance while clearly stating this is not 
                 personalized financial advice. Include risk considerations and suggest consulting with financial professionals.`
    };
  }

  setupMiddleware() {
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Main finance search endpoint
    this.app.post('/api/finance/search', this.handleFinanceSearch.bind(this));
    
    // Stock analysis endpoint
    this.app.post('/api/finance/stock-analysis', this.handleStockAnalysis.bind(this));
    
    // Market insights endpoint
    this.app.post('/api/finance/market-insights', this.handleMarketInsights.bind(this));
    
    // Portfolio analysis endpoint
    this.app.post('/api/finance/portfolio-analysis', this.handlePortfolioAnalysis.bind(this));
    
    // Economic indicators endpoint
    this.app.get('/api/finance/economic-indicators', this.handleEconomicIndicators.bind(this));
    
    // News and sentiment analysis
    this.app.post('/api/finance/news-sentiment', this.handleNewsSentiment.bind(this));
    
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Finance GPT API'
      });
    });
  }

  async handleFinanceSearch(req, res) {
    try {
      const { query, context = 'search', includeData = true } = req.body;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          error: 'Query is required',
          message: 'Please provide a search query'
        });
      }

      console.log(`Finance search request: ${query}`);

      // Generate LLM response
      const llmResponse = await this.generateLLMResponse(query, context);
      
      // Fetch relevant financial data if requested
      let financialData = null;
      if (includeData) {
        financialData = await this.fetchRelevantFinancialData(query);
      }

      // Combine and format response
      const response = {
        query: query,
        response: llmResponse,
        data: financialData,
        timestamp: new Date().toISOString(),
        sources: this.extractSources(llmResponse),
        suggestions: this.generateSearchSuggestions(query)
      };

      res.json(response);
    } catch (error) {
      console.error('Finance search error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process finance search request'
      });
    }
  }

  async handleStockAnalysis(req, res) {
    try {
      const { symbol, analysisType = 'comprehensive' } = req.body;

      if (!symbol) {
        return res.status(400).json({
          error: 'Stock symbol is required'
        });
      }

      // Fetch stock data
      const stockData = await this.fetchStockData(symbol);
      
      // Generate AI analysis
      const analysis = await this.generateStockAnalysis(symbol, stockData, analysisType);

      res.json({
        symbol: symbol.toUpperCase(),
        analysis,
        data: stockData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Stock analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze stock',
        message: error.message
      });
    }
  }

  async handleMarketInsights(req, res) {
    try {
      const { market = 'US', sector, timeframe = '1d' } = req.body;

      const marketData = await this.fetchMarketData(market, sector, timeframe);
      const insights = await this.generateMarketInsights(marketData, market, sector);

      res.json({
        market,
        sector,
        timeframe,
        insights,
        data: marketData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Market insights error:', error);
      res.status(500).json({
        error: 'Failed to generate market insights',
        message: error.message
      });
    }
  }

  async handlePortfolioAnalysis(req, res) {
    try {
      const { portfolio, analysisType = 'risk_return' } = req.body;

      if (!portfolio || !Array.isArray(portfolio)) {
        return res.status(400).json({
          error: 'Portfolio data is required and must be an array'
        });
      }

      const analysis = await this.analyzePortfolio(portfolio, analysisType);

      res.json({
        portfolio,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze portfolio',
        message: error.message
      });
    }
  }

  async handleEconomicIndicators(req, res) {
    try {
      const { indicators = ['GDP', 'CPI', 'unemployment'], region = 'US' } = req.query;
      
      const economicData = await this.fetchEconomicIndicators(indicators, region);
      const analysis = await this.analyzeEconomicIndicators(economicData);

      res.json({
        indicators: Array.isArray(indicators) ? indicators : [indicators],
        region,
        data: economicData,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Economic indicators error:', error);
      res.status(500).json({
        error: 'Failed to fetch economic indicators',
        message: error.message
      });
    }
  }

  async handleNewsSentiment(req, res) {
    try {
      const { query, sources = ['reuters', 'bloomberg', 'wsj'] } = req.body;

      const newsData = await this.fetchFinancialNews(query, sources);
      const sentiment = await this.analyzeSentiment(newsData);

      res.json({
        query,
        news: newsData,
        sentiment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('News sentiment error:', error);
      res.status(500).json({
        error: 'Failed to analyze news sentiment',
        message: error.message
      });
    }
  }

  async generateLLMResponse(query, context) {
    try {
      if (!this.financeAPIs.openai) {
        // Fallback to mock response for development
        return this.generateMockFinanceResponse(query, context);
      }

      const prompt = this.financePrompts[context] || this.financePrompts.search;
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.financeAPIs.openai}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('LLM API error:', error);
      return this.generateMockFinanceResponse(query, context);
    }
  }

  generateMockFinanceResponse(query, context) {
    const mockResponses = {
      search: `Based on your search for "${query}", here are the key financial insights:

• **Market Analysis**: Current market conditions show mixed signals with volatility in key sectors
• **Investment Considerations**: Consider diversification across asset classes
• **Risk Assessment**: Moderate risk levels with potential for both growth and downside
• **Recommendations**: Consult with a financial advisor for personalized guidance

*Note: This is a simulated response for development purposes.*`,

      analysis: `Financial Analysis for "${query}":

**Key Metrics:**
- Market Cap: Analysis pending real-time data
- P/E Ratio: Within industry standards
- Revenue Growth: Positive trend indicators
- Debt-to-Equity: Manageable levels

**Recommendations:**
- Monitor quarterly earnings reports
- Track sector performance trends
- Consider long-term investment horizon

*This is a development mock response. Connect to real financial APIs for live data.*`,

      advisory: `Financial Advisory Response for "${query}":

**Educational Guidance:**
- Diversification remains a fundamental principle
- Risk tolerance assessment is crucial
- Regular portfolio rebalancing recommended
- Emergency fund maintenance is essential

**Important Disclaimer:**
This is educational content only and not personalized financial advice. Please consult with qualified financial professionals for investment decisions.

*Development mode active - connect to production APIs for real advisory content.*`
    };

    return mockResponses[context] || mockResponses.search;
  }

  async fetchRelevantFinancialData(query) {
    // Mock financial data for development
    return {
      stocks: [
        { symbol: 'AAPL', price: 175.50, change: '+1.2%' },
        { symbol: 'GOOGL', price: 2750.30, change: '-0.8%' },
        { symbol: 'MSFT', price: 378.90, change: '+0.5%' }
      ],
      indices: [
        { name: 'S&P 500', value: 4485.30, change: '+0.3%' },
        { name: 'NASDAQ', value: 13924.50, change: '-0.2%' },
        { name: 'DOW', value: 34765.80, change: '+0.1%' }
      ],
      currencies: [
        { pair: 'USD/EUR', rate: 0.85, change: '+0.1%' },
        { pair: 'USD/GBP', rate: 0.73, change: '-0.05%' }
      ]
    };
  }

  extractSources(response) {
    // Extract mentioned sources from the response
    const sources = [];
    const sourcePatterns = [
      /Bloomberg/gi,
      /Reuters/gi,
      /Wall Street Journal/gi,
      /Financial Times/gi,
      /SEC filings/gi,
      /Yahoo Finance/gi
    ];

    sourcePatterns.forEach(pattern => {
      if (pattern.test(response)) {
        sources.push(pattern.source.replace(/[\/gi]/g, ''));
      }
    });

    return sources.length > 0 ? sources : ['Market Data Providers', 'Financial APIs'];
  }

  generateSearchSuggestions(query) {
    const suggestions = [
      'Stock performance analysis',
      'Market trends today',
      'Portfolio diversification strategies',
      'Economic indicators impact',
      'Sector rotation opportunities',
      'Risk management techniques'
    ];

    return suggestions.slice(0, 3);
  }

  setupErrorHandling() {
    this.app.use((error, req, res, next) => {
      console.error('API Error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      });
    });

    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: 'API endpoint not found'
      });
    });
  }

  start(port = process.env.PORT || 5001) {
    this.app.listen(port, () => {
      console.log(`🚀 Finance GPT API running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/api/health`);
    });
  }
}

// Export for use in other modules
module.exports = FinanceGPTAPI;

// Start server if run directly
if (require.main === module) {
  const api = new FinanceGPTAPI();
  api.start();
}