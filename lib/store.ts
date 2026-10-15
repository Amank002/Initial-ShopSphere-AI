"use client";

import { Product } from "@/lib/types";

const CART_KEY = "shopsphere-cart";
const WISHLIST_KEY = "shopsphere-wishlist";

export type CartItem = {
  product: Product;
  quantity: number;
};

function normalizeId(id: string | number): string {
  return String(id);
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getCart(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const storedCart = localStorage.getItem(CART_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item): item is CartItem =>
        item &&
        typeof item === "object" &&
        item.product &&
        typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
}

export function addToCart(product: Product): void {
  if (!isBrowser()) {
    return;
  }

  const cart = getCart();

  const productId = normalizeId(product.id);

  const existingItem = cart.find(
    (item) => normalizeId(item.product.id) === productId,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cart-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function removeFromCart(productId: string | number): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedId = normalizeId(productId);

  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => normalizeId(item.product.id) !== normalizedId,
  );

  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

  window.dispatchEvent(new Event("cart-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function updateCartQuantity(
  productId: string | number,
  quantity: number,
): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedId = normalizeId(productId);

  const cart = getCart();

  const item = cart.find(
    (cartItem) => normalizeId(cartItem.product.id) === normalizedId,
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = Math.floor(quantity);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cart-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function clearCart(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(CART_KEY);

  window.dispatchEvent(new Event("cart-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function getCartCount(): number {
  const cart = getCart();

  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();

  return cart.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );
}

export function getWishlist(): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);

    if (!storedWishlist) {
      return [];
    }

    const parsedWishlist = JSON.parse(storedWishlist);

    if (!Array.isArray(parsedWishlist)) {
      return [];
    }

    return parsedWishlist.map((id) => String(id));
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string | number): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedId = normalizeId(productId);

  const wishlist = getWishlist();

  const exists = wishlist.includes(normalizedId);

  const updatedWishlist = exists
    ? wishlist.filter((id) => id !== normalizedId)
    : [...wishlist, normalizedId];

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));

  window.dispatchEvent(new Event("wishlist-updated"));

  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function isInWishlist(productId: string | number): boolean {
  const normalizedId = normalizeId(productId);

  return getWishlist().includes(normalizedId);
}

export function removeFromWishlist(productId: string | number): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedId = normalizeId(productId);

  const wishlist = getWishlist();

  const updatedWishlist = wishlist.filter((id) => id !== normalizedId);

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));

  window.dispatchEvent(new Event("wishlist-updated"));

  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function clearWishlist(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(WISHLIST_KEY);

  window.dispatchEvent(new Event("wishlist-updated"));

  window.dispatchEvent(new Event("shopsphere-sync"));
}
