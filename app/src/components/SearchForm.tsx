"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

type NenkinRow = {
  officeName: string;
  address: string;
  houjinNo: string;
  tekiyoKakudai: string;
  genzonZenso: string;
  nenkinOffice: string;
  tekiyoNengappi: string;
  hihokenshaCount: string;
};

const CompanySizeIndicator = ({
  employeeCountStr,
}: {
  employeeCountStr: string;
}) => {
  const employeeCount = parseInt(employeeCountStr, 10);

  const levels = [
    {
      name: "零細企業",
      max: 20,
      description: "従業員20人以下",
      width: "33.3%",
    },
    {
      name: "中小企業",
      max: 300,
      description: "従業員300人以下",
      width: "66.6%",
    },
    {
      name: "大企業",
      max: Infinity,
      description: "従業員301人以上",
      width: "100%",
    },
  ];

  let currentLevel = levels[0];
  if (Number.isNaN(employeeCount)) {
    currentLevel = {
      name: "不明",
      max: 0,
      description: "被保険者数から判定できません",
      width: "0%",
    };
  } else {
    currentLevel =
      levels.find((l) => employeeCount <= l.max) ?? levels[levels.length - 1];
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-surface-muted">企業規模</span>
        <span className="font-bold text-primary">{currentLevel.name}</span>
      </div>
      <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: currentLevel.width }}
        />
      </div>
      <p className="text-surface-muted text-xs text-right">
        {currentLevel.description}
      </p>
    </div>
  );
};

const RegionalContext = ({ address }: { address?: string }) => {
  const mapEmbedUrl = address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : "";

  const mapLink = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : undefined;

  const Wrapper = mapLink ? "a" : "div";

  return (
    <Wrapper
      href={mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="
        lg:col-span-3
        bg-surface
        rounded-2xl
        border border-border
        h-48
        relative
        overflow-hidden
        group
        block
        cursor-pointer
        transition-all duration-300
        hover:scale-[1.02]
        hover:shadow-xl
      "
    >
      {mapEmbedUrl && (
        <iframe
          src={mapEmbedUrl}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            filter: "grayscale(50%)",
            opacity: 0.4,
            pointerEvents: "none",
            transition: "all 300ms",
          }}
          className="group-hover:grayscale-0 group-hover:opacity-70"
          loading="lazy"
          title="map"
        />
      )}

      <div
        className="
          absolute inset-0
          bg-linear-to-t
          from-surface
          via-surface/80
          to-transparent
          transition-opacity duration-300
          group-hover:opacity-40
        "
      />

      <div className="absolute bottom-0 left-0 p-6 z-10">
        <p className="text-foreground font-bold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">map</span>
          地域情報
        </p>

        <p className="text-surface-muted text-sm max-w-xl">
          {address
            ? `${address} に所在。日本年金機構の公表情報に基づきます。`
            : "日本年金機構の公表情報に基づいています。"}
        </p>
      </div>
    </Wrapper>
  );
};

