# Global Intelligence Dashboard

Responsive TypeScript rebuild of the original one-file dashboard. It uses a backend aggregator for data collection, caching, and live updates, and a frontend React app for rendering.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Realtime updates: Server-Sent Events
- Persistence: JSON snapshot cache in `data/cache/latest-snapshot.json`

## Public feeds wired in

- Bitcoin: CoinGecko
- Population / births / deaths model: World Bank annual indicators + interpolation
- ISS position: Where The ISS At
- Weather: Open-Meteo
- News: Google News RSS
- Google trends: Google Trends RSS
- Renewable energy share: World Bank

## Placeholder or optional feeds

- X trends: requires authenticated X API access
- Flights: OpenSky works best with credentials; public access is rate-limited
- Athlete milestones: read from `data/manual-overrides.json`
- Warming metric: read from `data/manual-overrides.json`

## Run

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API calls to the backend on `http://localhost:8787`.

## Production build

```bash
npm run build
npm start
```

## Configuration

Copy `.env.example` to `.env` if you want to configure:

- `PORT`
- `TRENDS_GEO`
- `OPENSKY_CLIENT_ID`
- `OPENSKY_CLIENT_SECRET`
