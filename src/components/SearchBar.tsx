"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SearchResult } from "@/types/weather";
import { searchCities } from "@/hooks/useWeather";

interface Props {
  onSelect: (result: SearchResult) => void;
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const STORAGE_KEY = "weather_recent_cities";

function getRecent(): SearchResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(city: SearchResult) {
  const prev = getRecent().filter((c) => c.id !== city.id);
  const next = [city, ...prev].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(getRecent());
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const doSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) { setResults([]); setLoading(false); return; }
      try {
        const data = await searchCities(q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (val.trim()) {
      setLoading(true);
      doSearch(val);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const handleSelect = (city: SearchResult) => {
    saveRecent(city);
    setRecent(getRecent());
    setQuery("");
    setOpen(false);
    setResults([]);
    onSelect(city);
  };

  const displayList = query.trim() ? results : recent;

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder="도시 검색..."
        className="w-full px-4 py-2 rounded-xl text-sm outline-none transition-all"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--foreground)",
        }}
      />
      {loading && (
        <span className="absolute right-3 top-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
          검색중...
        </span>
      )}
      {open && displayList.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          {!query.trim() && recent.length > 0 && (
            <li className="px-4 py-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              최근 검색
            </li>
          )}
          {displayList.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              <span className="font-medium">{city.name}</span>
              <span className="ml-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
