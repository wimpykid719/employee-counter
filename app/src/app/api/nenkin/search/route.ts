import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseNenkinSearchHtml } from "@/lib/nenkin-parser";

const NENKIN_SEARCH_URL = "https://www2.nenkin.go.jp/do/search_section";

const DEFAULT_FORM_BODY =
  "hdnPrefectureCode=&hdnSearchOffice=1&hdnSearchCriteria=3&txtOfficeName=&txtOfficeAddress=&txtHoujinNo=HOUJIN_NO_PLACEHOLDER&hdnDisplayItemsRestorationScreenDto=&hdnDisplayItemsRestorationScreenDtoKeepParam=false&gmnId=GB10001SC010&hdnErrorFlg=&eventId=%2FSEARCH.HTML&%2Fsearch.html=";

export async function POST(request: NextRequest) {
  let body: { houjinNo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディが不正です" },
      { status: 400 },
    );
  }

  const houjinNo = body.houjinNo?.trim();
  if (!houjinNo) {
    return NextResponse.json(
      { error: "法人番号を指定してください" },
      { status: 400 },
    );
  }

  const formBody = DEFAULT_FORM_BODY.replace("HOUJIN_NO_PLACEHOLDER", houjinNo);

  try {
    const res = await fetch(NENKIN_SEARCH_URL, {
      method: "POST",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        "Cache-Control": "max-age=0",
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://www2.nenkin.go.jp",
        Referer: "https://www2.nenkin.go.jp/do/search_section/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: formBody,
      signal: AbortSignal.timeout(20000),
    });

    const html = await res.text();
    // console.log("レスポンス", html);
    const result = parseNenkinSearchHtml(html);
    console.log("抽出後", result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "年金機構の検索に失敗しました", detail: message },
      { status: 502 },
    );
  }
}
