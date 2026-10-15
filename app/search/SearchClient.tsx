"use client";

import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { useMemo } from "react";

import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";

type SearchClientProps = {
  query: string;
};

export default function SearchClient({ query }: SearchClientProps) {
  const searchQuery = query.trim().toLowerCase();

  const results = useMemo<Product[]>(() => {
    if (!searchQuery) {
      return [];
    }

    const allProducts = getProducts() as Product[];

    return allProducts.filter((product) => {
      const title = product.title?.toLowerCase() ?? "";

      const category = product.category?.toLowerCase() ?? "";

      const description = product.description?.toLowerCase() ?? "";

      const tags = Array.isArray(product.tags)
        ? product.tags.join(" ").toLowerCase()
        : "";

      return (
        title.includes(searchQuery) ||
        category.includes(searchQuery) ||
        description.includes(searchQuery) ||
        tags.includes(searchQuery)
      );
    });
  }, [searchQuery]);

  return (
    <section className="container-app py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to Shopping
      </Link>

      <div className="mt-8">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
          Product Search
        </p>

        <h1 className="mt-2 text-3xl font-black text-gray-900">
          Search Results
        </h1>

        {query ? (
          <p className="mt-2 text-gray-500">
            Showing results for{" "}
            <span className="font-bold text-gray-900">&quot;{query}&quot;</span>
          </p>
        ) : (
          <p className="mt-2 text-gray-500">
            Search our products by name or category.
          </p>
        )}
      </div>

      <form action="/search" method="GET" className="mt-8 max-w-2xl">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search headphones, fashion, fitness..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </form>

      {!query && (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-5xl">🔎</div>

          <h2 className="mt-5 text-xl font-black text-gray-900">
            What are you looking for?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Try searching for headphones, fashion, fitness, electronics or home.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/search?q=electronics"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Electronics
            </Link>

            <Link
              href="/search?q=fashion"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Fashion
            </Link>

            <Link
              href="/search?q=fitness"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Fitness
            </Link>

            <Link
              href="/search?q=home"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Home
            </Link>
          </div>
        </div>
      )}

      {query && results.length > 0 && (
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">
              {results.length} {results.length === 1 ? "Product" : "Products"}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="text-5xl">🛍️</div>

          <h2 className="mt-5 text-xl font-black text-gray-900">
            No products found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            We couldn&apos;t find any products matching{" "}
            <span className="font-bold text-gray-900">&quot;{query}&quot;</span>
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/search?q=electronics"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Electronics
            </Link>

            <Link
              href="/search?q=fashion"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Fashion
            </Link>

            <Link
              href="/search?q=fitness"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Fitness
            </Link>

            <Link
              href="/search?q=home"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
