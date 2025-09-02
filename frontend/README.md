# Knowledge Agent Hub

A full-stack **Sentient-ready** agent that:
- Fetches real-time data from CoinGecko, arXiv, and Open-Meteo.
- Summarizes using an **OpenAI-compatible** model (e.g., **Dobby-70**).
- Streams responses end-to-end.
- Exposes `/api/query` and an OpenAI-compatible `/v1/chat/completions` endpoint.
- Includes a React + Tailwind + Vite demo UI.

## Monorepo Layout
- `backend/` Fastify + TypeScript server
- `frontend/` React 19 + Vite + Tailwind app
- `shared/` shared TS types
- `docs/` integration notes

## Quickstart

### 1) Backend
```bash
cd backend
cp ../.env.example .env
# edit .env with your OPENAI_BASE_URL / OPENAI_API_KEY / MODEL (e.g., Dobby-70)
npm i
npm run dev
