import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/lib/yahoo";

const RANGE_TO_INTERVAL: Record<string, string> = {
  "1mo": "1d",
  "3mo": "1d",
  "6mo": "1d",
  "1y": "1d",
  "2y": "1wk",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;
  const range = req.nextUrl.searchParams.get("range") ?? "6mo";
  const interval = RANGE_TO_INTERVAL[range];

  if (!interval) {
    return NextResponse.json(
      { error: `Unsupported range "${range}"` },
      { status: 400 },
    );
  }

  try {
    const candles = await getHistory(symbol.toUpperCase(), range, interval);
    return NextResponse.json({ candles });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch history" },
      { status: 502 },
    );
  }
}
