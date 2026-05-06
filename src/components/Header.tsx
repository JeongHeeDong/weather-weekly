"use client";

import { useTheme } from "@/context/ThemeContext";
import { SearchBar } from "./SearchBar";
import type { SearchResult } from "@/types/weather";

interface Props {
  onCitySelect: (city: SearchResult) => void;
  isCelsius: boolean;
  onUnitToggle: () => void;
}

export function Header({ onCitySelect, isCelsius, onUnitToggle }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 px-4 py-3"
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--card-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-bold mr-auto">🌤 WeatherWeek</h1>
        <SearchBar onSelect={onCitySelect} />
        <button
          onClick={onUnitToggle}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          {isCelsius ? "°C → °F" : "°F → °C"}
        </button>
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl text-sm transition-all hover:scale-105"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          aria-label="테마 전환"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
