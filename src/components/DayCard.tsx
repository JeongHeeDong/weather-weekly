"use client";

import type { DailyWeather } from "@/types/weather";
import { getWeatherInfo, getDayOfWeek } from "@/lib/weatherCodes";

interface Props {
  day: DailyWeather;
  index: number;
  isSelected: boolean;
  isCelsius: boolean;
  onClick: () => void;
}

function convert(temp: number, isCelsius: boolean) {
  return isCelsius ? temp : Math.round(temp * 9 / 5 + 32);
}

export function DayCard({ day, index, isSelected, isCelsius, onClick }: Props) {
  const info = getWeatherInfo(day.weatherCode);
  const unit = isCelsius ? "°C" : "°F";

  return (
    <button
      onClick={onClick}
      className={`
        rounded-xl p-3 flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer w-full
        ${isSelected
          ? "ring-2 ring-blue-400 scale-105 shadow-lg"
          : "hover:scale-102 hover:shadow-md"
        }
      `}
      style={{
        background: isSelected ? "rgba(59, 130, 246, 0.15)" : "var(--card-bg)",
        border: isSelected ? "1px solid rgba(96, 165, 250, 0.6)" : "1px solid var(--card-border)",
      }}
    >
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {getDayOfWeek(day.date, index)}
      </span>
      <span className="text-2xl">{info.emoji}</span>
      <span className="text-xs font-bold">{convert(day.tempMax, isCelsius)}{unit}</span>
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {convert(day.tempMin, isCelsius)}{unit}
      </span>
      {day.precipitationProb > 0 && (
        <span className="text-xs text-blue-400">💧{day.precipitationProb}%</span>
      )}
    </button>
  );
}
