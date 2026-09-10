import type { Candle, Quote } from "./types";

// Free, key-less Yahoo Finance endpoints:
// - v7 spark: batched quotes (one request for the whole watchlist / sector grid)
// - v8 chart: OHLCV history for a single symbol
// The upstream intermittently rate-limits (429), so requests retry with
// backoff across both query hosts and successful payloads are kept in an
// in-memory cache that is served fresh for a short TTL and stale on error.

const HOSTS = [
  "https://query1.finance.yahoo.com",
  "https://query2.finance.yahoo.com",
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
};

const FRESH_TTL_MS = 30_000;
const MAX_ATTEMPTS = 4;
const MIN_REQUEST_GAP_MS = 300;

const cache = new Map<string, { at: number; payload: unknown }>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Yahoo rate-limits bursts from a single IP, so space upstream requests out
// by serializing them through a shared promise chain.
let queue: Promise<void> = Promise.resolve();

function throttled<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task);
  queue = run.then(
    () => sleep(MIN_REQUEST_GAP_MS),
    () => sleep(MIN_REQUEST_GAP_MS),
  );
  return run;
}

async function yahooFetch<T>(path: string): Promise<T> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.at < FRESH_TTL_MS) {
    return cached.payload as T;
  }

  let lastError: Error = new Error("Request failed");
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const host = HOSTS[attempt % HOSTS.length];
    try {
      const res = await throttled(() =>
        fetch(`${host}${path}`, { headers: HEADERS, cache: "no-store" }),
      );
      if (!res.ok) {
        throw new Error(`Upstream responded ${res.status}`);
      }
      const payload = (await res.json()) as T;
      cache.set(path, { at: Date.now(), payload });
      return payload;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(250 * 2 ** attempt + Math.random() * 200);
      }
    }
  }

  // Serve stale data rather than failing outright.
  if (cached) return cached.payload as T;
  throw lastError;
}

interface ChartMeta {
  currency?: string;
  symbol: string;
  exchangeName?: string;
  fullExchangeName?: string;
  longName?: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  regularMarketTime?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

interface ChartResult {
  meta: ChartMeta;
  timestamp?: number[];
  indicators: {
    quote: {
      open: (number | null)[];
      high: (number | null)[];
      low: (number | null)[];
      close: (number | null)[];
      volume: (number | null)[];
    }[];
  };
}

interface ChartResponse {
  chart: {
    result: ChartResult[] | null;
    error: { code: string; description: string } | null;
  };
}

interface SparkResponse {
  spark: {
    result:
      | { symbol: string; response: { meta: ChartMeta }[] | null }[]
      | null;
    error: { code: string; description: string } | null;
  };
}

function metaToQuote(meta: ChartMeta): Quote | null {
  if (meta.regularMarketPrice == null) return null;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? null;
  const price = meta.regularMarketPrice;
  const change = prevClose != null ? price - prevClose : 0;
  const changePercent =
    meta.regularMarketChangePercent ??
    (prevClose ? (change / prevClose) * 100 : 0);

  return {
    symbol: meta.symbol,
    name: meta.longName ?? meta.shortName ?? null,
    price,
    change,
    changePercent,
    previousClose: prevClose,
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    volume: meta.regularMarketVolume ?? null,
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? null,
    currency: meta.currency ?? null,
    exchange: meta.fullExchangeName ?? meta.exchangeName ?? null,
    marketTime: meta.regularMarketTime ?? null,
  };
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  if (symbols.length === 0) return [];
  const path = `/v7/finance/spark?symbols=${encodeURIComponent(
    symbols.join(","),
  )}&range=1d&interval=1d`;
  const json = await yahooFetch<SparkResponse>(path);
  if (json.spark.error) {
    throw new Error(json.spark.error.description || json.spark.error.code);
  }
  const quotes: Quote[] = [];
  for (const entry of json.spark.result ?? []) {
    const meta = entry.response?.[0]?.meta;
    if (!meta) continue;
    const quote = metaToQuote(meta);
    if (quote) quotes.push(quote);
  }
  return quotes;
}

export async function getHistory(
  symbol: string,
  range: string,
  interval: string,
): Promise<Candle[]> {
  const path = `/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?range=${range}&interval=${interval}`;
  const json = await yahooFetch<ChartResponse>(path);
  if (json.chart.error) {
    throw new Error(json.chart.error.description || json.chart.error.code);
  }
  const data = json.chart.result?.[0];
  if (!data?.timestamp || !data.indicators.quote[0]) return [];

  const { open, high, low, close, volume } = data.indicators.quote[0];
  const candles: Candle[] = [];
  for (let i = 0; i < data.timestamp.length; i++) {
    const o = open[i];
    const h = high[i];
    const l = low[i];
    const c = close[i];
    if (o == null || h == null || l == null || c == null) continue;
    candles.push({
      time: data.timestamp[i],
      open: o,
      high: h,
      low: l,
      close: c,
      volume: volume[i] ?? 0,
    });
  }
  return candles;
}
