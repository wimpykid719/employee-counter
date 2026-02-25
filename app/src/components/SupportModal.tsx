type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SupportModal({ isOpen, onClose }: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
      <div className="relative w-full max-w-md bg-surface-dark rounded-2xl border border-primary/20 shadow-2xl overflow-hidden transform transition-all animate-fade-in-up">
        <div className="h-1.5 w-full bg-linear-to-r from-transparent via-primary to-transparent"></div>
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
          type="button"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/30">
            <span className="material-symbols-outlined text-primary text-3xl">
              volunteer_activism
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Support the Developers
          </h3>
          <h4 className="text-sm font-medium text-primary mb-4">
            開発者を支援する
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            正社員カウンターをご利用いただきありがとうございます！
            もし便利だと感じていただけたら、今後の運営を続けるためのサポートをいただけるととても励みになります。
            金額はご支援者様にて50~100,000円の間で任意にご入力ください。
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            開発の裏側や最新情報については、ぜひ開発者ブログをご覧ください。
            <a
              href="https://dev-spot-softwareengineer.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              開発者ブログを見る →
            </a>
          </p>
          <a
            href="xxx"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-base py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[22px]">
              credit_card
            </span>
            <span>開発者にスパチャする</span>
            <span className="material-symbols-outlined text-sm opacity-60 group-hover:translate-x-1 transition-transform">
              arrow_outward
            </span>
          </a>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Secure payment processed by Stripe</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-dark-lighter"></div>
      </div>
    </div>
  );
}
