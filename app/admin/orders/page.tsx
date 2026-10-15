"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getOrders, saveOrders, Order, OrderStatus } from "@/lib/orders";

const STATUS_OPTIONS: OrderStatus[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(getOrders());
      setLoaded(true);
    }, 0);

    const refreshOrders = () => {
      setOrders(getOrders());
    };

    window.addEventListener("orders-updated", refreshOrders);
    window.addEventListener("shopsphere-sync", refreshOrders);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("orders-updated", refreshOrders);
      window.removeEventListener("shopsphere-sync", refreshOrders);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.firstName.toLowerCase().includes(query) ||
        order.customer.lastName.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed",
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.status === "Shipped" || order.status === "Out for Delivery",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusStyle(status: OrderStatus) {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Packed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Shipped":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Out for Delivery":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-16">
          <div className="card mx-auto max-w-3xl p-10 text-center">
            <Package className="mx-auto h-12 w-12 animate-pulse text-gray-300" />
            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Loading orders...
            </h1>
            <p className="mt-2 text-gray-500">
              Preparing your admin order dashboard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              Orders Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage customer orders and update delivery status.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Revenue
            </p>
            <p className="mt-1 text-2xl font-black text-gray-950">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Confirmed</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {confirmedOrders}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  In Delivery
                </p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {shippedOrders}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Truck className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Delivered</p>
                <p className="mt-2 text-3xl font-black text-gray-950">
                  {deliveredOrders}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order ID, customer or email..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | OrderStatus)
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-700 outline-none focus:border-gray-400"
            >
              <option value="All">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>

        {filteredOrders.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-14 w-14 text-gray-300" />

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              No orders found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {orders.length === 0
                ? "Orders created through checkout will appear here."
                : "Try changing your search or status filter."}
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="p-5">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-gray-100 p-3">
                          <Package className="h-6 w-6 text-gray-700" />
                        </div>

                        <div>
                          <p className="font-black text-gray-950">{order.id}</p>

                          <p className="mt-1 text-sm text-gray-500">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>

                          <p className="text-xs text-gray-400">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-400">
                            ORDERED
                          </p>

                          <p className="text-sm font-bold text-gray-700">
                            {formatDate(order.createdAt)}
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatTime(order.createdAt)}
                          </p>
                        </div>

                        <div className="h-10 w-px bg-gray-200" />

                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-400">
                            TOTAL
                          </p>

                          <p className="text-lg font-black text-gray-950">
                            ₹{Number(order.total).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <select
                          value={order.status}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value as OrderStatus,
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-sm font-bold outline-none ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrder(isExpanded ? null : order.id)
                          }
                          className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50"
                          aria-label={
                            isExpanded ? "Collapse order" : "Expand order"
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5">
                      <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-gray-500">
                            Order Items
                          </h3>

                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={`${order.id}-${item.product.id}-${index}`}
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.product.image}
                                  alt={item.product.title}
                                  className="h-16 w-16 rounded-lg object-cover"
                                />

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
                                  {(
                                    Number(item.price) * item.quantity
                                  ).toLocaleString("en-IN")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer / Delivery */}
                        <div>
                          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-gray-500">
                            Customer & Delivery
                          </h3>

                          <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="font-bold text-gray-900">
                              {order.customer.firstName}{" "}
                              {order.customer.lastName}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {order.customer.email}
                            </p>

                            <p className="text-sm text-gray-500">
                              {order.customer.phone}
                            </p>

                            <div className="my-4 h-px bg-gray-100" />

                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Delivery Address
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-700">
                              {order.address.address}
                              <br />
                              {order.address.city}, {order.address.state}
                              <br />
                              {order.address.pincode}
                            </p>

                            <div className="my-4 h-px bg-gray-100" />

                            <div className="flex justify-between gap-4 text-sm">
                              <span className="text-gray-500">Delivery</span>
                              <span className="font-semibold text-gray-800">
                                {order.deliveryMethod}
                              </span>
                            </div>

                            <div className="mt-2 flex justify-between gap-4 text-sm">
                              <span className="text-gray-500">Payment</span>
                              <span className="font-semibold text-gray-800">
                                {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          View Customer Order
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
