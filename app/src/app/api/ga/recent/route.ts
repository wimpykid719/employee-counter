import { NextResponse } from "next/server";
import { getRecentQueries } from "@/lib/ga";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const queries = await getRecentQueries();
  return NextResponse.json({ queries });
}
