import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "正社員カウンター",
  description:
    "会社名から厚生年金の被保険者数（正社員規模の目安）を公表情報から取得",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <GoogleAnalytics />
        <header className="flex items-center border-b border-border px-4 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <title>正社員カウンター</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              正社員カウンター
            </h2>
          </div>
        </header>
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 md:px-6 md:py-12">
          {children}
        </main>
        <footer className="border-t border-border py-6 mt-auto">
          <div className="max-w-[1200px] mx-auto px-6 text-center text-surface-muted text-sm">
            <p>
              厚生年金・年金機構の公表データを参照しています。表示は参考情報です。
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
              <a
                href="/legal"
                className="hover:text-foreground transition-colors"
              >
                特定商取引法に基づく表記
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
