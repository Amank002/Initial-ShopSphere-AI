"use client";

import Link from "next/link";
import { Camera, Code2, Globe, MessageCircle, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="container-app py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="ShopSphere AI home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Sparkles size={22} />
              </div>

              <span className="text-xl font-black text-white">
                ShopSphere <span className="text-indigo-400">AI</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              A personalized e-commerce experience designed to help you discover
              products that fit the way you shop.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <a
                href="mailto:support@shopsphere.ai"
                aria-label="Contact ShopSphere"
                className="flex size-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 transition hover:bg-indigo-600 hover:text-white"
              >
                <MessageCircle size={18} />
              </a>

              <Link
                href="/products"
                aria-label="Explore products"
                className="flex size-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 transition hover:bg-indigo-600 hover:text-white"
              >
                <Globe size={18} />
              </Link>

              <a
                href="mailto:support@shopsphere.ai?subject=Feedback"
                aria-label="Send feedback"
                className="flex size-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 transition hover:bg-indigo-600 hover:text-white"
              >
                <Camera size={18} />
              </a>

              <Link
                href="/admin"
                aria-label="Admin dashboard"
                className="flex size-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 transition hover:bg-indigo-600 hover:text-white"
              >
                <Code2 size={18} />
              </Link>
            </div>
          </div>

          <nav aria-label="Shop links">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Shop
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/products"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                All Products
              </Link>
              <Link
                href="/search"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Search
              </Link>
              <Link
                href="/wishlist"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Shopping Cart
              </Link>
            </div>
          </nav>

          <nav aria-label="Account links">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Account
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/profile"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                My Profile
              </Link>
              <Link
                href="/orders"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                My Orders
              </Link>
              <Link
                href="/checkout"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Checkout
              </Link>
              <Link
                href="/admin"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Admin
              </Link>
            </div>
          </nav>

          <nav aria-label="Support links">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Support
            </h3>

            <div className="mt-5 space-y-3">
              <a
                href="mailto:support@shopsphere.ai?subject=Help%20Center"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Help Center
              </a>
              <a
                href="mailto:support@shopsphere.ai?subject=Shipping"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Shipping
              </a>
              <a
                href="mailto:support@shopsphere.ai?subject=Returns"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Returns
              </a>
              <a
                href="mailto:support@shopsphere.ai"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Contact Us
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-app flex flex-col gap-4 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ShopSphere AI. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <a
              href="mailto:support@shopsphere.ai?subject=Privacy"
              className="transition hover:text-gray-300"
            >
              Privacy
            </a>
            <a
              href="mailto:support@shopsphere.ai?subject=Terms"
              className="transition hover:text-gray-300"
            >
              Terms
            </a>
            <a
              href="mailto:support@shopsphere.ai?subject=Cookies"
              className="transition hover:text-gray-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
