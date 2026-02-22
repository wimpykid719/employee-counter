import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCEL_API_BASE = "https://api.excelapi.org/company/number";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("q");
  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "会社名を指定してください" },
      { status: 400 },
    );
  }
  console.log("検索対象の会社名: ", name);

  try {
    const url = `${EXCEL_API_BASE}?name=${encodeURIComponent(name.trim())}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "法人番号の取得に失敗しました", detail: text },
        { status: 502 },
      );
    }

    const data = await res.json();

    // レスポンスが配列の場合（複数ヒット）は先頭の法人番号を使用
    const number =
      Array.isArray(data) && data.length > 0
        ? (data[0].number ?? data[0].法人番号 ?? data[0])
        : typeof data === "object"
          ? (data.number ?? data.法人番号 ?? data.houjinNo)
          : String(data);

    if (number == null || number === "") {
      return NextResponse.json(
        { error: "該当する法人番号が見つかりませんでした" },
        { status: 404 },
      );
    }

    return NextResponse.json({ number: String(number).trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "法人番号の取得に失敗しました", detail: message },
      { status: 502 },
    );
  }
}
