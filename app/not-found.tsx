import Link from "next/link";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-gray-50">
      <div className="container-app flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
            <Sparkles size={38} />
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
            Error 404
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
            We couldn&apos;t find that page
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            The page you&apos;re looking for may have been moved, removed, or
            the address may be incorrect.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white transition hover:bg-indigo-700"
            >
              <Home size={18} />
              Go Home
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <Search size={18} />
              Browse Products
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-sm font-bold text-gray-700">
              Looking for something specific?
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
              <Link
                href="/products"
                className="font-semibold text-gray-500 transition hover:text-indigo-600"
              >
                All Products
              </Link>

              <Link
                href="/wishlist"
                className="font-semibold text-gray-500 transition hover:text-indigo-600"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="font-semibold text-gray-500 transition hover:text-indigo-600"
              >
                Cart
              </Link>

              <Link
                href="/orders"
                className="font-semibold text-gray-500 transition hover:text-indigo-600"
              >
                Orders
              </Link>

              <Link
                href="/profile"
                className="font-semibold text-gray-500 transition hover:text-indigo-600"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
