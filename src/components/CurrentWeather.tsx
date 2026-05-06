"use client";

import type { CurrentWeather as ICurrentWeather } from "@/types/weather";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  weather: ICurrentWeather;
  city: string;
  isCelsius: boolean;
}

function convert(temp: number, isCelsius: boolean) {
  return isCelsius ? temp : Math.round(temp * 9 / 5 + 32);
}

export function CurrentWeather({ weather, city, isCelsius }: Props) {
  const { theme } = useTheme();
  const info = getWeatherInfo(weather.weatherCode);
  const unit = isCelsius ? "°C" : "°F";
  const gradientClass = theme === "dark" ? info.darkBg : info.bg;

  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-br ${gradientClass} text-white shadow-xl`}
    >
      <p className="text-sm font-medium opacity-90 mb-1">📍 {city || "현재 위치"}</p>
      <p className="text-sm opacity-75 mb-4">{new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-6xl">{info.emoji}</span>
        <div>
          <p className="text-5xl font-bold">{convert(weather.temp, isCelsius)}{unit}</p>
          <p className="text-sm opacity-90">{info.label}</p>
        </div>
      </div>
      <div className="flex gap-6 text-sm">
        <span>🌡️ 체감 {convert(weather.feelsLike, isCelsius)}{unit}</span>
        <span>💧 습도 {weather.humidity}%</span>
        <span>💨 {weather.windSpeed} m/s</span>
      </div>
    </div>
  );
}
