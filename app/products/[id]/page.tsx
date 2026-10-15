"use client";

import RecommendationSection from "@/components/RecommendationSection";
import ReviewsSection from "@/components/ReviewsSection";
import { trackRecentlyViewed } from "@/lib/recommendations";
import { getProducts } from "@/lib/catalog";
import { Product } from "@/lib/types";
import { addToCart, getWishlist, toggleWishlist } from "@/lib/store";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);

  const productId = String(id);

  const [product, setProduct] = useState<Product | null>(null);

  const [loaded, setLoaded] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const allProducts = getProducts() as Product[];

      const foundProduct = allProducts.find(
        (item) => String(item.id) === productId,
      );

      setProduct(foundProduct ?? null);

      if (foundProduct) {
        trackRecentlyViewed(foundProduct.id);

        setLiked(getWishlist().includes(String(foundProduct.id)));
      }

      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [productId]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />

            <div className="space-y-5 py-8">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

              <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />

              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />

              <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />

              <div className="h-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-20 text-center">
          <div className="text-6xl">🛍️</div>

          <h1 className="mt-5 text-3xl font-black text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            The product you are looking for does not exist or may have been
            removed.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    window.dispatchEvent(new Event("shopsphere-sync"));

    alert(`${quantity} × ${product.title} added to cart`);
  };

  const handleWishlist = () => {
    const normalizedId = String(product.id);

    toggleWishlist(normalizedId);

    const updatedWishlist = getWishlist();

    setLiked(updatedWishlist.includes(normalizedId));

    window.dispatchEvent(new Event("shopsphere-sync"));
  };

  const total = Number(product.price) * quantity;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-app py-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>

      <section className="container-app pb-12">
        <div className="grid gap-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              width={900}
              height={900}
              priority
              className="h-full min-h-100 w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              {product.category}
            </p>

            {product.badge && (
              <div className="mt-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  {product.badge}
                </span>
              </div>
            )}

            <h1 className="mt-4 text-3xl font-black text-gray-900 md:text-4xl">
              {product.title}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-amber-400 text-amber-400" />

                <span className="font-bold">{product.rating}</span>
              </div>

              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-black text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <p className="mb-2 text-sm font-bold text-gray-700">Quantity</p>

              <div className="flex w-fit items-center rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="grid h-11 w-11 place-items-center transition hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <span className="grid h-11 w-12 place-items-center border-x border-gray-200 font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="grid h-11 w-11 place-items-center transition hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                <Heart
                  size={19}
                  className={liked ? "fill-red-500 text-red-500" : ""}
                />

                {liked ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Price</span>

                <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>Quantity</span>

                <span>{quantity}</span>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>

                  <span className="text-xl font-black text-indigo-600">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecommendationSection
        strategy="similar"
        productId={product.id}
        limit={4}
      />

      <RecommendationSection
        strategy="category"
        productId={product.id}
        category={product.category}
        limit={4}
      />

      <RecommendationSection
        strategy="price"
        productId={product.id}
        price={Number(product.price)}
        direction="cheaper"
        limit={4}
      />

      <ReviewsSection productId={product.id} />
    </main>
  );
}
