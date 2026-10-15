"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getOrderById, Order } from "@/lib/orders";

const statusSteps = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (params?.id) {
        setOrder(getOrderById(String(params.id)));
      }

      setLoaded(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [params]);

  const currentStatusIndex = order ? statusSteps.indexOf(order.status) : -1;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-16">
          <div className="mx-auto max-w-4xl">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-8 h-64 animate-pulse rounded-3xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
          <div className="container-app py-10">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </Link>

            <h1 className="mt-6 text-4xl font-black">Order Not Found</h1>
          </div>
        </section>

        <section className="container-app py-16">
          <div className="card mx-auto max-w-2xl p-12 text-center">
            <Package size={50} className="mx-auto text-gray-300" />

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              We couldn&apos;t find this order
            </h2>

            <p className="mt-2 text-gray-500">
              The order may have been removed or the order ID may be incorrect.
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              View My Orders
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      <section className="bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
        <div className="container-app py-10">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-300">
              Order Details
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{order.id}</h1>

            <p className="mt-2 text-gray-300">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main */}

          <div className="space-y-6">
            {/* Tracking */}

            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Truck size={24} className="text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    Order Tracking
                  </h2>

                  <p className="text-sm text-gray-500">
                    Current status:{" "}
                    <span className="font-bold text-indigo-600">
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {statusSteps.map((step, index) => {
                  const completed = index <= currentStatusIndex;

                  const current = index === currentStatusIndex;

                  return (
                    <div key={step} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full ${
                            completed
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle size={21} />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>

                        {index < statusSteps.length - 1 && (
                          <div
                            className={`mt-1 h-10 w-1 ${
                              index < currentStatusIndex
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`font-black ${
                            completed ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {current
                            ? "Current order status"
                            : index < currentStatusIndex
                              ? "Completed"
                              : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}

            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  Ordered Items
                </h2>

                <span className="text-sm text-gray-500">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-6 divide-y">
                {order.items.map((item) => (
                  <div
                    key={String(item.product.id)}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50">
                      {item.product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag size={28} className="text-indigo-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-gray-900">
                        {item.product.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 font-bold text-indigo-600">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}

          <aside className="space-y-6">
            {/* Summary */}

            <div className="card p-6">
              <h2 className="text-xl font-black text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>

                  <span className="font-semibold text-gray-900">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>

                  <span className="font-bold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="text-lg font-black text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-black text-indigo-600">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery */}

            <div className="card p-6">
              <h2 className="text-xl font-black text-gray-900">
                Delivery Address
              </h2>

              <div className="mt-4 text-sm leading-6 text-gray-600">
                <p className="font-bold text-gray-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>

                <p>{order.address.address}</p>

                <p>
                  {order.address.city}, {order.address.state}
                </p>

                <p>{order.address.pincode}</p>

                <p className="mt-3">{order.customer.phone}</p>

                <p>{order.customer.email}</p>
              </div>
            </div>

            {/* Delivery Method */}

            <div className="card p-6">
              <h2 className="text-xl font-black text-gray-900">
                Delivery & Payment
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Delivery Method</p>

                  <p className="font-bold text-gray-900">
                    {order.deliveryMethod}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Payment Method</p>

                  <p className="font-bold text-gray-900">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Order Created</p>

                  <p className="font-bold text-gray-900">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
