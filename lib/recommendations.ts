"use client";

import { Product } from "@/lib/types";
import { getProducts } from "@/lib/catalog";
import { getCart, getWishlist } from "@/lib/store";

export type RecommendationStrategy =
  | "recently-viewed"
  | "similar"
  | "category"
  | "price"
  | "wishlist"
  | "cart"
  | "frequently-bought"
  | "trending"
  | "personalized";

export type RecommendationResult = {
  product: Product;
  score: number;
  reason: string;
};

const RECENTLY_VIEWED_KEY = "shopsphere-recently-viewed";

function normalizeId(id: string | number): string {
  return String(id);
}

function safeNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.map((id) => String(id));
  } catch {
    return [];
  }
}

export function trackRecentlyViewed(productId: string | number): void {
  if (typeof window === "undefined") return;

  const id = normalizeId(productId);
  const current = getRecentlyViewed();

  const updated = [id, ...current.filter((item) => item !== id)].slice(0, 10);

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event("shopsphere-sync"));
}

function getProductById(
  products: Product[],
  productId: string | number,
): Product | undefined {
  const id = normalizeId(productId);

  return products.find((product) => normalizeId(product.id) === id);
}

function calculateSimilarity(source: Product, candidate: Product): number {
  let score = 0;

  if (
    source.category &&
    candidate.category &&
    source.category.toLowerCase() === candidate.category.toLowerCase()
  ) {
    score += 40;
  }

  const sourceTags = Array.isArray(source.tags)
    ? source.tags.map((tag) => String(tag).toLowerCase())
    : [];

  const candidateTags = Array.isArray(candidate.tags)
    ? candidate.tags.map((tag) => String(tag).toLowerCase())
    : [];

  const sharedTags = sourceTags.filter((tag) =>
    candidateTags.includes(tag),
  ).length;

  score += Math.min(sharedTags * 10, 30);

  const sourcePrice = safeNumber(source.price);
  const candidatePrice = safeNumber(candidate.price);

  if (sourcePrice > 0 && candidatePrice > 0) {
    const difference = Math.abs(sourcePrice - candidatePrice) / sourcePrice;

    if (difference <= 0.1) {
      score += 20;
    } else if (difference <= 0.25) {
      score += 10;
    }
  }

  const sourceRating = safeNumber(source.rating);
  const candidateRating = safeNumber(candidate.rating);

  if (candidateRating >= sourceRating) {
    score += 10;
  }

  return score;
}

