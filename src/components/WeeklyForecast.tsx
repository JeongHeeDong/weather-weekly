"use client";

import { useState } from "react";
import type { DailyWeather } from "@/types/weather";
import { DayCard } from "./DayCard";
import { DayDetail } from "./DayDetail";

interface Props {
  daily: DailyWeather[];
  isCelsius: boolean;
}

export function WeeklyForecast({ daily, isCelsius }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">7일 예보</h2>
      <div className="grid grid-cols-7 gap-2">
        {daily.map((day, i) => (
          <DayCard
            key={day.date}
            day={day}
            index={i}
            isSelected={selected === i}
            isCelsius={isCelsius}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
      <DayDetail day={daily[selected]} index={selected} isCelsius={isCelsius} />
    </section>
  );
}
