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

const POPULAR_CITIES: SearchResult[] = [
  { id: 1835848, name: "서울", country: "KR", admin1: "Seoul",       latitude: 37.5665, longitude: 126.9780, timezone: "Asia/Seoul" },
  { id: 1838519, name: "부산", country: "KR", admin1: "Busan",       latitude: 35.1796, longitude: 129.0756, timezone: "Asia/Seoul" },
  { id: 1835329, name: "대구", country: "KR", admin1: "Daegu",       latitude: 35.8714, longitude: 128.6014, timezone: "Asia/Seoul" },
  { id: 1843564, name: "인천", country: "KR", admin1: "Incheon",     latitude: 37.4563, longitude: 126.7052, timezone: "Asia/Seoul" },
  { id: 1841811, name: "광주", country: "KR", admin1: "Gwangju",     latitude: 35.1595, longitude: 126.8526, timezone: "Asia/Seoul" },
  { id: 1835224, name: "대전", country: "KR", admin1: "Daejeon",     latitude: 36.3504, longitude: 127.3845, timezone: "Asia/Seoul" },
  { id: 1834513, name: "울산", country: "KR", admin1: "Ulsan",       latitude: 35.5384, longitude: 129.3114, timezone: "Asia/Seoul" },
  { id: 1846266, name: "제주", country: "KR", admin1: "Jeju",        latitude: 33.4996, longitude: 126.5312, timezone: "Asia/Seoul" },
  { id: 1835895, name: "수원", country: "KR", admin1: "Gyeonggi-do", latitude: 37.2636, longitude: 127.0286, timezone: "Asia/Seoul" },
  { id: 1838722, name: "강릉", country: "KR", admin1: "Gangwon-do",  latitude: 37.7519, longitude: 128.8761, timezone: "Asia/Seoul" },
  { id: 1836553, name: "전주", country: "KR", admin1: "Jeonbuk",     latitude: 35.8242, longitude: 127.1479, timezone: "Asia/Seoul" },
  { id: 1835235, name: "청주", country: "KR", admin1: "Chungbuk",    latitude: 36.6424, longitude: 127.4890, timezone: "Asia/Seoul" },
];

function getRecent(): SearchResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(city: SearchResult) {
  const prev = getRecent().filter((c) => c.id !== city.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([city, ...prev].slice(0, 5)));
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

  const isSearching = query.trim().length > 0;

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder="🔍 도시 검색..."
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

      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            width: "300px",
          }}
        >
          {isSearching ? (
            results.length > 0 ? (
              <ul>
                {results.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className="px-4 py-2.5 text-sm cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid var(--card-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="ml-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                    </span>
                  </li>
                ))}
              </ul>
            ) : !loading ? (
              <p className="px-4 py-3 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                검색 결과가 없습니다.
              </p>
            ) : null
          ) : (
            <div className="p-3 space-y-3">
              {recent.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 px-1" style={{ color: "var(--text-secondary)" }}>
                    🕐 최근 검색
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--card-border)",
                          color: "var(--foreground)",
                        }}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-medium mb-2 px-1" style={{ color: "var(--text-secondary)" }}>
                  🗺️ 주요 도시
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className="py-1.5 rounded-lg text-xs font-medium text-center transition-all hover:scale-105"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--card-border)",
                        color: "var(--foreground)",
                      }}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