type Result = {
  hitCount: number;
  rows: NenkinRow[];
};

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [enterPressCount, setEnterPressCount] = useState(0);
  const [corporateNumber, setCorporateNumber] = useState("");
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/ga/recent")
      .then((res) => res.json())
      .then((data) => {
        if (data.queries) {
          setRecentQueries(data.queries);
        }
      })
      .catch((err) => console.error("Failed to fetch recent queries:", err));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!initialSearchDone) {
      const urlQuery = searchParams.get("q");
      if (urlQuery) {
        setQuery(urlQuery);
        // Trigger search directly
        search(urlQuery);
      }
      setInitialSearchDone(true);
    }
  }, [searchParams, initialSearchDone]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEnterPressCount((prev) => prev + 1);
      if (enterPressCount + 1 >= 2) {
        search();
        setEnterPressCount(0);
      }
    } else {
      setEnterPressCount(0);
    }
  };

  const houjinNoSerch = async () => {
    const houjinNo = corporateNumber.trim();
    if (!houjinNo) {
      setError("法人番号を入力してください");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const searchRes = await fetch("/api/nenkin/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houjinNo }),
      });
      const searchData = await searchRes.json();
      if (!searchRes.ok) {
        setError(searchData.error ?? "年金データの検索に失敗しました");
        return;
      }
      setResult({ hitCount: searchData.hitCount, rows: searchData.rows });
      const companyName = searchData.rows[0]?.officeName ?? "";
      setQuery(companyName);
      router.push(`/?q=${encodeURIComponent(companyName)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const search = async (initialQuery?: string) => {
    const name = (initialQuery ?? query).trim();
    if (!name) {
      setError("会社名を入力してください");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const numRes = await fetch(
        `/api/company/number?q=${encodeURIComponent(name)}`,
      );
      const numData = await numRes.json();
      if (!numRes.ok) {
        setError(numData.error ?? "法人番号の取得に失敗しました");
        return;
      }
      const houjinNo = numData.number;
      setCorporateNumber(houjinNo);
      const searchRes = await fetch("/api/nenkin/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houjinNo }),
      });
      const searchData = await searchRes.json();
      if (!searchRes.ok) {
        setError(searchData.error ?? "年金データの検索に失敗しました");
        return;
      }
      setResult({ hitCount: searchData.hitCount, rows: searchData.rows });
      // Update URL after successful search
      router.push(`/?q=${encodeURIComponent(name)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full max-w-[1200px] mx-auto">
      {/* Search Section - sample.html と同じ構成 */}
      <section className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            正社員カウンター
          </h1>
          <p className="text-surface-muted text-lg font-light">
            会社名から厚生年金の被保険者数（正社員規模の目安）を公表情報から取得します。
          </p>
        </div>
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-surface border border-border rounded-full p-2 shadow-2xl shadow-black/10 dark:shadow-black/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
            <span
              className="material-symbols-outlined text-surface-muted ml-4"
              aria-hidden
            >
              search
            </span>
            <input
              className="flex-1 bg-transparent border-none text-foreground placeholder:text-surface-muted focus:ring-0 focus:outline-none text-base px-4 h-12 min-w-0"
              placeholder="会社名で検索（例：トヨタ自動車株式会社）"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => search()}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-[#102222] font-bold rounded-full px-8 h-12 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="inline-block size-4 border-2 border-[#102222]/30 border-t-[#102222] rounded-full animate-spin" />
                  <span>検索中</span>
                </>
              ) : (
                <>
                  <span>検索</span>
                  <span className="material-symbols-outlined text-sm font-bold">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {recentQueries.length > 0 && (
          <div className="w-full max-w-2xl flex flex-wrap justify-center gap-2 mt-2">
            <span className="text-xs text-surface-muted w-full mb-1">
              最近検索された企業:
            </span>
            {recentQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  search(q);
                }}
                className="text-xs bg-surface border border-border hover:border-primary/50 hover:text-primary px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4">
          {error}
        </div>
      )}

      {result && (
        <section className="w-full space-y-6">
          <div className="items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">検索結果</h2>
            <p className="text-surface-muted text-sm mt-2">
              上手く検索結果が表示されない場合は法人番号を編集してみて下さい。
            </p>
          </div>

          {result.rows.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-8 text-center text-surface-muted">
              該当するデータはありませんでした。
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {result.rows.map((row, i) => (
                <Fragment key={`${row.houjinNo}-${i}`}>
                  {/* Main Details Card - sample.html の lg:col-span-2 と同じ */}
                  <div className="lg:col-span-2 bg-surface rounded-2xl p-6 md:p-8 border border-border shadow-xl flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
                            {row.genzonZenso || "稼働状況"}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                          {row.officeName || "—"}
                        </h3>
                        <p className="text-surface-muted flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">
                            numbers
                          </span>
                          法人番号:{" "}
                          <input
                            type="text"
                            value={corporateNumber}
                            onChange={(e) => {
                              setCorporateNumber(e.target.value);
                            }}
                            onBlur={() => {
                              if (corporateNumber.trim() !== "") {
                                houjinNoSerch();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (corporateNumber.trim() !== "") {
                                  houjinNoSerch();
                                }
                                e.currentTarget.blur(); // Remove focus after search
                              }
                            }}
                            className="bg-surface border border-border rounded-md focus:border-primary focus:outline-none text-foreground text-sm px-2 py-1"
                          />
                        </p>
                      </div>
                    </div>
                    <div className="h-px w-full bg-border" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative z-10">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          所在地
                        </span>
                        <div className="text-foreground font-medium flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary mt-0.5 text-[20px]">
                            location_on
                          </span>
                          <span>
                            {row.address || "—"}
                            <br />
                            <span className="text-sm text-surface-muted">
                              日本
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          年金事務所
                        </span>
                        <div className="text-foreground font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            account_balance
                          </span>
                          {row.nenkinOffice || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          適用年月日
                        </span>
                        <div className="text-foreground font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            calendar_today
                          </span>
                          {row.tekiyoNengappi || "—"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          被保険者数
                        </span>
                        <div className="text-foreground font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            group
                          </span>
                          {row.hihokenshaCount || "—"}{" "}
                          <span className="text-surface-muted text-sm font-normal">
                            （公表値）
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimation Highlight Card - sample.html の lg:col-span-1 と同じ */}
                  <div
                    key={`highlight-${row.houjinNo}-${i}`}
                    className="lg:col-span-1 bg-surface rounded-2xl p-6 md:p-8 border border-border shadow-xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(var(--color-primary) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    <div className="relative z-10 p-3 mb-2 bg-primary/10 text-primary text-xs font-bold px-3 rounded-full border border-primary/20 uppercase tracking-wider w-14 h-14">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        groups
                      </span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-surface-muted text-sm font-medium uppercase tracking-wider mb-2">
                        推定正社員数
                      </p>
                      <h2 className="text-6xl font-black text-primary tracking-tighter drop-shadow-lg">
                        {row.hihokenshaCount || "—"}
                      </h2>
                      <p className="text-surface-muted text-sm mt-2">人</p>
                    </div>
                    <div className="relative z-10 w-full mt-4 pt-4 border-t border-border">
                      <CompanySizeIndicator
                        employeeCountStr={row.hihokenshaCount}
                      />
                    </div>{" "}
                  </div>
                </Fragment>
              ))}

              <RegionalContext address={result.rows[0]?.address} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
