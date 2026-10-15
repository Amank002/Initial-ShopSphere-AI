"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
} from "lucide-react";

import { getOrders, Order } from "@/lib/orders";
import { getProducts } from "@/lib/catalog";
import { Product } from "@/lib/types";

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(getOrders());
      setProducts(getProducts() as Product[]);
      setLoaded(true);
    }, 0);

    const refreshData = () => {
      setOrders(getOrders());
      setProducts(getProducts() as Product[]);
    };

    window.addEventListener("orders-updated", refreshData);
    window.addEventListener("products-updated", refreshData);
    window.addEventListener("shopsphere-sync", refreshData);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("orders-updated", refreshData);
      window.removeEventListener("products-updated", refreshData);
      window.removeEventListener("shopsphere-sync", refreshData);
    };
  }, []);

  const analytics = useMemo(() => {
    const revenue = orders.reduce(
      (total, order) => total + Number(order.total || 0),
      0,
    );

    const averageOrder = orders.length > 0 ? revenue / orders.length : 0;

    const uniqueCustomers = new Set(
      orders
        .map((order) => order.customer.email.trim().toLowerCase())
        .filter(Boolean),
    ).size;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered",
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.status !== "Delivered",
    ).length;

    const productSales = new Map<
      string,
      {
        product: Product;
        quantity: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.product.id);
        const existing = productSales.get(key);

        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += Number(item.price || 0) * item.quantity;
        } else {
          productSales.set(key, {
            product: item.product,
            quantity: item.quantity,
            revenue: Number(item.price || 0) * item.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const categorySales = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product.category || "Other";

        categorySales.set(
          category,
          (categorySales.get(category) || 0) +
            Number(item.price || 0) * item.quantity,
        );
      });
    });

    const categories = Array.from(categorySales.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();

      date.setMonth(date.getMonth() - (5 - index));

      const month = date.toLocaleDateString("en-IN", {
        month: "short",
      });

      const year = date.getFullYear();
      const monthNumber = date.getMonth();

      const revenueForMonth = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);

          return (
            orderDate.getMonth() === monthNumber &&
            orderDate.getFullYear() === year
          );
        })
        .reduce((total, order) => total + Number(order.total || 0), 0);

      return {
        month,
        revenue: revenueForMonth,
      };
    });

    return {
      revenue,
      averageOrder,
      uniqueCustomers,
      deliveredOrders,
      pendingOrders,
      topProducts,
      categories,
      monthlyRevenue,
    };
  }, [orders]);

  const maxMonthlyRevenue = Math.max(
    ...analytics.monthlyRevenue.map((item) => item.revenue),
    1,
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-12">
          <div className="card mx-auto max-w-3xl p-10 text-center">
            <BarChart3 className="mx-auto h-12 w-12 animate-pulse text-gray-300" />

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Loading analytics...
            </h1>

            <p className="mt-2 text-gray-500">
              Preparing your business insights.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-app py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              Analytics
            </h1>

            <p className="mt-1 text-gray-500">
              Monitor sales, customers, products and business performance.
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Total Revenue
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  ₹{analytics.revenue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-green-600">
              <TrendingUp className="h-4 w-4" />
              Revenue generated
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  {orders.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-500">
              {analytics.deliveredOrders} delivered
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Customers</p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  {analytics.uniqueCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-500">
              Unique customers
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Average Order
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  ₹{Math.round(analytics.averageOrder).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-500">
              Per order
            </p>
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-950">
              Revenue Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Revenue generated over the last six months.
            </p>
          </div>

          <div className="flex h-72 items-end gap-3 border-b border-gray-100 px-2">
            {analytics.monthlyRevenue.map((item) => {
              const height =
                item.revenue > 0
                  ? Math.max((item.revenue / maxMonthlyRevenue) * 100, 8)
                  : 4;

              return (
                <div
                  key={`${item.month}-${item.revenue}`}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center">
                    <span className="text-xs font-bold text-gray-600">
                      {item.revenue > 0
                        ? `₹${item.revenue.toLocaleString("en-IN")}`
                        : "₹0"}
                    </span>
                  </div>

                  <div
                    className="w-full rounded-t-xl bg-linear-to-t from-violet-600 to-indigo-400 transition-all duration-500"
                    style={{ height: `${height}%` }}
                    title={`${item.month}: ₹${item.revenue.toLocaleString(
                      "en-IN",
                    )}`}
                  />

                  <p className="mt-3 text-center text-xs font-bold text-gray-400">
                    {item.month}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Two Column Analytics */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Products */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-950">
                  Top Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Best-performing products by revenue.
                </p>
              </div>

              <Package className="h-6 w-6 text-gray-400" />
            </div>

            {analytics.topProducts.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-gray-300" />

                <p className="mt-3 text-sm font-semibold text-gray-500">
                  No product sales yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topProducts.map((item, index) => (
                  <div
                    key={String(item.product.id)}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-black text-gray-600">
                      {index + 1}
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-gray-900">
                        {item.product.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.quantity} unit
                        {item.quantity !== 1 ? "s" : ""} sold
                      </p>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${
                              (item.revenue /
                                analytics.topProducts[0].revenue) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="shrink-0 font-black text-gray-900">
                      ₹{item.revenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Category Performance */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-gray-950">
                Category Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Revenue contribution by category.
              </p>
            </div>

            {analytics.categories.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />

                <p className="mt-3 text-sm font-semibold text-gray-500">
                  No category sales yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {analytics.categories.map((category) => {
                  const percentage =
                    (category.revenue / analytics.revenue) * 100;

                  return (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold capitalize text-gray-700">
                          {category.name}
                        </span>

                        <span className="text-sm font-black text-gray-900">
                          ₹{category.revenue.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-violet-600 to-indigo-400"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-right text-xs font-semibold text-gray-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Order Status */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-950">Order Status</h2>

            <p className="mt-1 text-sm text-gray-500">
              Current order fulfillment overview.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Confirmed",
              "Packed",
              "Shipped",
              "Out for Delivery",
              "Delivered",
            ].map((status) => {
              const count = orders.filter(
                (order) => order.status === status,
              ).length;

              return (
                <div
                  key={status}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="text-sm font-semibold text-gray-500">
                    {status}
                  </p>

                  <p className="mt-2 text-2xl font-black text-gray-950">
                    {count}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">
              Pending fulfillment
            </span>

            <span className="font-black text-gray-950">
              {analytics.pendingOrders} order
              {analytics.pendingOrders !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        {/* Inventory Summary */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-950">
              Catalog Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current product catalog overview.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-500">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-black text-gray-950">
                {products.length}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-500">Categories</p>

              <p className="mt-2 text-2xl font-black text-gray-950">
                {new Set(products.map((product) => product.category)).size}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-500">
                Revenue / Order
              </p>

              <p className="mt-2 text-2xl font-black text-gray-950">
                ₹{Math.round(analytics.averageOrder).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-500">
                Conversion Orders
              </p>

              <p className="mt-2 text-2xl font-black text-gray-950">
                {orders.length}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
