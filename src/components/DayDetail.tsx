import type { DailyWeather } from "@/types/weather";
import { getWeatherInfo, getUVLabel, getDayOfWeek } from "@/lib/weatherCodes";

interface Props {
  day: DailyWeather;
  index: number;
  isCelsius: boolean;
}

function convert(temp: number, isCelsius: boolean) {
  return isCelsius ? temp : Math.round(temp * 9 / 5 + 32);
}

export function DayDetail({ day, index, isCelsius }: Props) {
  const info = getWeatherInfo(day.weatherCode);
  const uv = getUVLabel(day.uvIndex);
  const unit = isCelsius ? "°C" : "°F";

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
      <h3 className="text-lg font-semibold mb-4">
        {getDayOfWeek(day.date, index)} 상세 — {day.date}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>날씨</span>
          <span className="text-base font-medium">{info.emoji} {info.label}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>최고/최저</span>
          <span className="text-base font-medium">
            {convert(day.tempMax, isCelsius)}{unit} / {convert(day.tempMin, isCelsius)}{unit}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>강수확률</span>
          <span className="text-base font-medium">💧 {day.precipitationProb}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>풍속</span>
          <span className="text-base font-medium">💨 {day.windSpeed} m/s</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>자외선 지수</span>
          <span className={`text-base font-medium ${uv.color}`}>☀️ {day.uvIndex.toFixed(1)} ({uv.label})</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>일출</span>
          <span className="text-base font-medium">🌅 {day.sunrise}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>일몰</span>
          <span className="text-base font-medium">🌇 {day.sunset}</span>
        </div>
      </div>
    </div>
  );
}
