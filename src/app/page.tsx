"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { CurrentWeather } from "@/components/CurrentWeather";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { SearchResult } from "@/types/weather";

const DEFAULT_CITY: SearchResult = {
  id: -1,
  name: "서울",
  country: "KR",
  admin1: "",
  latitude: 37.5665,
  longitude: 126.978,
  timezone: "Asia/Seoul",
};

export default function HomePage() {
  const geo = useGeolocation();
  const [isCelsius, setIsCelsius] = useState(true);
  const [selectedCity, setSelectedCity] = useState<SearchResult | null>(null);

  const activeLat = selectedCity?.latitude ?? geo.latitude ?? DEFAULT_CITY.latitude;
  const activeLon = selectedCity?.longitude ?? geo.longitude ?? DEFAULT_CITY.longitude;
  const activeTz = selectedCity?.timezone ?? DEFAULT_CITY.timezone;
  const activeCity = selectedCity?.name ?? (geo.latitude ? "현재 위치" : DEFAULT_CITY.name);

  const { data, isLoading, isError, refetch } = useWeather(activeLat, activeLon, activeTz);

  const handleCitySelect = (city: SearchResult) => {
    setSelectedCity(city);
  };

  const handleCurrentLocation = () => {
    setSelectedCity(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header
        onCitySelect={handleCitySelect}
        onCurrentLocation={handleCurrentLocation}
        activeCity={activeCity}
        isCelsius={isCelsius}
        onUnitToggle={() => setIsCelsius((p) => !p)}
      />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {isLoading && <SkeletonLoader />}
        {isError && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
            <p className="text-lg mb-4">⚠️ 날씨 데이터를 불러오지 못했습니다.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}
        {data && !isLoading && (
          <>
            <CurrentWeather
              weather={data.current}
              city={activeCity}
              isCelsius={isCelsius}
            />
            <WeeklyForecast daily={data.daily} isCelsius={isCelsius} />
          </>
        )}
      </main>
    </div>
  );
}
