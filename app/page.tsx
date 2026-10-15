"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import HomeRecommendations from "@/components/HomeRecommendations";

import { categories } from "@/lib/data";
import { getProducts } from "@/lib/catalog";
import { Product, Category } from "@/lib/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setCategory] = useState<Category>("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      const catalog = getProducts() as Product[];

      setProducts(catalog);
      setLoaded(true);
    };

    const timer = window.setTimeout(loadProducts, 0);

    const handleProductsUpdated = () => {
      setProducts(getProducts() as Product[]);
    };

    window.addEventListener("products-updated", handleProductsUpdated);

    window.addEventListener("shopsphere-sync", handleProductsUpdated);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("products-updated", handleProductsUpdated);

      window.removeEventListener("shopsphere-sync", handleProductsUpdated);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const personalizedProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="container-app grid min-h-130 items-center gap-10 py-16 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
              <span>✨</span>
              <span>AI-powered personalized shopping</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Shop smarter.
              <br />
              Discover what fits <span className="text-indigo-200">you.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
              Discover personalized products with AI-powered recommendations
              based on your interests, wishlist and shopping activity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/50 px-5 py-3 font-bold text-indigo-400 transition hover:bg-indigo-500"
              >
                Explore Products
                <span>→</span>
              </a>

              <a
                href="#ai"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/50"
              >
                Try ShopSphere AI
                <span>→</span>s
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="mx-auto max-w-md rotate-1 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="overflow-hidden rounded-2xl bg-white">
                <div className="flex h-72 items-center justify-center bg-linear-to-br from-indigo-100 to-violet-200">
                  <div className="text-center">
                    <div className="text-7xl">🛍️</div>

                    <p className="mt-4 text-xl font-black text-gray-900">
                      Smart Shopping
                    </p>

                    <p className="mt-1 text-sm text-gray-500">Powered by AI</p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    Recommended for you
                  </p>

                  <p className="mt-1 text-lg font-black text-gray-900">
                    Personalized Products
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Recommendations based on your shopping preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app grid gap-4 py-8 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-indigo-50 p-3 text-2xl">🚚</div>

          <div>
            <h3 className="font-bold text-gray-900">Fast Delivery</h3>

            <p className="mt-1 text-sm text-gray-500">
              Quick and reliable delivery
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-indigo-50 p-3 text-2xl">🔒</div>

          <div>
            <h3 className="font-bold text-gray-900">Secure Shopping</h3>

            <p className="mt-1 text-sm text-gray-500">
              Safe and protected checkout
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-indigo-50 p-3 text-2xl">🤖</div>

          <div>
            <h3 className="font-bold text-gray-900">AI Recommendations</h3>

            <p className="mt-1 text-sm text-gray-500">
              Products selected for you
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="container-app py-12">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Discover
          </p>

          <h2 className="mt-2 text-3xl font-black text-gray-900">
            Explore Products
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-gray-500">
            Browse products across electronics, fashion, home and fitness.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategory(category as Category)}
              className={
                selectedCategory === category
                  ? "rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md transition"
                  : "rounded-full bg-white px-5 py-2 text-sm font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50"
              }
            >
              {category}
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        )}

        {loaded && filteredProducts.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="text-4xl">🛍️</div>

            <h3 className="mt-3 text-lg font-bold">No products found</h3>

            <p className="mt-1 text-sm text-gray-500">
              Try selecting another category.
            </p>
          </div>
        )}
      </section>

      <section className="container-app pb-12">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Personalized
          </p>

          <h2 className="mt-2 text-3xl font-black text-gray-900">
            Recommended for You
          </h2>

          <p className="mt-2 text-gray-500">
            Products selected using shopping interest signals.
          </p>
        </div>

        {personalizedProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {personalizedProducts.map((product) => (
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        )}
      </section>

      <HomeRecommendations />

      <section id="ai" className="bg-gray-900 py-16 text-white">
        <div className="container-app text-center">
          <div className="mx-auto max-w-3xl">
            <div className="text-5xl">🤖</div>

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              Meet ShopSphere AI
            </h2>

            <p className="mt-4 leading-7 text-gray-300">
              Your intelligent shopping assistant helps you discover products
              based on your needs, interests and shopping behavior.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-5 transition hover:bg-white/15">
                <div className="text-2xl">🎯</div>

                <h3 className="mt-3 font-bold">Personalized</h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Recommendations based on your interests and shopping activity.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 transition hover:bg-white/15">
                <div className="text-2xl">💬</div>

                <h3 className="mt-3 font-bold">Conversational</h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Ask questions about products using natural language.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 transition hover:bg-white/15">
                <div className="text-2xl">⚡</div>

                <h3 className="mt-3 font-bold">Smart Discovery</h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Find relevant products faster with intelligent suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
