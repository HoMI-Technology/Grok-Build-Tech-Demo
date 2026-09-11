"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  LineSeries,
  type UTCTimestamp,
} from "lightweight-charts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useJson } from "@/hooks/use-json";
import { computeBollinger, computeRSI } from "@/lib/indicators";
import type { Candle, Range } from "@/lib/types";
import { cn } from "@/lib/utils";

const RANGES: Range[] = ["1mo", "3mo", "6mo", "1y", "2y"];

const UP = "#10b981";
const DOWN = "#ef4444";

interface PriceChartProps {
  symbol: string;
}

export function PriceChart({ symbol }: PriceChartProps) {
  const [range, setRange] = useState<Range>("6mo");
  const [showBollinger, setShowBollinger] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const url = symbol
    ? `/api/history/${encodeURIComponent(symbol)}?range=${range}`
    : null;
  const { data, error, loading } = useJson<{ candles: Candle[] }>(url);
  const candles = useMemo(() => data?.candles ?? [], [data]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || candles.length === 0) return;

    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71717a",
        fontSize: 11,
        panes: { separatorColor: "#27272a", enableResize: false },
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(63,63,70,0.35)" },
        horzLines: { color: "rgba(63,63,70,0.35)" },
      },
      rightPriceScale: { borderColor: "#3f3f46" },
      timeScale: { borderColor: "#3f3f46" },
      crosshair: { mode: 0 },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
    });
    candleSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color:
          c.close >= c.open ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)",
      })),
    );

    if (showBollinger) {
      const bands = computeBollinger(candles);
      const bandOptions = {
        lineWidth: 1 as const,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      };
      const upper = chart.addSeries(LineSeries, {
        ...bandOptions,
        color: "rgba(96,165,250,0.7)",
      });
      const middle = chart.addSeries(LineSeries, {
        ...bandOptions,
        color: "rgba(96,165,250,0.35)",
        lineStyle: 2,
      });
      const lower = chart.addSeries(LineSeries, {
        ...bandOptions,
        color: "rgba(96,165,250,0.7)",
      });
      upper.setData(
        bands.map((b) => ({ time: b.time as UTCTimestamp, value: b.upper })),
      );
      middle.setData(
        bands.map((b) => ({ time: b.time as UTCTimestamp, value: b.middle })),
      );
      lower.setData(
        bands.map((b) => ({ time: b.time as UTCTimestamp, value: b.lower })),
      );
    }

    if (showRSI) {
      const rsi = computeRSI(candles);
      const rsiSeries = chart.addSeries(
        LineSeries,
        {
          color: "#a78bfa",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: true,
        },
        1,
      );
      rsiSeries.setData(
        rsi.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })),
      );
      rsiSeries.createPriceLine({
        price: 70,
        color: "rgba(239,68,68,0.5)",
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: false,
        title: "",
      });
      rsiSeries.createPriceLine({
        price: 30,
        color: "rgba(16,185,129,0.5)",
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: false,
        title: "",
      });
      const panes = chart.panes();
      if (panes.length > 1) panes[1].setHeight(110);
    }

    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [candles, showBollinger, showRSI]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">{symbol || "—"}</span>
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList className="h-7">
              {RANGES.map((r) => (
                <TabsTrigger key={r} value={r} className="h-5 px-2 text-[11px]">
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={showBollinger ? "secondary" : "ghost"}
            className={cn("h-6 px-2 text-[11px]", showBollinger && "text-blue-400")}
            onClick={() => setShowBollinger((v) => !v)}
          >
            BB(20,2)
          </Button>
          <Button
            size="sm"
            variant={showRSI ? "secondary" : "ghost"}
            className={cn("h-6 px-2 text-[11px]", showRSI && "text-violet-400")}
            onClick={() => setShowRSI((v) => !v)}
          >
            RSI(14)
          </Button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 p-1">
        {loading && candles.length === 0 ? (
          <Skeleton className="size-full" />
        ) : error && candles.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-amber-500">Chart unavailable: {error}</p>
          </div>
        ) : candles.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-muted-foreground">
              No price history for {symbol || "this symbol"}.
            </p>
          </div>
        ) : (
          <div ref={containerRef} className="size-full" />
        )}
      </div>
    </div>
  );
}
