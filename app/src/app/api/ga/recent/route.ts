import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

const propertyId = process.env.GA4_PROPERTY_ID;
const clientEmail = process.env.GA4_CLIENT_EMAIL;
const privateKey = process.env.GA4_PRIVATE_KEY;

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

if (propertyId && clientEmail && privateKey) {
  try {
    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      transport: "rest", // gRPCの依存問題を避けるためにRESTを使用
    });
  } catch (e) {
    console.error("Failed to initialize GA4 client:", e);
  }
}

export async function GET() {
  if (!analyticsDataClient || !propertyId) {
    return NextResponse.json({ queries: [] });
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "pagePathPlusQueryString",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePathPlusQueryString",
          stringFilter: {
            matchType: "CONTAINS",
            value: "q=",
          },
        },
      },
      limit: 50,
    });

    const queries: string[] = [];
    const seen = new Set<string>();

    if (response.rows) {
      for (const row of response.rows) {
        const path = row.dimensionValues?.[0]?.value || "";
        // Extract query parameter 'q'
        try {
          const url = new URL(path, "https://example.com");
          const q = url.searchParams.get("q");
          if (q && q.trim().length > 1) {
            const normalized = q.trim();
            if (!seen.has(normalized)) {
              queries.push(normalized);
              seen.add(normalized);
            }
          }
        } catch (e) {
          // Skip invalid URLs
        }
        if (queries.length >= 10) break;
      }
    }

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("GA4 API Error:", error);
    return NextResponse.json({ queries: [] });
  }
}
