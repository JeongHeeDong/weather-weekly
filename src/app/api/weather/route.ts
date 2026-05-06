import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const tz = searchParams.get("tz") ?? "Asia/Seoul";

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat, lon 파라미터가 필요합니다." }, { status: 400 });
  }

  const cacheKey = `weather_${lat}_${lon}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset");
  url.searchParams.set("timezone", tz);
  url.searchParams.set("forecast_days", "7");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("날씨 API 오류");
    const data = await res.json();
    setCached(cacheKey, data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "날씨 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
