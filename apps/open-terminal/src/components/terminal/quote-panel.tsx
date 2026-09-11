"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useJson } from "@/hooks/use-json";
import {
  changeColorClass,
  formatChange,
  formatChangePercent,
  formatPrice,
  formatVolume,
} from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-xs tabular-nums">{value}</span>
    </div>
  );
}

export function QuotePanel({ symbol }: { symbol: string }) {
  const url = symbol
    ? `/api/quotes?symbols=${encodeURIComponent(symbol)}`
    : null;
  const { data, error, loading } = useJson<{ quotes: Quote[] }>(url, 60_000);
  const quote = data?.quotes.find((q) => q.symbol === symbol) ?? null;

  if (!symbol) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Select a symbol from the watchlist.
      </p>
    );
  }

  if (loading && !quote) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-4">
        <p className="font-mono text-sm font-semibold">{symbol}</p>
        <p className="mt-1 text-xs text-amber-500">
          {error ? `Quote unavailable: ${error}` : "No quote data for this symbol."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-lg font-bold">{quote.symbol}</h2>
            {quote.exchange && (
              <Badge variant="outline" className="text-[10px]">
                {quote.exchange}
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {quote.name ?? "—"}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="font-mono text-2xl font-bold tabular-nums">
            {formatPrice(quote.price)}
          </span>
          <span
            className={cn(
              "font-mono text-sm tabular-nums",
              changeColorClass(quote.changePercent),
            )}
          >
            {formatChange(quote.change)} ({formatChangePercent(quote.changePercent)})
          </span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Stat label="Prev close" value={formatPrice(quote.previousClose)} />
        <Stat label="Day high" value={formatPrice(quote.dayHigh)} />
        <Stat label="Day low" value={formatPrice(quote.dayLow)} />
        <Stat label="Volume" value={formatVolume(quote.volume)} />
        <Stat label="52w high" value={formatPrice(quote.fiftyTwoWeekHigh)} />
        <Stat label="52w low" value={formatPrice(quote.fiftyTwoWeekLow)} />
      </div>
    </div>
  );
}
