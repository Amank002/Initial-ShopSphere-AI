"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Product } from "@/lib/types";
import { getProducts } from "@/lib/catalog";
import { addToCart, getWishlist, toggleWishlist } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setWishlistIds(getWishlist());
      setProducts(getProducts() as Product[]);
    }, 0);

    const handleWishlistUpdate = () => {
      setWishlistIds(getWishlist());
    };

    const handleProductsUpdate = () => {
      setProducts(getProducts() as Product[]);
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    window.addEventListener("shopsphere-sync", handleWishlistUpdate);

    window.addEventListener("products-updated", handleProductsUpdate);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("wishlist-updated", handleWishlistUpdate);

      window.removeEventListener("shopsphere-sync", handleWishlistUpdate);

      window.removeEventListener("products-updated", handleProductsUpdate);
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    return products.filter((product) =>
      wishlistIds.includes(String(product.id)),
    );
  }, [products, wishlistIds]);

  const handleRemove = (productId: string | number) => {
    toggleWishlist(String(productId));
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-r from-pink-600 to-rose-600 text-white">
        <div className="container-app py-10">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <Heart size={36} fill="currentColor" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-pink-100">
                Saved For Later
              </p>

              <h1 className="mt-1 text-4xl font-black">My Wishlist</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        {wishlistProducts.length === 0 ? (
          <div className="card mx-auto max-w-4xl p-12 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-50">
              <Heart size={42} className="text-pink-500" />
            </div>

            <h2 className="mt-7 text-3xl font-black text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Save products you love and come back to them anytime.
            </p>

            <Link
              href="/#products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-bold text-white transition hover:bg-pink-700"
            >
              <ShoppingBag size={18} />
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Saved Products
                </h2>

                <p className="mt-1 text-gray-500">
                  {wishlistProducts.length}{" "}
                  {wishlistProducts.length === 1 ? "product" : "products"} saved
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                <ShoppingBag size={18} />
                Add All to Cart
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <div key={String(product.id)} className="relative">
                  <ProductCard product={product} />

                  <button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                    aria-label={`Remove ${product.title} from wishlist`}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <ShoppingBag size={18} />
                View Cart
              </Link>

              <Link
                href="/#products"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
