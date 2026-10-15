"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  ShoppingCart,
  Eye,
  Tag,
} from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import {
  getRecommendations,
  RecommendationResult,
  RecommendationStrategy,
} from "@/lib/recommendations";

type RecommendationSectionProps = {
  strategy: RecommendationStrategy;
  title?: string;
  description?: string;
  productId?: string | number;
  category?: string;
  price?: number;
  direction?: "cheaper" | "premium";
  limit?: number;
  showReason?: boolean;
};

export default function RecommendationSection({
  strategy,
  title,
  description,
  productId,
  category,
  price,
  direction,
  limit = 4,
  showReason = true,
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<
    RecommendationResult[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const results = getRecommendations(strategy, {
        productId,
        category,
        price,
        direction,
        limit,
      });

      setRecommendations(results);
      setLoaded(true);
    }, 0);

    const refreshRecommendations = () => {
      const results = getRecommendations(strategy, {
        productId,
        category,
        price,
        direction,
        limit,
      });

      setRecommendations(results);
    };

    window.addEventListener("shopsphere-sync", refreshRecommendations);
    window.addEventListener("wishlist-updated", refreshRecommendations);
    window.addEventListener("cart-updated", refreshRecommendations);
    window.addEventListener("products-updated", refreshRecommendations);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("shopsphere-sync", refreshRecommendations);

      window.removeEventListener("wishlist-updated", refreshRecommendations);

      window.removeEventListener("cart-updated", refreshRecommendations);

      window.removeEventListener("products-updated", refreshRecommendations);
    };
  }, [strategy, productId, category, price, direction, limit]);

  const sectionTitle =
    title ||
    {
      "recently-viewed": "Recently Viewed",
      similar: "You May Also Like",
      category: "More From This Category",
      price:
        direction === "premium"
          ? "Premium Alternatives"
          : "More Affordable Options",
      wishlist: "Because You Like These",
      cart: "Complete Your Shopping",
      "frequently-bought": "Frequently Bought Together",
      trending: "Trending Now",
      personalized: "Picked For You",
    }[strategy];

  const sectionDescription =
    description ||
    {
      "recently-viewed": "Products you've recently explored.",
      similar: "Products with similar features and characteristics.",
      category: "Popular products from the same category.",
      price:
        direction === "premium"
          ? "Higher-end alternatives worth exploring."
          : "Great alternatives at lower prices.",
      wishlist: "Recommendations based on products you've saved.",
      cart: "Products that complement items in your cart.",
      "frequently-bought": "Products that pair well with your selection.",
      trending: "Popular products shoppers are exploring.",
      personalized: "Recommendations based on your shopping activity.",
    }[strategy];

  if (!loaded) {
    return (
      <section className="container-app py-12">
        <div className="mb-6">
          <div className="h-7 w-56 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
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
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="container-app py-12">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
            {strategy === "trending" && <TrendingUp className="h-3.5 w-3.5" />}
            {strategy === "wishlist" && <Heart className="h-3.5 w-3.5" />}
            {strategy === "cart" && <ShoppingCart className="h-3.5 w-3.5" />}
            {strategy === "recently-viewed" && <Eye className="h-3.5 w-3.5" />}
            {strategy === "price" && <Tag className="h-3.5 w-3.5" />}
            {![
              "trending",
              "wishlist",
              "cart",
              "recently-viewed",
              "price",
            ].includes(strategy) && <Sparkles className="h-3.5 w-3.5" />}
            AI Recommendations
          </div>

          <h2 className="text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
            {sectionTitle}
          </h2>

          {sectionDescription && (
            <p className="mt-1.5 text-sm text-gray-500 md:text-base">
              {sectionDescription}
            </p>
          )}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
        >
          Explore more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((recommendation) => (
          <div key={String(recommendation.product.id)} className="min-w-0">
            <ProductCard product={recommendation.product} />

            {showReason && (
              <div className="mt-2 flex items-start gap-1.5 px-1 text-xs text-gray-400">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />

                <span className="line-clamp-2">{recommendation.reason}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
