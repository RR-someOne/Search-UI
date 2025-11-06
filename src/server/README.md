# Finance GPT API

A sophisticated financial analysis API powered by Large Language Models (LLM) for intelligent financial searches, stock analysis, and market insights.

## Features

### Core Capabilities
- **Intelligent Financial Search**: AI-powered responses to financial queries
- **Stock Analysis**: Comprehensive stock performance analysis with real-time data
- **Market Insights**: Market trends, sector analysis, and economic indicators
- **Portfolio Analysis**: Risk assessment and portfolio optimization
- **News Sentiment**: Financial news analysis with sentiment scoring
- **Economic Indicators**: GDP, CPI, unemployment data with AI interpretation

### Technical Features
- **OpenAI Integration**: GPT-4 powered financial analysis
- **Rate Limiting**: Protection against API abuse
- **CORS Support**: Cross-origin resource sharing for web applications
- **Error Handling**: Comprehensive error handling and fallback responses
- **Development Mode**: Mock responses when API keys are not configured
- **Extensible Architecture**: Easy to add new financial data sources

## API Endpoints

### Core Finance Search
```
POST /api/finance/search
```
**Request Body:**
```json
{
  "query": "What are the current market trends?",
  "context": "search",
  "includeData": true
}
```

### Stock Analysis
```
POST /api/finance/stock-analysis
```
**Request Body:**
```json
{
  "symbol": "AAPL",
  "analysisType": "comprehensive"
}
```

### Market Insights
```
POST /api/finance/market-insights
```
**Request Body:**
```json
{
  "market": "US",
  "sector": "technology",
  "timeframe": "1d"
}
```

### Portfolio Analysis
```
POST /api/finance/portfolio-analysis
```
**Request Body:**
```json
{
  "portfolio": [
    {"symbol": "AAPL", "shares": 100},
    {"symbol": "GOOGL", "shares": 50}
  ],
  "analysisType": "risk_return"
}
```

### Economic Indicators
```
GET /api/finance/economic-indicators?indicators=GDP,CPI&region=US
```

### News Sentiment
```
POST /api/finance/news-sentiment
```
**Request Body:**
```json
{
  "query": "Tesla earnings",
  "sources": ["reuters", "bloomberg", "wsj"]
}
```

### Health Check
```
GET /api/health
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd src/server
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

Required API keys:
- `OPENAI_API_KEY`: OpenAI API key for GPT integration
- `ALPHA_VANTAGE_API_KEY`: Alpha Vantage for stock data
- `FINNHUB_API_KEY`: Finnhub for market data
- `IEX_API_KEY`: IEX Cloud for financial data

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## Usage Examples

### Financial Search Query
```javascript
const response = await fetch('http://localhost:5000/api/finance/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Should I invest in renewable energy stocks?',
    context: 'advisory',
    includeData: true
  })
});

const data = await response.json();
console.log(data.response); // AI-generated financial advice
console.log(data.data);     // Relevant market data
```

### Stock Analysis
```javascript
const response = await fetch('http://localhost:5000/api/finance/stock-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symbol: 'TSLA',
    analysisType: 'comprehensive'
  })
});

const analysis = await response.json();
console.log(analysis.analysis); // AI-generated stock analysis
```

## Development Mode

When API keys are not configured, the API runs in development mode with mock responses. This allows you to:

- Test the API structure and endpoints
- Develop frontend integration without external dependencies
- Simulate realistic financial responses

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid request parameters
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side errors
- **404 Not Found**: Invalid endpoints

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Scope**: All `/api/` endpoints

## Security Features

- CORS protection with configurable origins
- Request body size limits (10MB)
- Rate limiting by IP address
- Environment-based configuration
- Secure header handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## API Keys Setup

### OpenAI API Key
1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account and generate an API key
3. Add to `.env`: `OPENAI_API_KEY=your_key_here`

### Financial Data APIs
- **Alpha Vantage**: [Get free API key](https://www.alphavantage.co/support/#api-key)
- **Finnhub**: [Register for API access](https://finnhub.io/register)
- **IEX Cloud**: [Sign up for API key](https://iexcloud.io/pricing/)

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the API health endpoint: `/api/health`
- Review server logs for debugging

---

