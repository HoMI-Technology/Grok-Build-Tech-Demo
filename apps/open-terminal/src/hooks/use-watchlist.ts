"use client";

import { useCallback, useEffect, useState } from "react";

const WATCHLIST_KEY = "open-terminal:watchlist";
const SELECTED_KEY = "open-terminal:selected";

export const DEFAULT_WATCHLIST = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "SPY"];

interface WatchlistState {
  symbols: string[];
  selected: string;
  hydrated: boolean;
}

function loadInitial(): WatchlistState {
  try {
    const rawList = localStorage.getItem(WATCHLIST_KEY);
    const rawSelected = localStorage.getItem(SELECTED_KEY);
    const symbols: string[] = rawList
      ? (JSON.parse(rawList) as string[])
      : DEFAULT_WATCHLIST;
    const selected =
      rawSelected && symbols.includes(rawSelected)
        ? rawSelected
        : (symbols[0] ?? DEFAULT_WATCHLIST[0]);
    return { symbols, selected, hydrated: true };
  } catch {
    return {
      symbols: DEFAULT_WATCHLIST,
      selected: DEFAULT_WATCHLIST[0],
      hydrated: true,
    };
  }
}

export function useWatchlist() {
  const [state, setState] = useState<WatchlistState>({
    symbols: DEFAULT_WATCHLIST,
    selected: DEFAULT_WATCHLIST[0],
    hydrated: false,
  });

  useEffect(() => {
    // One-time hydration from localStorage after mount; localStorage is not
    // available during SSR, so this cannot be a useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadInitial());
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(state.symbols));
    localStorage.setItem(SELECTED_KEY, state.selected);
  }, [state]);

  const addSymbol = useCallback((raw: string) => {
    const symbol = raw.trim().toUpperCase();
    if (!symbol || !/^[A-Z0-9.^=-]{1,12}$/.test(symbol)) return false;
    setState((prev) => {
      if (prev.symbols.includes(symbol)) {
        return { ...prev, selected: symbol };
      }
      return { ...prev, symbols: [...prev.symbols, symbol], selected: symbol };
    });
    return true;
  }, []);

  const removeSymbol = useCallback((symbol: string) => {
    setState((prev) => {
      const symbols = prev.symbols.filter((s) => s !== symbol);
      const selected =
        prev.selected === symbol ? (symbols[0] ?? "") : prev.selected;
      return { ...prev, symbols, selected };
    });
  }, []);

  const selectSymbol = useCallback((symbol: string) => {
    setState((prev) => ({ ...prev, selected: symbol }));
  }, []);

  return {
    symbols: state.symbols,
    selected: state.selected,
    hydrated: state.hydrated,
    addSymbol,
    removeSymbol,
    selectSymbol,
  };
}
