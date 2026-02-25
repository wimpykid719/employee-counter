import { Suspense } from "react";
import { HomeClient } from "@/components/HomeClient";
import { SearchForm } from "@/components/SearchForm";
import { getRecentQueries } from "@/lib/ga";

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const recentQueries = await getRecentQueries();

  return (
    <>
      <Suspense fallback={null}>
        <SearchForm initialRecentQueries={recentQueries} />
      </Suspense>
      <HomeClient />
    </>
  );
}
