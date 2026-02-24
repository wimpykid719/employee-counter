"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_MEASUREMENT_ID =
  typeof process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID === "string"
    ? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID.trim()
    : "";
function trackPageView(args: { pathname: string; search: string }): void {
  if (!GA4_MEASUREMENT_ID) return;

  const params = {
    page_title: typeof document !== "undefined" ? document.title : undefined,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
    // page_path にクエリを含めると、GA4の拡張計測（サイト内検索）と干渉して
    // パラメータが重複（/?q=A?q=A）することがあるため、パスのみを送信します
    page_path: args.pathname || undefined,
  };

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // config を使って現在のページの情報を更新し、page_view を送信します
    window.gtag("config", GA4_MEASUREMENT_ID, {
      ...params,
      send_page_view: true,
    });
    return;
  }

  // gtag初期化前でもdataLayerに積んでおく（後からgtag.jsが拾う）
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["config", GA4_MEASUREMENT_ID, params]);
  }
}

function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    trackPageView({ pathname, search });
  }, [pathname, search]);

  return null;
}

function GoogleAnalyticsScripts() {
  if (!GA4_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

export function GoogleAnalytics() {
  return (
    <>
      <GoogleAnalyticsScripts />
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}
