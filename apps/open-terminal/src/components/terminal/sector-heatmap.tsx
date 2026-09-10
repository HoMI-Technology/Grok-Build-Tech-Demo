"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useJson } from "@/hooks/use-json";
import { formatChangePercent } from "@/lib/format";
import type { SectorMove } from "@/lib/types";

function tileColor(changePercent: number): string {
  // Scale intensity so ±2% is fully saturated.
  const intensity = Math.min(Math.abs(changePercent) / 2, 1);
  const alpha = 0.15 + intensity * 0.65;
  return changePercent >= 0
    ? `rgba(16, 185, 129, ${alpha.toFixed(2)})`
    : `rgba(239, 68, 68, ${alpha.toFixed(2)})`;
}

export function SectorHeatmap() {
  const { data, error, loading } = useJson<{ sectors: SectorMove[] }>(
    "/api/sectors",
    120_000,
  );
  const sectors = [...(data?.sectors ?? [])].sort(
    (a, b) => b.changePercent - a.changePercent,
  );

  if (loading && sectors.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-1 p-3 sm:grid-cols-6 lg:grid-cols-11">
        {Array.from({ length: 11 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (sectors.length === 0) {
    return (
      <p className="p-3 text-xs text-amber-500">
        {error ? `Sector data unavailable: ${error}` : "No sector data."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-1 p-3 sm:grid-cols-6 lg:grid-cols-11">
      {sectors.map((s) => (
        <div
          key={s.symbol}
          className="flex h-14 flex-col justify-between rounded-sm p-1.5"
          style={{ backgroundColor: tileColor(s.changePercent) }}
          title={`${s.sector} (${s.symbol})`}
        >
          <span className="truncate text-[9px] font-medium leading-tight text-foreground/90">
            {s.sector}
          </span>
          <span className="font-mono text-[11px] font-semibold tabular-nums">
            {formatChangePercent(s.changePercent)}
          </span>
        </div>
      ))}
    </div>
  );
}
