"use client";

import { Fragment, useState } from "react";

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

type Result = {
  hitCount: number;
  rows: NenkinRow[];
};

export function SearchForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const search = async () => {
    const name = query.trim();
    if (!name) {
      setError("会社名を入力してください");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const numRes = await fetch(
        `/api/company/number?name=${encodeURIComponent(name)}`,
      );
      const numData = await numRes.json();
      if (!numRes.ok) {
        setError(numData.error ?? "法人番号の取得に失敗しました");
        return;
      }
      const houjinNo = numData.number;
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
          <div className="relative flex items-center bg-surface-muted border border-border rounded-full p-2 shadow-2xl shadow-black/10 dark:shadow-black/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
            <span
              className="material-symbols-outlined text-surface-muted ml-4"
              aria-hidden
            >
              search
            </span>
            <input
              className="flex-1 bg-transparent border-none text-foreground placeholder:text-surface-muted focus:ring-0 focus:outline-none text-base px-4 h-12 min-w-0"
              placeholder="Search Company Name (e.g. トヨタ自動車株式会社)"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button
              type="button"
              onClick={search}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-[#102222] font-bold rounded-full px-8 h-12 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
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
      </section>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4">
          {error}
        </div>
      )}

      {result && (
        <section className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">検索結果</h2>
            <p className="text-surface-muted text-sm">
              {result.hitCount}件が該当しました
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
                            {row.genzonZenso || "Active Status"}
                          </span>
                          <span className="text-surface-muted text-xs flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              verified
                            </span>
                            Verified Record
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-1">
                          {row.officeName || "—"}
                        </h3>
                        <p className="text-surface-muted flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">
                            numbers
                          </span>
                          Corporate Number: {row.houjinNo || "—"}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="self-start text-sm font-medium text-primary hover:text-foreground border border-primary/30 hover:bg-primary/10 rounded-full px-4 py-2 transition-colors"
                      >
                        View Full Report
                      </button>
                    </div>
                    <div className="h-px w-full bg-border" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative z-10">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          Location
                        </span>
                        <div className="text-foreground font-medium flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary mt-0.5 text-[20px]">
                            location_on
                          </span>
                          <span>
                            {row.address || "—"}
                            <br />
                            <span className="text-sm text-surface-muted">
                              Japan
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-surface-muted uppercase tracking-wide">
                          Pension Office
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
                          Date Recorded
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
                          Insured Persons
                        </span>
                        <div className="text-foreground font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            group
                          </span>
                          {row.hihokenshaCount || "—"}{" "}
                          <span className="text-surface-muted text-sm font-normal">
                            (Officially Registered)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimation Highlight Card - sample.html の lg:col-span-1 と同じ */}
                  <div
                    key={`highlight-${row.houjinNo}-${i}`}
                    className="lg:col-span-1 bg-linear-to-b from-surface-muted to-surface rounded-2xl p-1 border border-primary/20 shadow-xl shadow-primary/5"
                  >
                    <div className="bg-surface h-full w-full rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(var(--color-primary) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      />
                      <div className="relative z-10 bg-surface-muted p-3 rounded-full mb-2">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          groups
                        </span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-surface-muted text-sm font-medium uppercase tracking-wider mb-2">
                          Estimated Full-time
                        </p>
                        <h2 className="text-6xl font-black text-primary tracking-tighter drop-shadow-lg">
                          {row.hihokenshaCount || "—"}
                        </h2>
                        <p className="text-surface-muted text-sm mt-2">
                          Employees
                        </p>
                      </div>
                      <div className="relative z-10 w-full mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between text-xs text-surface-muted mb-1">
                          <span>Confidence</span>
                          <span className="text-primary font-bold">High</span>
                        </div>
                        <div className="w-full bg-surface-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: "85%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}

              {/* Regional Context - sample.html の lg:col-span-3 と同じ */}
              <div className="lg:col-span-3 bg-surface rounded-2xl border border-border h-48 relative overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWdPY0CnIsV9ytI9AcTpd0LGVeCfji2ezWqKighuzGzAz3t2mJKO5Qm0twwtSc_hyKq3JY0_JxUhmuX1HLXTX6ErRhpRKfPUsRcwkWPqVxXPTNy2MS50kQB0dBuKRf4725FaSja401VGbRWTtVSqkvkkBSYZPWWR4cHdUNbFptL6UTrjHZBHtODlFglmACQHpvG_TDDBE1JU9ysGKUnvcB1b5FnBBk968ZtSJXw2DLK3Qf6JqqXy4Jhg6pmjtxOtlfO0uJD7kg6nLp')`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-foreground font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      map
                    </span>
                    Regional Context
                  </p>
                  <p className="text-surface-muted text-sm max-w-xl">
                    {result.rows[0]?.address
                      ? `Based in ${result.rows[0].address}. Public records from Japan Pension Service.`
                      : "Based on public records from Japan Pension Service (年金機構)."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
