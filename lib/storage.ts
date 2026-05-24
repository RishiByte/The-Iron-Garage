"use client";

import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setValue(item ? (JSON.parse(item) as T) : initialRef.current);
    } catch {
      setValue(initialRef.current);
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (ready) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage can fail in private browsing or quota-limited contexts.
      }
    }
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}
