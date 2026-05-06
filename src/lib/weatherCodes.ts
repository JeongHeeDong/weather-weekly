interface WeatherInfo {
  emoji: string;
  label: string;
  bg: string;
  darkBg: string;
}

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return { emoji: "☀️", label: "맑음", bg: "from-sky-300 to-blue-400", darkBg: "from-sky-900 to-blue-950" };
  if (code <= 3) return { emoji: "⛅", label: "구름조금", bg: "from-blue-300 to-slate-400", darkBg: "from-blue-900 to-slate-900" };
  if (code <= 48) return { emoji: "🌫️", label: "안개", bg: "from-gray-300 to-slate-400", darkBg: "from-gray-800 to-slate-900" };
  if (code <= 55) return { emoji: "🌦️", label: "이슬비", bg: "from-blue-400 to-indigo-500", darkBg: "from-blue-900 to-indigo-950" };
  if (code <= 65) return { emoji: "🌧️", label: "비", bg: "from-blue-500 to-indigo-600", darkBg: "from-blue-950 to-indigo-950" };
  if (code <= 77) return { emoji: "🌨️", label: "눈", bg: "from-slate-200 to-blue-300", darkBg: "from-slate-800 to-blue-900" };
  if (code <= 82) return { emoji: "🌦️", label: "소나기", bg: "from-blue-400 to-slate-500", darkBg: "from-blue-900 to-slate-900" };
  if (code <= 86) return { emoji: "🌨️", label: "눈소나기", bg: "from-slate-300 to-blue-400", darkBg: "from-slate-800 to-blue-900" };
  if (code <= 99) return { emoji: "⛈️", label: "뇌우", bg: "from-gray-600 to-slate-700", darkBg: "from-gray-900 to-slate-950" };
  return { emoji: "🌤️", label: "보통", bg: "from-sky-300 to-blue-400", darkBg: "from-sky-900 to-blue-950" };
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "낮음", color: "text-green-500" };
  if (uv <= 5) return { label: "보통", color: "text-yellow-500" };
  if (uv <= 7) return { label: "높음", color: "text-orange-500" };
  if (uv <= 10) return { label: "매우높음", color: "text-red-500" };
  return { label: "위험", color: "text-purple-500" };
}

export function getDayOfWeek(dateStr: string, index: number): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const date = new Date(dateStr);
  if (index === 0) return "오늘";
  if (index === 1) return "내일";
  return days[date.getDay()];
}