export function getSimilarProducts(
  productId: string | number,
  limit = 6,
): RecommendationResult[] {
  const products = getProducts() as Product[];
  const source = getProductById(products, productId);

  if (!source) return [];

  return products
    .filter((product) => normalizeId(product.id) !== normalizeId(productId))
    .map((product) => ({
      product,
      score: calculateSimilarity(source, product),
      reason:
        product.category === source.category
          ? "Similar category and product features"
          : "Similar price and product characteristics",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCategoryRecommendations(
  category: string,
  excludeId?: string | number,
  limit = 6,
): RecommendationResult[] {
  const products = getProducts() as Product[];

  const normalizedCategory = category.toLowerCase();

  return products
    .filter((product) => {
      const sameCategory =
        product.category?.toLowerCase() === normalizedCategory;

      const differentProduct =
        excludeId === undefined ||
        normalizeId(product.id) !== normalizeId(excludeId);

      return sameCategory && differentProduct;
    })
    .map((product) => ({
      product,
      score: safeNumber(product.rating) * 20,
      reason: `Popular choice in ${product.category}`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getPriceRecommendations(
  price: number,
  direction: "cheaper" | "premium" = "cheaper",
  limit = 6,
): RecommendationResult[] {
  const products = getProducts() as Product[];

  return products
    .filter((product) => {
      const productPrice = safeNumber(product.price);

      return direction === "cheaper"
        ? productPrice < price
        : productPrice > price;
    })
    .map((product) => {
      const productPrice = safeNumber(product.price);

      const difference = Math.abs(productPrice - price) / Math.max(price, 1);

      return {
        product,
        score: Math.max(0, 100 - difference * 100),
        reason:
          direction === "cheaper"
            ? "Lower-priced alternative"
            : "Premium alternative",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getWishlistRecommendations(limit = 6): RecommendationResult[] {
  const products = getProducts() as Product[];
  const wishlist = getWishlist();

  if (wishlist.length === 0) return [];

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(normalizeId(product.id)),
  );

  const categories = wishlistProducts
    .map((product) => product.category)
    .filter(Boolean);

  return products
    .filter(
      (product) =>
        !wishlist.includes(normalizeId(product.id)) &&
        categories.includes(product.category),
    )
    .map((product) => ({
      product,
      score: 70 + safeNumber(product.rating) * 5,
      reason: "Recommended from your wishlist preferences",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getCartRecommendations(limit = 6): RecommendationResult[] {
  const products = getProducts() as Product[];
  const cart = getCart();

  if (cart.length === 0) return [];

  const cartIds = cart.map((item) => normalizeId(item.product.id));

  const cartCategories = cart
    .map((item) => item.product.category)
    .filter(Boolean);

  return products
    .filter(
      (product) =>
        !cartIds.includes(normalizeId(product.id)) &&
        cartCategories.includes(product.category),
    )
    .map((product) => ({
      product,
      score: 65 + safeNumber(product.rating) * 5,
      reason: "Complements products already in your cart",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getRecentlyViewedRecommendations(
  limit = 6,
): RecommendationResult[] {
  const products = getProducts() as Product[];
  const recentlyViewed = getRecentlyViewed();

  return recentlyViewed
    .map((id) => getProductById(products, id))
    .filter((product): product is Product => Boolean(product))
    .slice(0, limit)
    .map((product, index) => ({
      product,
      score: 100 - index * 5,
      reason: "Recently viewed by you",
    }));
}

export function getTrendingProducts(limit = 6): RecommendationResult[] {
  const products = getProducts() as Product[];

  return products
    .map((product) => ({
      product,
      score:
        safeNumber(product.rating) * 20 + safeNumber(product.reviews) * 0.05,
      reason: "Trending among popular products",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getFrequentlyBoughtProducts(
  productId: string | number,
  limit = 6,
): RecommendationResult[] {
  const products = getProducts() as Product[];
  const source = getProductById(products, productId);

  if (!source) return [];

  return products
    .filter((product) => normalizeId(product.id) !== normalizeId(productId))
    .map((product) => {
      let score = 0;

      if (product.category !== source.category) {
        score += 30;
      }

      const price = safeNumber(product.price);
      const sourcePrice = safeNumber(source.price);

      if (price > 0 && sourcePrice > 0 && price <= sourcePrice * 0.7) {
        score += 25;
      }

      score += Math.min(safeNumber(product.rating) * 10, 50);

      return {
        product,
        score,
        reason: "Potentially useful with your selected product",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getPersonalizedRecommendations(
  limit = 8,
): RecommendationResult[] {
  const products = getProducts() as Product[];
  const wishlist = getWishlist();
  const recentlyViewed = getRecentlyViewed();
  const cart = getCart();

  const preferredCategories = [
    ...wishlist.map((id) => getProductById(products, id)?.category),
    ...recentlyViewed.map((id) => getProductById(products, id)?.category),
    ...cart.map((item) => item.product.category),
  ].filter(Boolean);

  const excludedIds = new Set([
    ...wishlist,
    ...cart.map((item) => normalizeId(item.product.id)),
  ]);

  return products
    .filter((product) => !excludedIds.has(normalizeId(product.id)))
    .map((product) => {
      let score = safeNumber(product.rating) * 10;

      if (preferredCategories.includes(product.category)) {
        score += 50;
      }

      if (recentlyViewed.includes(normalizeId(product.id))) {
        score += 20;
      }

      return {
        product,
        score,
        reason: preferredCategories.includes(product.category)
          ? "Personalized for your shopping interests"
          : "Popular recommendation for you",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Main recommendation function
 */
export function getRecommendations(
  strategy: RecommendationStrategy,
  options?: {
    productId?: string | number;
    category?: string;
    price?: number;
    direction?: "cheaper" | "premium";
    limit?: number;
  },
): RecommendationResult[] {
  const limit = options?.limit ?? 6;

  switch (strategy) {
    case "recently-viewed":
      return getRecentlyViewedRecommendations(limit);

    case "similar":
      return options?.productId !== undefined
        ? getSimilarProducts(options.productId, limit)
        : [];

    case "category":
      return options?.category
        ? getCategoryRecommendations(options.category, options.productId, limit)
        : [];

    case "price":
      return options?.price !== undefined
        ? getPriceRecommendations(
            options.price,
            options.direction ?? "cheaper",
            limit,
          )
        : [];

    case "wishlist":
      return getWishlistRecommendations(limit);

    case "cart":
      return getCartRecommendations(limit);

    case "frequently-bought":
      return options?.productId !== undefined
        ? getFrequentlyBoughtProducts(options.productId, limit)
        : [];

    case "trending":
      return getTrendingProducts(limit);

    case "personalized":
      return getPersonalizedRecommendations(limit);

    default:
      return [];
  }
}
