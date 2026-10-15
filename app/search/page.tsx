import { Suspense } from "react";

import SearchClient from "./SearchClient";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const query = typeof params.q === "string" ? params.q : "";

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="container-app py-20">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🔎</div>

              <h1 className="mt-5 text-2xl font-black">Loading Search...</h1>
            </div>
          </div>
        }
      >
        <SearchClient query={query} />
      </Suspense>
    </main>
  );
}
