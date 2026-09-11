# OpenTerminal — mini trading terminal

A single-user trading terminal MVP inspired by [OpenTerminal](https://github.com/ErTasselli/OpenTerminal): watchlist + quote panel, a candlestick chart with RSI and Bollinger Bands, and a compact S&P 500 sector heatmap — all on free public market data (no API keys).

## Run

```bash
bun install
bun run dev
```

Then open http://localhost:3000.

## Features

- **Watchlist** — add/remove tickers (seeded with AAPL, MSFT, NVDA, TSLA, AMZN, SPY); watchlist and selected symbol persist in `localStorage`
- **Quote panel** — price, change %, day range, volume, 52-week range for the selected symbol
- **Chart** — [lightweight-charts](https://github.com/tradingview/lightweight-charts) candlesticks + volume, with toggleable Bollinger Bands (20, 2) overlay and RSI (14) pane; ranges from 1 month to 2 years
- **Sector heatmap** — daily % moves of the 11 SPDR sector ETFs, color-scaled

## Data source

Quotes and OHLCV history come from the unofficial, key-less Yahoo Finance endpoints (v7 spark for batched quotes, v8 chart for OHLCV), proxied through Next.js route handlers (`/api/quotes`, `/api/history/[symbol]`, `/api/sectors`). The server layer batches symbols into single upstream requests, spaces requests out, retries with backoff across both query hosts, and serves a short-TTL in-memory cache (stale on error). If the upstream is still unavailable, the UI shows graceful error/empty states instead of crashing.

The `dev`/`start` scripts run Next on the Bun runtime (`bun --bun next dev`): Yahoo's edge rejects Node's default TLS fingerprint from some networks (HTTP 429) but accepts Bun's fetch. Data is delayed and for demo purposes only.

## Stack

- Bun + Next.js (App Router, TypeScript, Tailwind)
- shadcn/ui (Base UI variant)
- lightweight-charts

No auth, no brokerage, no paid data vendors.
