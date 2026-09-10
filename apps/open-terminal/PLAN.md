# OpenTerminal demo — PLAN

## Goal

A single-user trading terminal MVP inspired by [OpenTerminal](https://github.com/ErTasselli/OpenTerminal): watchlist + quote panel, one candlestick chart with a couple indicators, and a tiny sector heatmap — all on free public market data.

## Single-user MVP

**In**
- Watchlist of tickers (add/remove; seeded with a small default set)
- Quote panel for the selected symbol (price, change %, volume when available)
- One candlestick chart (lightweight-charts) with RSI and/or MACD/Bollinger toggle
- Tiny sector heatmap (static or free-data-backed grid of sector % moves)
- Free public data only (no paid APIs / no keys required for the happy path)
- Self-contained under `apps/open-terminal/`: `bun install && bun run dev`
- Persist watchlist + selected symbol in `localStorage`

**Out**
- Full OpenTerminal clone / Bloomberg parity
- Brokerage auth, order entry, portfolios, alerts
- Paid market-data vendors
- Multi-user auth or cloud sync
- Cloudflare/Pages deploy wiring for this PR

## Outcome-oriented tasks

1. **Scaffold** — `bunx create-next-app` (App Router, TypeScript, Tailwind) inside `apps/open-terminal/`; add `bunfig.toml` with `[install] minimumReleaseAge = 259200`; then `bun install`
2. **UI kit** — `bunx shadcn@latest init` (minimalist) + button, card, input, badge, tabs as needed
3. **Data layer** — thin client/server helpers for free public quotes + OHLCV (document source; graceful empty/error states)
4. **Watchlist + quotes** — list UI, select symbol, quote panel
5. **Chart** — lightweight-charts candlesticks + 1–2 indicators
6. **Heatmap** — compact sector grid
7. **Polish** — README run instructions; `bun run build` smoke
8. **Validate** — capture ≥1 screenshot AND ≥1 short video of the running app for the PR

## Stack

| Choice | Why |
| --- | --- |
| Bun | Monorepo default |
| Next.js App Router via `create-next-app` | Opinionated shell |
| TypeScript + Tailwind | Scaffold defaults |
| shadcn/ui | Minimal UI |
| lightweight-charts | Standard free charting |
| Free public market endpoints | No paid keys for MVP |
| localStorage | One-user persistence |

## Deferred

- More indicators / drawing tools
- Screener filters at OpenTerminal depth
- Streaming websockets
- Pages deploy path

## Source

- Bookmark: https://x.com/aiedge_/status/2097626149992247629
- OpenTerminal: https://github.com/ErTasselli/OpenTerminal