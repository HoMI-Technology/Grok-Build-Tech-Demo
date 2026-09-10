export interface Quote {
  symbol: string;
  name: string | null;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  currency: string | null;
  exchange: string | null;
  marketTime: number | null;
}

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SectorMove {
  symbol: string;
  sector: string;
  changePercent: number;
  price: number;
}

export type Range = "1mo" | "3mo" | "6mo" | "1y" | "2y";
