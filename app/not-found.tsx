import Link from "next/link";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ShoppingBag size={38} />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Explore
          our products and discover something you love.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-800 transition hover:bg-gray-50"
          >
            <Search size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
