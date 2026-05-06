import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "name 파라미터가 필요합니다." }, { status: 400 });
  }

  if (name.length > 100) {
    return NextResponse.json({ error: "도시명은 100자 이하로 입력하세요." }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9가-힣\s\-\.]+$/.test(name)) {
    return NextResponse.json({ error: "유효하지 않은 문자가 포함되어 있습니다." }, { status: 400 });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name.trim());
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("지오코딩 API 오류");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "도시 검색에 실패했습니다." }, { status: 500 });
  }
}
