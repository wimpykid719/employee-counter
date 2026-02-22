// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "正社員カウンター - 厚生年金データで日本の正社員数を確認";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        background:
          "linear-gradient(135deg, #0a1a1a 0%, #0d2626 50%, #0a1a1a 100%)",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "60px 80px",
        position: "relative",
      }}
    >
      {/* 背景グロー */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(17,212,212,0.18) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "100px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(17,212,212,0.10) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* グリッドライン */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(17,212,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,212,212,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* ヘッダー：アイコン + サービス名 + バッジ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 1,
        }}
      >
        {/* アイコン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "rgba(17,212,212,0.15)",
            border: "1px solid rgba(17,212,212,0.35)",
          }}
        >
          {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#11d4d4"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        <span
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#11d4d4",
            letterSpacing: "0.04em",
          }}
        >
          正社員カウンター
        </span>

        {/* データソースバッジ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(17,212,212,0.08)",
            border: "1px solid rgba(17,212,212,0.3)",
            borderRadius: "999px",
            padding: "6px 18px",
            marginLeft: "8px",
          }}
        >
          <span style={{ fontSize: "15px", color: "#5ee8e8" }}>
            厚生年金 / 年金機構 公表データ
          </span>
        </div>
      </div>

      {/* メインコピー */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* アクセントライン */}
          <div
            style={{
              width: "5px",
              height: "90px",
              borderRadius: "3px",
              background:
                "linear-gradient(180deg, #11d4d4, rgba(17,212,212,0.2))",
              display: "flex",
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              企業の正社員数を
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#11d4d4",
              }}
            >
              正確なデータから確認
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: "22px",
            color: "#6b9e9e",
            margin: 0,
            paddingLeft: "25px",
          }}
        >
          厚生年金の公表データをもとに、日本全体の正社員数を可視化します。
        </p>
      </div>

      {/* フッター */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 1,
          opacity: 0.5,
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#11d4d4",
            display: "flex",
          }}
        />
        <span style={{ fontSize: "18px", color: "#a0c8c8" }}>
          employee-counter-ten.vercel.app
        </span>
      </div>
    </div>,
    { ...size },
  );
}
