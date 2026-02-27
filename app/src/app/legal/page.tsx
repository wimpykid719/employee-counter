import Head from "next/head";
import Link from "next/link";

const LegalPage = () => {
  return (
    <>
      <Head>
        <title>特定商取引法に基づく表記 | 正社員カウンター</title>
        <meta
          name="description"
          content="Legal Notice based on the Act on Specified Commercial Transactions."
        />
      </Head>
      <main className="flex-1 px-6 py-12 md:px-20 lg:px-40 max-w-[1200px] mx-auto w-full">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-all group"
            href="/"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>正社員カウンターに戻る</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black tracking-tight mb-4">
            特定商取引法に基づく表記
          </h1>
          <div className="h-1.5 w-24 bg-primary rounded-full mb-6"></div>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
            Legal Notice based on the Act on Specified Commercial Transactions.
            サービスの利用に関する法的な開示事項を掲載しています。
          </p>
        </div>

        {/* Legal Information Table/List */}
        <div className="rounded-xl border border-primary/10 bg-white/5 dark:bg-slate-900/40 overflow-hidden backdrop-blur-sm">
          <div className="divide-y divide-primary/5">
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                サービス名
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                正社員カウンター
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                販売業者
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                個人事業主
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                運営責任者
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                大学生だった.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                所在地
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                請求があった場合に遅滞なく開示いたします
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                お問い合わせ先
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                <p className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    mail
                  </span>
                  <span>請求があった場合に遅滞なく開示いたします</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    call
                  </span>
                  <span>請求があった場合に遅滞なく開示いたします</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                販売価格
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                金額はご支援者様にて300~5,000円の間で任意にご入力ください。（Zennのバッジを送るを介して）
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                商品代金以外の必要料金
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                インターネット接続料金、通信料金等（利用者の負担となります）
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                お支払い方法
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                クレジットカード決済 (Stripe決済システムを利用)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                代金の支払時期
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                クレジットカード決済時（各カード会社の規約に基づく）
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 hover:bg-primary/5 transition-colors">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-2 md:mb-0">
                返金・キャンセル
              </div>
              <div className="md:col-span-2 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                決済完了後の返金は受け付けておりません。
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 bg-primary text-slate-900 font-black px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">home</span>
            <span>正社員カウンターに戻る</span>
          </Link>
        </div>
      </main>
    </>
  );
};

export default LegalPage;
