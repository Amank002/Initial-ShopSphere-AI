"use client";

import { Product } from "@/lib/types";
import { getProducts } from "@/lib/catalog";

export type ShoppingIntent = {
  query: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  minRating?: number;
  sortBy?: "price-asc" | "price-desc" | "rating";
};

export type AssistantResult = {
  products: Product[];
  intent: ShoppingIntent;
  message: string;
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function extractPrice(text: string): number | undefined {
  const match = text.match(
    /(?:under|below|less than|within|upto|up to|max(?:imum)?(?: price)?|₹|rs\.?|inr)\s*₹?\s*(\d[\d,]*)/i,
  );

  if (!match?.[1]) {
    const fallback = text.match(/₹\s*(\d[\d,]*)|rs\.?\s*(\d[\d,]*)/i);

    if (!fallback) return undefined;

    const value = fallback[1] || fallback[2];

    return Number(value.replace(/,/g, ""));
  }

  return Number(match[1].replace(/,/g, ""));
}

function extractRating(text: string): number | undefined {
  const match = text.match(/(?:rating|rated|stars?|reviews?).*?(\d(?:\.\d)?)/i);

  if (!match?.[1]) return undefined;

  const rating = Number(match[1]);

  if (rating < 1 || rating > 5) {
    return undefined;
  }

  return rating;
}

function detectCategory(text: string, products: Product[]): string | undefined {
  const normalized = normalizeText(text);

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );

  const directMatch = categories.find((category) =>
    normalized.includes(category.toLowerCase()),
  );

  if (directMatch) {
    return directMatch;
  }

  const aliases: Record<string, string[]> = {
    electronics: [
      "electronic",
      "electronics",
      "gadget",
      "gadgets",
      "tech",
      "technology",
    ],
    fashion: ["fashion", "clothes", "clothing", "dress", "wear", "outfit"],
    home: ["home", "house", "furniture", "kitchen"],
    fitness: ["fitness", "gym", "workout", "exercise", "sports"],
  };

  for (const category of categories) {
    const categoryKey = category.toLowerCase();

    const categoryAliases = aliases[categoryKey] ?? [];

    if (categoryAliases.some((alias) => normalized.includes(alias))) {
      return category;
    }
  }

  return undefined;
}

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

export function parseShoppingIntent(query: string): ShoppingIntent {
  const products = getProducts() as Product[];
  const normalized = normalizeText(query);

  const intent: ShoppingIntent = {
    query,
  };

  const category = detectCategory(normalized, products);

  if (category) {
    intent.category = category;
  }

  const price = extractPrice(normalized);

  if (price !== undefined) {
    if (
      hasAny(normalized, [
        "under",
        "below",
        "less than",
        "upto",
        "up to",
        "maximum",
        "max",
      ])
    ) {
      intent.maxPrice = price;
    } else {
      intent.maxPrice = price;
    }
  }

  const rating = extractRating(normalized);

  if (rating !== undefined) {
    intent.minRating = rating;
  }

  if (
    hasAny(normalized, [
      "cheapest",
      "cheaper",
      "lowest price",
      "low price",
      "affordable",
      "budget",
    ])
  ) {
    intent.sortBy = "price-asc";
  }

  if (hasAny(normalized, ["expensive", "premium", "highest price"])) {
    intent.sortBy = "price-desc";
  }

  if (
    hasAny(normalized, [
      "best rated",
      "best rating",
      "highest rated",
      "good rating",
      "top rated",
    ])
  ) {
    intent.sortBy = "rating";
    intent.minRating = Math.max(intent.minRating ?? 0, 4);
  }

  return intent;
}

