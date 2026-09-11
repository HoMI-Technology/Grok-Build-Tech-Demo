import type { Candle } from "./types";

export interface LinePoint {
  time: number;
  value: number;
}

export interface BollingerPoint {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}

/** Wilder-smoothed RSI. Returns points starting at index `period`. */
export function computeRSI(candles: Candle[], period = 14): LinePoint[] {
  if (candles.length <= period) return [];

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;

  const out: LinePoint[] = [];
  const rsiValue = () =>
    avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  out.push({ time: candles[period].time, value: rsiValue() });
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    out.push({ time: candles[i].time, value: rsiValue() });
  }
  return out;
}

/** Simple-moving-average Bollinger Bands (period, k standard deviations). */
export function computeBollinger(
  candles: Candle[],
  period = 20,
  k = 2,
): BollingerPoint[] {
  if (candles.length < period) return [];

  const out: BollingerPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    const mean = sum / period;

    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      variance += (candles[j].close - mean) ** 2;
    }
    const sd = Math.sqrt(variance / period);

    out.push({
      time: candles[i].time,
      upper: mean + k * sd,
      middle: mean,
      lower: mean - k * sd,
    });
  }
  return out;
}
