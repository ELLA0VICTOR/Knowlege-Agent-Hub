# Knowledge Agent Hub

An intelligent AI-powered research assistant that fetches real-time data from multiple sources and provides comprehensive, well-sourced answers using Dobby-70B via Fireworks AI.

## Features

- **Real-time Data Integration**: Automatically fetches data from CoinGecko (crypto prices), arXiv (research papers), and Open-Meteo (weather forecasts)
- **Intelligent Source Selection**: AI automatically selects relevant data sources based on query context
- **Streaming Responses**: Real-time token-by-token response generation for immediate feedback
- **Professional UI**: Modern, responsive interface with smooth animations and dark theme
- **Sentient Compatible**: OpenAI-compatible API endpoint for integration with Sentient Chat

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Fastify with TypeScript
- **AI Model**: Dobby-70B (Sentient Foundation) via Fireworks AI
- **External APIs**: CoinGecko, arXiv, Open-Meteo
- **Features**: SSE streaming, CORS support, error handling

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 7
- **Features**: Real-time streaming UI, responsive design, animations

## Quick Start

### Prerequisites
- Node.js 18+
- Fireworks AI API key ([Get one here](https://fireworks.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd knowledge-agent-hub
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment**
   ```bash
   # In backend folder, create .env file
   cp .env.example .env
   ```
   
   Edit `.env` with your Fireworks API key:
   ```env
   FIREWORKS_API_KEY=fw-your-api-key-here
   OPENAI_BASE_URL=https://api.fireworks.ai/inference
   MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new
   PORT=8787
   CORS_ORIGIN=http://localhost:5173
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## Usage Examples

### Crypto Queries
- "What's the current Bitcoin price?"
- "How is Ethereum performing today?"
- "Analyze Solana's market trends"

### Research Queries
- "Latest AI research papers on neural networks"
- "Machine learning breakthroughs in 2025"
- "Papers about transformer architectures"

### Weather Queries
- "Weather in New York today"
- "What's the forecast for London?"
- "Temperature in Tokyo right now"

### General Queries
- "Explain blockchain technology"
- "How do neural networks work?"
- "What is decentralized finance?"

## API Endpoints

### Main Query Endpoint
```http
POST /api/query
Content-Type: application/json

{
  "query": "Your question here",
  "sources": ["coingecko", "arxiv", "openmeteo"], // optional
  "stream": true // optional, default: true
}
```

### Sentient-Compatible Endpoint
```http
POST /v1/chat/completions
Content-Type: application/json

{
  "model": "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new",
  "messages": [
    {"role": "user", "content": "Your message"}
  ],
  "stream": false
}
```

### Available Sources
```http
GET /api/sources
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your platform of choice

### Backend (Render/Railway/Heroku)
1. Set environment variables in your deployment platform
2. Use start command: `npm run build && npm start`

## Development

### Backend Development
```bash
cd backend
npm run dev    # Start with hot reload
npm test       # Run tests
npm run build  # Build for production
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  External APIs  │
│   (React)       │───▶│   (Fastify)     │───▶│  CoinGecko     │
│                 │    │                 │    │  arXiv         │
│   Vite + Tailwind│   │   TypeScript   │    │  Open-Meteo    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Dobby-70B      │
                       │  (via Fireworks)│
                       └─────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- **Sentient Foundation** for the amazing Dobby-70B model
- **Fireworks AI** for reliable model hosting
- **External API providers**: CoinGecko, arXiv, Open-Meteo

---

Built with ❤️ for the Sentient AGI ecosystem