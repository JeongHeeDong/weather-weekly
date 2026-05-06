import { useQuery } from "@tanstack/react-query";
import type { WeatherData, SearchResult } from "@/types/weather";

async function fetchWeather(lat: number, lon: number, tz: string): Promise<WeatherData> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&tz=${encodeURIComponent(tz)}`);
  if (!res.ok) throw new Error("날씨 데이터를 가져오지 못했습니다.");
  const raw = await res.json();

  return {
    current: {
      temp: Math.round(raw.current.temperature_2m),
      feelsLike: Math.round(raw.current.apparent_temperature),
      humidity: raw.current.relative_humidity_2m,
      weatherCode: raw.current.weather_code,
      windSpeed: raw.current.wind_speed_10m,
    },
    daily: raw.daily.time.map((date: string, i: number) => ({
      date,
      weatherCode: raw.daily.weather_code[i],
      tempMax: Math.round(raw.daily.temperature_2m_max[i]),
      tempMin: Math.round(raw.daily.temperature_2m_min[i]),
      precipitationProb: raw.daily.precipitation_probability_max[i] ?? 0,
      windSpeed: raw.daily.wind_speed_10m_max[i],
      uvIndex: raw.daily.uv_index_max[i] ?? 0,
      sunrise: raw.daily.sunrise[i]?.split("T")[1]?.slice(0, 5) ?? "--:--",
      sunset: raw.daily.sunset[i]?.split("T")[1]?.slice(0, 5) ?? "--:--",
    })),
    location: { latitude: lat, longitude: lon, city: "", country: "", timezone: tz },
  };
}

export function useWeather(lat: number | null, lon: number | null, tz = "Asia/Seoul") {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!, tz),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
  });
}

export async function searchCities(name: string): Promise<SearchResult[]> {
  const res = await fetch(`/api/geocoding?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("도시 검색 실패");
  const data = await res.json();
  return data.results ?? [];
}
