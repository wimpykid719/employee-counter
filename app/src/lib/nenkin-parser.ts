import { parse } from "node-html-parser";

/**
 * 年金機構検索結果HTMLからテーブル行を抽出する
 * サンプルHTMLの構造: .return_Boxcont table.form_table tr → td (事業所名称, 所在地, 法人番号, 適用拡大, 現存/全喪, 年金事務所, 適用年月日, 被保険者数)
 */
export interface NenkinRow {
  officeName: string;
  address: string;
  houjinNo: string;
  tekiyoKakudai: string;
  genzonZenso: string;
  nenkinOffice: string;
  tekiyoNengappi: string;
  hihokenshaCount: string;
}

export interface NenkinResult {
  hitCount: number;
  rows: NenkinRow[];
}

function getTextFromNode(node: { text: string; innerHTML?: string }): string {
  // .text はタグを除いたテキスト（<br> は改行になるため空白に正規化）
  return (node.text ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * HTML文字列から .return_Boxcont 内の .form_table を node-html-parser で解析して NenkinResult を返す
 */
export function parseNenkinSearchHtml(html: string): NenkinResult {
  const rows: NenkinRow[] = [];
  let hitCount = 0;

  const root = parse(html);

  // 「N件が該当しました」または「該当するデータはありません」を .fcont_hit 内の p から取得
  const fcontHit = root.querySelector(".fcont_hit p");
  if (fcontHit) {
    const hitText = fcontHit.text.trim().replace(/\s+/g, " ");
    if (/該当するデータはありません/.test(hitText)) {
      hitCount = 0;
    } else {
      const hitMatch = hitText.match(/(\d+)\s*件\s*が\s*該当\s*しました/);
      if (hitMatch) {
        hitCount = parseInt(hitMatch[1] ?? "0", 10) || 0;
      }
    }
  }

  // .return_Boxcont 内の table.form_table を取得（検索結果テーブル）
  const resultTable = root.querySelector(".return_Boxcont table.form_table");
  if (!resultTable) {
    return { hitCount, rows };
  }

  const trList = resultTable.querySelectorAll("tr");
  for (const tr of trList) {
    // ヘッダー行（th を含む）はスキップ
    const th = tr.querySelector("th");
    if (th) continue;

    const tds = tr.querySelectorAll("td");
    if (tds.length >= 8) {
      rows.push({
        officeName: getTextFromNode(tds[0]),
        address: getTextFromNode(tds[1]),
        houjinNo: getTextFromNode(tds[2]),
        tekiyoKakudai: getTextFromNode(tds[3]),
        genzonZenso: getTextFromNode(tds[4]),
        nenkinOffice: getTextFromNode(tds[5]),
        tekiyoNengappi: getTextFromNode(tds[6]),
        hihokenshaCount: getTextFromNode(tds[7]),
      });
    }
  }

  return { hitCount, rows };
}
