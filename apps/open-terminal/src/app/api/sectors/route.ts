import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/yahoo";
import type { SectorMove } from "@/lib/types";

// SPDR sector ETFs as free proxies for S&P 500 sector performance.
const SECTOR_ETFS: Record<string, string> = {
  XLK: "Technology",
  XLF: "Financials",
  XLV: "Health Care",
  XLY: "Cons. Discretionary",
  XLP: "Cons. Staples",
  XLE: "Energy",
  XLI: "Industrials",
  XLB: "Materials",
  XLRE: "Real Estate",
  XLU: "Utilities",
  XLC: "Communication",
};

export async function GET() {
  try {
    const quotes = await getQuotes(Object.keys(SECTOR_ETFS));
    const sectors: SectorMove[] = quotes.map((q) => ({
      symbol: q.symbol,
      sector: SECTOR_ETFS[q.symbol] ?? q.symbol,
      changePercent: q.changePercent,
      price: q.price,
    }));
    return NextResponse.json({ sectors });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch sectors" },
      { status: 502 },
    );
  }
}
