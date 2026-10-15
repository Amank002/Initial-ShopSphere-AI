"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";

import { getCartCount, getWishlist } from "@/lib/store";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const loadCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlist().length);
    };

    const timer = window.setTimeout(loadCounts, 0);

    const handleSync = () => {
      loadCounts();
    };

    window.addEventListener("cart-updated", handleSync);
    window.addEventListener("wishlist-updated", handleSync);
    window.addEventListener("shopsphere-sync", handleSync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("cart-updated", handleSync);
      window.removeEventListener("wishlist-updated", handleSync);
      window.removeEventListener("shopsphere-sync", handleSync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container-app flex min-h-18 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="ShopSphere AI home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles size={22} />
          </div>

          <span className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
            ShopSphere <span className="text-indigo-600">AI</span>
          </span>
        </Link>

        <form
          action="/search"
          method="GET"
          className="hidden flex-1 md:block md:max-w-xl"
        >
          <label htmlFor="navbar-search" className="sr-only">
            Search products
          </label>

          <input
            id="navbar-search"
            type="search"
            name="q"
            placeholder="Search products, categories..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </form>

        <nav
          className="flex shrink-0 items-center gap-2 sm:gap-4"
          aria-label="Main navigation"
        >
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600"
            aria-label={`Wishlist${
              wishlistCount > 0 ? `, ${wishlistCount} items` : ""
            }`}
          >
            <Heart size={23} />

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600"
            aria-label="My Profile"
            title="My Profile"
          >
            <User size={22} />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600"
            aria-label={`Shopping cart${
              cartCount > 0 ? `, ${cartCount} items` : ""
            }`}
          >
            <ShoppingBag size={23} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            className="hidden rounded-xl px-3 py-2 font-bold text-gray-800 transition hover:bg-gray-100 sm:block"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
