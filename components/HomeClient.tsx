"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Search,
  Heart,
  Star,
  Zap,
} from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import HomeRecommendations from "@/components/HomeRecommendations";
import { categories } from "@/lib/data";
import { getProducts } from "@/lib/catalog";
import type { Product, Category } from "@/lib/types";

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "A simple, secure demo checkout",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Discover products picked for you",
    color: "bg-violet-50 text-violet-600",
  },
];

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProducts(getProducts() as Product[]);
      setLoaded(true);
    }, 0);

    const refreshProducts = () => {
      setProducts(getProducts() as Product[]);
    };

    window.addEventListener("products-updated", refreshProducts);
    window.addEventListener("shopsphere-sync", refreshProducts);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("products-updated", refreshProducts);
      window.removeEventListener("shopsphere-sync", refreshProducts);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.toLowerCase() ===
          String(selectedCategory).toLowerCase();

      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-700 via-violet-600 to-purple-600 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="container-app relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={17} className="text-yellow-300" />
              AI-powered personalized shopping
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Shop smarter.
              <br />
              Discover what
              <br />
              <span className="text-violet-200">fits you.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-indigo-100 sm:text-lg">
              Discover products that match your style, compare your options, and
              find your next favorite with personalized shopping
              recommendations.
            </p>

            <form
              action="/search"
              method="GET"
              className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-xl sm:flex-row"
            >
              <label htmlFor="home-search" className="sr-only">
                Search products
              </label>

              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search size={20} className="shrink-0 text-gray-400" />
                <input
                  id="home-search"
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full min-w-0 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Search
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-indigo-100">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} />
                Easy demo checkout
              </span>
              <span className="inline-flex items-center gap-2">
                <Heart size={16} />
                Your wishlist
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                <ShoppingBag size={19} />
                Shop Now
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/search?q=trending"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white transition hover:bg-white/20"
              >
                <Zap size={18} />
                Discover Products
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="rotate-1 rounded-3xl border border-white/30 bg-white/10 p-3 shadow-2xl backdrop-blur transition duration-300 hover:rotate-0">
              <div className="overflow-hidden rounded-2xl bg-white text-gray-900">
                <div className="bg-linear-to-br from-violet-100 via-indigo-100 to-blue-100 px-6 py-12 text-center sm:py-16">
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-lg">
                    <ShoppingBag
                      size={48}
                      strokeWidth={1.5}
                      className="text-indigo-600"
                    />
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                    Your shopping companion
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Smart Shopping
                  </h2>

                  <p className="mt-2 text-gray-500">
                    A better way to discover your favorites.
                  </p>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
                      <Sparkles size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                        Made for your preferences
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold">
                        Personalized Products
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Find products worth exploring.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/products"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-700"
                  >
                    Explore Collection
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-indigo-100">
              <Star size={16} className="fill-yellow-300 text-yellow-300" />
              Explore products across your favorite categories
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${benefit.color}`}
                >
                  <Icon size={25} />
                </div>

                <div>
                  <h3 className="font-extrabold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="discover-products" className="container-app py-12">
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-indigo-600">
            Discover
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Explore Products
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Browse electronics, fashion, home essentials, and fitness products
            in one place.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={active}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {searchQuery ? "Matching Products" : "Popular Products"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {loaded
                ? `${filteredProducts.length} products found`
                : "Loading your collection..."}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-indigo-600 transition hover:text-indigo-800 sm:self-auto"
          >
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        {!loaded ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-100" />
                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <div key={String(product.id)} className="min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <Search size={36} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search or select another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-bold text-gray-900 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            Browse All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <HomeRecommendations />
      </section>
      <section className="container-app py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-gray-950 via-indigo-950 to-violet-900 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-violet-200">
                <Sparkles size={15} />
                YOUR SMART SHOPPING COMPANION
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Not sure what to choose?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-gray-300">
                Explore personalized recommendations and use the ShopSphere AI
                assistant to discover products that suit your needs.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-violet-50 md:self-center"
            >
              Find Your Product
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
