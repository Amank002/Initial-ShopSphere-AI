"use client";

import { products as defaultProducts } from "@/lib/data";

const PRODUCTS_KEY = "shopsphere-products";

export function getProducts() {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);

    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));

      return defaultProducts;
    }

    return JSON.parse(stored);
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(products: typeof defaultProducts) {
  if (typeof window === "undefined") return;

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

  window.dispatchEvent(new Event("products-updated"));
}
