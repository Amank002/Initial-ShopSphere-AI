"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  ShoppingBag,
  IndianRupee,
  Mail,
  Phone,
} from "lucide-react";

import { getOrders, Order } from "@/lib/orders";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
};

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
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

  const customers = useMemo<Customer[]>(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
      const email = order.customer.email.trim().toLowerCase();

      if (!email) return;

      const existing = customerMap.get(email);

      if (existing) {
        existing.orders += 1;
        existing.spent += Number(order.total || 0);

        if (
          new Date(order.createdAt).getTime() >
          new Date(existing.lastOrder).getTime()
        ) {
          existing.lastOrder = order.createdAt;
        }
      } else {
        customerMap.set(email, {
          id: `CUS-${customerMap.size + 1}`,
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          phone: order.customer.phone,
          orders: 1,
          spent: Number(order.total || 0),
          lastOrder: order.createdAt,
        });
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) =>
        new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime(),
    );
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const totalCustomers = customers.length;

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.spent,
    0,
  );

  const averageOrderValue =
    orders.length > 0
      ? orders.reduce((total, order) => total + Number(order.total || 0), 0) /
        orders.length
      : 0;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-12">
          <div className="card mx-auto max-w-3xl p-10 text-center">
            <Users className="mx-auto h-12 w-12 animate-pulse text-gray-300" />

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Loading customers...
            </h1>

            <p className="mt-2 text-gray-500">
              Preparing your customer dashboard.
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Customers
              </h1>

              <p className="mt-1 text-gray-500">
                View customer activity and purchasing information.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Customers
              </p>

              <p className="mt-1 text-2xl font-black text-gray-950">
                {totalCustomers}
              </p>
            </div>
          </div>
        </div>
        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Customers</p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  {totalCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Customer Spending
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Average Order
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  ₹{Math.round(averageOrderValue).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers by name, email or phone..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>
        </section>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Users className="mx-auto h-14 w-14 text-gray-300" />

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              No customers found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {customers.length === 0
                ? "Customers will appear here after an order is placed."
                : "Try changing your search."}
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-black text-gray-950">
                Customer Directory
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredCustomers.length} customer
                {filteredCustomers.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Orders
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Total Spent
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Last Order
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 last:border-b-0 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-sm font-black text-white">
                            {customer.firstName.charAt(0).toUpperCase()}
                            {customer.lastName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-gray-950">
                              {customer.firstName} {customer.lastName}
                            </p>

                            <p className="text-xs text-gray-400">
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {customer.email}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                          {customer.orders}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-black text-gray-950">
                          ₹{customer.spent.toLocaleString("en-IN")}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatDate(customer.lastOrder)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
