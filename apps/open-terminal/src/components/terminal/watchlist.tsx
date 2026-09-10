"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useJson } from "@/hooks/use-json";
import {
  changeColorClass,
  formatChangePercent,
  formatPrice,
} from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WatchlistProps {
  symbols: string[];
  selected: string;
  onSelect: (symbol: string) => void;
  onAdd: (symbol: string) => boolean;
  onRemove: (symbol: string) => void;
}

export function Watchlist({
  symbols,
  selected,
  onSelect,
  onAdd,
  onRemove,
}: WatchlistProps) {
  const [input, setInput] = useState("");
  const url =
    symbols.length > 0
      ? `/api/quotes?symbols=${encodeURIComponent(symbols.join(","))}`
      : null;
  const { data, error, loading } = useJson<{ quotes: Quote[] }>(url, 60_000);
  const quotesBySymbol = new Map(
    (data?.quotes ?? []).map((q) => [q.symbol, q]),
  );

  const submit = () => {
    if (onAdd(input)) setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <form
        className="flex gap-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add ticker (e.g. GOOGL)"
          className="h-8 font-mono text-xs uppercase"
          aria-label="Add ticker"
        />
        <Button type="submit" size="sm" variant="secondary" className="h-8 px-2">
          <Plus className="size-4" />
        </Button>
      </form>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-px px-2 pb-2">
          {symbols.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              Watchlist is empty. Add a ticker above.
            </p>
          )}
          {symbols.map((symbol) => {
            const quote = quotesBySymbol.get(symbol);
            const isSelected = symbol === selected;
            return (
              <div
                key={symbol}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(symbol)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(symbol)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                  isSelected ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <div className="flex min-w-0 flex-col">
                  <span className="font-mono text-xs font-semibold">
                    {symbol}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {quote?.name ?? (loading ? "…" : "—")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex flex-col items-end">
                    {quote ? (
                      <>
                        <span className="font-mono text-xs tabular-nums">
                          {formatPrice(quote.price)}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] tabular-nums",
                            changeColorClass(quote.changePercent),
                          )}
                        >
                          {formatChangePercent(quote.changePercent)}
                        </span>
                      </>
                    ) : loading ? (
                      <Skeleton className="h-7 w-12" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        no data
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${symbol}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(symbol);
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {error && (
        <p className="border-t px-3 py-2 text-[10px] text-amber-500">
          Quotes unavailable: {error}
        </p>
      )}
    </div>
  );
}
