"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Package, ShoppingBag } from "lucide-react";

import { getOrders, Order } from "@/lib/orders";

const statusSteps = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    const timer = window.setTimeout(loadOrders, 0);

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener("orders-updated", handleOrdersUpdated);

    window.addEventListener("shopsphere-sync", handleOrdersUpdated);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("orders-updated", handleOrdersUpdated);

      window.removeEventListener("shopsphere-sync", handleOrdersUpdated);
    };
  }, []);

  const getStatusIndex = (status: Order["status"]) => {
    return statusSteps.indexOf(status);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
        <div className="container-app py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Shopping
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <Package size={28} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                ShopSphere
              </p>

              <h1 className="text-4xl font-black">My Orders</h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-gray-300">
            View your orders, delivery status, and order details.
          </p>
        </div>
      </section>

      <section className="container-app py-10">
        {orders.length === 0 ? (
          <div className="card mx-auto max-w-2xl p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
              <ShoppingBag size={38} className="text-indigo-600" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Your completed orders will appear here after you place your first
              order.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Order History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                  placed
                </p>
              </div>

              <Link
                href="/"
                className="font-bold text-indigo-600 transition hover:text-indigo-700"
              >
                Continue Shopping →
              </Link>
            </div>

            {orders.map((order) => {
              const currentStatusIndex = getStatusIndex(order.status);

              return (
                <article key={order.id} className="card overflow-hidden">
                  <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 font-black text-gray-900">
                        {order.id}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Ordered On
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-black text-indigo-600">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="border-b p-5 sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Delivery Status
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Current status:{" "}
                          <span className="font-bold text-indigo-600">
                            {order.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto pb-2">
                      <div className="flex min-w-162.5 items-start">
                        {statusSteps.map((step, index) => {
                          const completed = index <= currentStatusIndex;

                          const isLast = index === statusSteps.length - 1;

                          return (
                            <div key={step} className="flex flex-1 items-start">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                                    completed
                                      ? "bg-indigo-600 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  {index + 1}
                                </div>

                                <p
                                  className={`mt-2 whitespace-nowrap text-xs font-bold ${
                                    completed
                                      ? "text-indigo-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step}
                                </p>
                              </div>

                              {!isLast && (
                                <div
                                  className={`mt-4 h-1 flex-1 ${
                                    index < currentStatusIndex
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-black text-gray-900">Items</h3>

                      <span className="text-sm text-gray-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={String(item.product.id)}
                          className="flex items-center gap-4"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50">
                            {item.product.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ShoppingBag
                                size={24}
                                className="text-indigo-500"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-gray-900">
                              {item.product.title}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-black text-gray-900">
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-t pt-5">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:w-auto"
                      >
                        View Order Details
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
