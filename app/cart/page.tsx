"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import {
  CartItem,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/store";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCart(getCart());
  };

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
  }, [cart]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      loadCart();
    }, 0);

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    window.addEventListener("shopsphere-sync", handleCartUpdate);

    return () => {
      window.clearTimeout(initialLoad);

      window.removeEventListener("cart-updated", handleCartUpdate);

      window.removeEventListener("shopsphere-sync", handleCartUpdate);
    };
  }, []);

  const handleIncrease = (productId: string | number, quantity: number) => {
    updateCartQuantity(productId, quantity + 1);
  };

  const handleDecrease = (productId: string | number, quantity: number) => {
    updateCartQuantity(productId, quantity - 1);
  };

  const handleRemove = (productId: string | number) => {
    removeFromCart(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container-app py-10">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <ShoppingBag size={36} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-200">
                Your Shopping Bag
              </p>

              <h1 className="mt-1 text-4xl font-black">Shopping Cart</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        {cart.length === 0 ? (
          <div className="card mx-auto max-w-4xl p-12 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
              <ShoppingBag size={42} className="text-indigo-600" />
            </div>

            <h2 className="mt-7 text-3xl font-black text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Looks like you have not added anything to your cart yet. Explore
              our products and find something you love.
            </p>

            <Link
              href="/#products"
              className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-gray-900">
                  Your Products
                </h2>

                <p className="mt-1 text-gray-500">
                  {cart.length} {cart.length === 1 ? "product" : "products"} in
                  your cart
                </p>
              </div>

              {cart.map((item) => (
                <div
                  key={String(item.product.id)}
                  className="card overflow-hidden"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                    <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-indigo-50 to-violet-100 sm:w-32">
                      {item.product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag size={40} className="text-indigo-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                        {item.product.category}
                      </p>

                      <h3 className="mt-1 text-lg font-black text-gray-900">
                        {item.product.title}
                      </h3>

                      <p className="mt-2 text-lg font-black text-gray-900">
                        ₹{Number(item.product.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(item.product.id, item.quantity)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                        aria-label={`Decrease quantity of ${item.product.title}`}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(item.product.id, item.quantity)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                        aria-label={`Increase quantity of ${item.product.title}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      aria-label={`Remove ${item.product.title}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card h-fit p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-black text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span className="font-semibold text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>

                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>

                    <span className="text-2xl font-black text-indigo-600">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/#products"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
