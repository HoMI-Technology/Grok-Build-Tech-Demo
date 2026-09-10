"use client";

import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWatchlist } from "@/hooks/use-watchlist";
import { PriceChart } from "./price-chart";
import { QuotePanel } from "./quote-panel";
import { SectorHeatmap } from "./sector-heatmap";
import { Watchlist } from "./watchlist";

export function Terminal() {
  const { symbols, selected, hydrated, addSymbol, removeSymbol, selectSymbol } =
    useWatchlist();

  return (
    <main className="flex min-h-dvh flex-col gap-2 bg-background p-2 text-foreground">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-emerald-500" />
          <h1 className="font-mono text-sm font-bold tracking-tight">
            OpenTerminal
          </h1>
          <span className="text-[10px] text-muted-foreground">
            mini trading terminal · free public data · 15-min+ delayed
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          data: Yahoo Finance (unofficial)
        </span>
      </header>

      {hydrated && (
        <div className="grid flex-1 grid-cols-1 gap-2 lg:grid-cols-[280px_1fr]">
          <Card className="min-h-[300px] gap-0 overflow-hidden p-0 lg:min-h-0">
            <div className="border-b px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Watchlist
            </div>
            <Watchlist
              symbols={symbols}
              selected={selected}
              onSelect={selectSymbol}
              onAdd={addSymbol}
              onRemove={removeSymbol}
            />
          </Card>

          <div className="flex min-h-0 flex-col gap-2">
            <Card className="gap-0 overflow-hidden p-0">
              <QuotePanel symbol={selected} />
            </Card>

            <Card className="min-h-[420px] flex-1 gap-0 overflow-hidden p-0">
              <PriceChart symbol={selected} />
            </Card>

            <Card className="gap-0 overflow-hidden p-0">
              <div className="border-b px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                S&P 500 sectors — today
              </div>
              <SectorHeatmap />
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