export function searchProductsByIntent(intent: ShoppingIntent): Product[] {
  const products = getProducts() as Product[];

  let results = products.filter((product) => {
    if (
      intent.category &&
      product.category?.toLowerCase() !== intent.category.toLowerCase()
    ) {
      return false;
    }

    if (
      intent.maxPrice !== undefined &&
      Number(product.price) > intent.maxPrice
    ) {
      return false;
    }

    if (
      intent.minPrice !== undefined &&
      Number(product.price) < intent.minPrice
    ) {
      return false;
    }

    if (
      intent.minRating !== undefined &&
      Number(product.rating) < intent.minRating
    ) {
      return false;
    }

    return true;
  });

  if (intent.sortBy === "price-asc") {
    results = [...results].sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (intent.sortBy === "price-desc") {
    results = [...results].sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (intent.sortBy === "rating") {
    results = [...results].sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  return results;
}

export function createAssistantResponse(
  query: string,
  intent: ShoppingIntent,
  products: Product[],
): string {
  if (products.length === 0) {
    if (intent.maxPrice !== undefined) {
      return `I couldn't find products matching your request under ₹${intent.maxPrice.toLocaleString(
        "en-IN",
      )}. Try increasing your budget or changing the category.`;
    }

    if (intent.category) {
      return `I couldn't find matching ${intent.category} products. Try another category or a broader search.`;
    }

    return "I couldn't find an exact match. Try describing the product, budget, or rating you're looking for.";
  }

  const productWord = products.length === 1 ? "product" : "products";

  if (intent.maxPrice !== undefined && intent.minRating !== undefined) {
    return `I found ${products.length} ${productWord} under ₹${intent.maxPrice.toLocaleString(
      "en-IN",
    )} with ratings of ${intent.minRating}+ stars.`;
  }

  if (intent.maxPrice !== undefined) {
    return `I found ${products.length} ${productWord} within your ₹${intent.maxPrice.toLocaleString(
      "en-IN",
    )} budget.`;
  }

  if (intent.minRating !== undefined) {
    return `I found ${products.length} ${productWord} with ratings of ${intent.minRating}+ stars.`;
  }

  if (intent.category) {
    return `Here are ${products.length} ${intent.category} ${productWord} that may interest you.`;
  }

  return `I found ${products.length} ${productWord} that match your request.`;
}

export function askShoppingAssistant(query: string): AssistantResult {
  const intent = parseShoppingIntent(query);

  const products = searchProductsByIntent(intent);

  const limitedProducts = products.slice(0, 6);

  const message = createAssistantResponse(query, intent, limitedProducts);

  return {
    products: limitedProducts,
    intent,
    message,
  };
}

export function refineAssistantResults(
  previousIntent: ShoppingIntent,
  previousProducts: Product[],
  refinement: string,
): AssistantResult {
  const normalized = normalizeText(refinement);

  const nextIntent: ShoppingIntent = {
    ...previousIntent,
  };

  if (
    hasAny(normalized, ["cheaper", "lower price", "more affordable", "budget"])
  ) {
    const currentPrices = previousProducts
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    if (currentPrices.length > 0) {
      const averagePrice =
        currentPrices.reduce((sum, price) => sum + price, 0) /
        currentPrices.length;

      nextIntent.maxPrice = Math.floor(averagePrice * 0.8);
    } else if (nextIntent.maxPrice !== undefined) {
      nextIntent.maxPrice = Math.floor(nextIntent.maxPrice * 0.8);
    }

    nextIntent.sortBy = "price-asc";
  }

  if (
    hasAny(normalized, [
      "better rating",
      "better rated",
      "higher rating",
      "higher rated",
      "best rated",
    ])
  ) {
    nextIntent.minRating = Math.min(
      5,
      Math.max(4.5, (nextIntent.minRating ?? 4) + 0.5),
    );

    nextIntent.sortBy = "rating";
  }

  if (
    hasAny(normalized, [
      "more like",
      "similar",
      "similar products",
      "like this",
    ])
  ) {
    nextIntent.sortBy = "rating";
  }

  const products = searchProductsByIntent(nextIntent).slice(0, 6);

  const message = createAssistantResponse(refinement, nextIntent, products);

  return {
    products,
    intent: nextIntent,
    message,
  };
}
