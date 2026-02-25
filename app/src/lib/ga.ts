import { BetaAnalyticsDataClient } from "@google-analytics/data";

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
      transport: "rest",
    });
  } catch (e) {
    console.error("Failed to initialize GA4 client:", e);
  }
}

export async function getRecentQueries(): Promise<string[]> {
  if (!analyticsDataClient || !propertyId) {
    return [];
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
        try {
          const url = new URL(path, "https://example.com");
          let q = url.searchParams.get("q");

          if (q) {
            if (q.includes("?q=")) {
              q = q.split("?q=")[0];
            }

            const normalized = q.trim();
            if (normalized.length > 0 && !seen.has(normalized)) {
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

    return queries;
  } catch (error) {
    console.error("GA4 API Error:", error);
    return [];
  }
}
