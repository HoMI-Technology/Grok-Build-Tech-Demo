import { NextRequest, NextResponse } from "next/server";
import { getQuotes } from "@/lib/yahoo";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("symbols") ?? "";
  const symbols = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 30);

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: [] });
  }

  try {
    const quotes = await getQuotes(symbols);
    return NextResponse.json({ quotes });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch quotes" },
      { status: 502 },
    );
  }
}
