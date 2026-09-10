"use client";

import { useEffect, useRef, useState } from "react";

interface JsonState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** Minimal fetch hook with optional polling. Pass url=null to idle. */
export function useJson<T>(url: string | null, refreshMs?: number) {
  const [state, setState] = useState<JsonState<T>>({
    data: null,
    error: null,
    loading: url !== null,
  });
  const dataRef = useRef<T | null>(null);

  useEffect(() => {
    if (!url) {
      dataRef.current = null;
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async (isRefresh: boolean) => {
      if (!isRefresh) {
        setState({ data: dataRef.current, error: null, loading: true });
      }
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `HTTP ${res.status}`,
          );
        }
        dataRef.current = json as T;
        setState({ data: json as T, error: null, loading: false });
      } catch (err) {
        if (cancelled) return;
        setState({
          data: dataRef.current,
          error: err instanceof Error ? err.message : "Request failed",
          loading: false,
        });
      } finally {
        if (!cancelled && refreshMs) {
          timer = setTimeout(() => load(true), refreshMs);
        }
      }
    };

    load(false);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [url, refreshMs]);

  return url ? state : { data: null, error: null, loading: false };
}
