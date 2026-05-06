import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

const VALID_TIMEZONES = new Set([
  "Africa/Abidjan","Africa/Lagos","Africa/Nairobi","Africa/Cairo","America/New_York",
  "America/Chicago","America/Denver","America/Los_Angeles","America/Sao_Paulo",
  "America/Toronto","Asia/Dubai","Asia/Hong_Kong","Asia/Jakarta","Asia/Kolkata",
  "Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Tokyo","Asia/Bangkok",
  "Australia/Sydney","Europe/Amsterdam","Europe/Berlin","Europe/London",
  "Europe/Moscow","Europe/Paris","Pacific/Auckland","Pacific/Honolulu","UTC",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const latRaw = searchParams.get("lat");
  const lonRaw = searchParams.get("lon");
  const tz = searchParams.get("tz") ?? "Asia/Seoul";

  if (!latRaw || !lonRaw) {
    return NextResponse.json({ error: "lat, lon 파라미터가 필요합니다." }, { status: 400 });
  }

  const lat = parseFloat(latRaw);
  const lon = parseFloat(lonRaw);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "유효하지 않은 좌표입니다." }, { status: 400 });
  }

  if (!VALID_TIMEZONES.has(tz)) {
    return NextResponse.json({ error: "지원하지 않는 타임존입니다." }, { status: 400 });
  }

  const cacheKey = `weather_${lat.toFixed(4)}_${lon.toFixed(4)}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset");
  url.searchParams.set("timezone", tz);
  url.searchParams.set("forecast_days", "7");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 600 },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("날씨 API 오류");
    const data = await res.json();
    setCached(cacheKey, data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "날씨 데이터를 가져오지 못했습니다." }, { status: 500 });
  }
}
