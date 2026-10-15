"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

import { Product } from "@/lib/types";
import { addToCart, getWishlist, toggleWishlist } from "@/lib/store";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return getWishlist().includes(String(product.id));
  });

  const handleAddToCart = () => {
    addToCart(product);

    window.dispatchEvent(new Event("cart-updated"));

    window.dispatchEvent(new Event("shopsphere-sync"));

    alert(`${product.title} added to cart`);
  };

  const handleWishlist = () => {
    toggleWishlist(String(product.id));

    const updatedWishlist = getWishlist();

    setLiked(updatedWishlist.includes(String(product.id)));

    window.dispatchEvent(new Event("wishlist-updated"));

    window.dispatchEvent(new Event("shopsphere-sync"));
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-800 shadow">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md transition hover:scale-105"
        >
          <Heart
            size={19}
            className={liked ? "fill-red-500 text-red-500" : "text-gray-700"}
          />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          {product.category}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="mt-1 block truncate text-base font-bold text-gray-900 hover:text-indigo-600"
        >
          {product.title}
        </Link>

        <div className="mt-2 flex items-center gap-1 text-sm">
          <Star size={15} className="fill-amber-400 text-amber-400" />

          <span className="font-semibold text-gray-700">{product.rating}</span>

          <span className="text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-black text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.oldPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 hover:shadow-lg"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
