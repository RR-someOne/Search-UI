# Finance Search AI 

A sophisticated finance search application powered by React and AI/LLM technology. Features an OpenAI ChatGPT-style interface for intelligent financial queries, stock analysis, and market insights.

##  Feature

### Frontend (React)
- **OpenAI ChatGPT-style Interface**: Modern, clean UI matching OpenAI's design language
- **Intelligent Financial Search**: AI-powered responses to financial queries
- **Real-time Finance Data Display**: Stock prices, market indices, currency rates
- **Quick Action Finance Prompts**: One-click access to common financial questions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Comprehensive Testing**: 60+ unit tests covering all components and edge cases

### Backend (Finance GPT API)
- **LLM-Powered Analysis**: OpenAI GPT-4 integration for intelligent financial insights
- **Multiple Financial Data Sources**: Integration with Alpha Vantage, Finnhub, IEX Cloud
- **Comprehensive API Endpoints**: Search, stock analysis, market insights, portfolio analysis
- **Development Mode**: Mock responses when API keys are not configured
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Robust error handling with fallback responses

##  Architecture

```
search-ui-react/
├── src/
│   ├── components/           # React components
│   │   ├── SearchInterface.js   # Main search component with Finance API integration
│   │   ├── Navigation.js        # OpenAI-style sidebar navigation
│   │   ├── Hero.js              # Finance-focused hero section
│   │   ├── Features.js          # Feature highlights
│   │   └── Footer.js            # Application footer
│   ├── server/              # Finance GPT API backend
│   │   ├── finance-gpt-api.js   # Main API server with LLM integration
│   │   ├── api-search.js        # Entry point wrapper
│   │   ├── package.json         # Backend dependencies
│   │   ├── .env                 # Environment configuration
│   │   └── README.md            # Backend documentation
│   ├── App.js               # Main application with OpenAI layout
│   └── App.css              # OpenAI-style CSS styling
├── public/                  # Static assets
├── package.json             # Frontend dependencies
├── start-finance-app.sh     # Startup script for both frontend and backend
└── README.md                # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Git (for version control)
- Optional: API keys for enhanced functionality

### 1. Clone the Repository
```bash
git clone https://github.com/RR-someOne/Search-UI.git
cd search-ui-react
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd src/server
npm install
cd ../..
```

### 3. Configure Environment (Optional)
For enhanced functionality with real AI responses:

```bash
cd src/server
cp .env.example .env
# Edit .env and add your API keys:
# OPENAI_API_KEY=your_openai_key_here
# ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
# FINNHUB_API_KEY=your_finnhub_key_here
```

### 4. Start the Application

**Option A: Use the Startup Script (Recommended)**
```bash
./start-finance-app.sh
```

**Option B: Start Manually**
```bash
# Terminal 1: Start Finance API
cd src/server
npm start

# Terminal 2: Start React Frontend
cd ../..
npm start
```

## Usage

### Access Points
- **React Frontend**: http://localhost:3000
- **Finance API**: http://localhost:5001/api/health
- **API Documentation**: See `src/server/README.md`

### Example Queries
Try these financial queries in the search interface:

- "What are the current market trends?"
- "Should I invest in renewable energy stocks?"
- "Analyze AAPL stock performance"
- "Portfolio diversification strategies"
- "Impact of interest rates on real estate"
- "Cryptocurrency market outlook"

### Quick Actions
Use the built-in quick actions for common financial queries:
- 📈 **Stock Analysis**: Analyze specific stock performance
- 💰 **Market Trends**: Current market conditions and outlook
- 🏦 **Investment Strategy**: Portfolio and investment guidance

## Available Scripts

### `npm start`
Runs the React app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner with 60+ comprehensive unit tests

### `npm run build`
Builds the app for production deployment

### `./start-finance-app.sh`
Starts both the React frontend and Finance API backend

## Testing

### Run Frontend Tests
```bash
npm test
```

### Test Coverage
- **60+ comprehensive unit tests**
- **Component functionality testing**
- **Edge case handling**
- **User interaction testing**
- **API integration testing**

## 🔧 API Integration

### Finance API Endpoints

**Health Check**
```bash
curl http://localhost:5001/api/health
```

**Financial Search**
```bash
curl -X POST http://localhost:5001/api/finance/search \
  -H "Content-Type: application/json" \
  -d '{"query":"market trends","context":"search","includeData":true}'
```

## UI Design - OpenAI ChatGPT Style

- **Sidebar Navigation**: Clean left sidebar with brand and menu items
- **Centered Chat Interface**: Main content area for search and results
- **Professional Typography**: Consistent font hierarchy and spacing
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Elements**: Hover effects and smooth animations

## Security & Performance

### Security Features
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: 100 requests per 15-minute window
- **Input Validation**: Comprehensive request validation
- **Environment Variables**: Secure API key management

## Development Mode

When API keys are not configured, the application runs in development mode with:
- **Mock Financial Data**: Realistic sample data for testing
- **Simulated AI Responses**: Educational financial content
- **Full UI Functionality**: Complete interface testing
- **No External Dependencies**: Works offline for development

## Contributing

1. Fork the Repository
2. Create a Feature Branch: `git checkout -b feature/amazing-feature`
3. Make Changes and Add Tests
4. Commit Changes: `git commit -m 'Add amazing feature'`
5. Push to Branch: `git push origin feature/amazing-feature`
6. Open Pull Request

