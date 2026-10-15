"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Store,
  Bell,
  Shield,
  Palette,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("ShopSphere AI");
  const [storeEmail, setStoreEmail] = useState("admin@shopsphere.ai");
  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem(
      "shopsphere-admin-settings",
      JSON.stringify({
        storeName,
        storeEmail,
        currency,
        notifications,
        orderAlerts,
        lowStockAlerts,
      }),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
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
              Settings
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your ShopSphere AI store preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="rounded-xl bg-gray-950 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />

                <span className="text-sm font-bold">General Settings</span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500">
                <Store className="h-5 w-5" />
                Store
              </div>

              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500">
                <Bell className="h-5 w-5" />
                Notifications
              </div>

              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500">
                <Shield className="h-5 w-5" />
                Security
              </div>

              <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500">
                <Palette className="h-5 w-5" />
                Appearance
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Store className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Store Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Configure your basic store information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="storeName"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Store Name
                  </label>

                  <input
                    id="storeName"
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="storeEmail"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Store Email
                  </label>

                  <input
                    id="storeEmail"
                    type="email"
                    value={storeEmail}
                    onChange={(event) => setStoreEmail(event.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Currency
                  </label>

                  <select
                    id="currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Bell className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Control which store alerts are enabled.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <label className="flex cursor-pointer items-center justify-between gap-6">
                  <div>
                    <p className="font-bold text-gray-900">
                      Enable notifications
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Receive important store notifications.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(event) => setNotifications(event.target.checked)}
                    className="h-5 w-5 accent-indigo-600"
                  />
                </label>

                <div className="h-px bg-gray-100" />

                <label className="flex cursor-pointer items-center justify-between gap-6">
                  <div>
                    <p className="font-bold text-gray-900">New order alerts</p>

                    <p className="mt-1 text-sm text-gray-500">
                      Get notified when a customer places an order.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={orderAlerts}
                    onChange={(event) => setOrderAlerts(event.target.checked)}
                    className="h-5 w-5 accent-indigo-600"
                  />
                </label>

                <div className="h-px bg-gray-100" />

                <label className="flex cursor-pointer items-center justify-between gap-6">
                  <div>
                    <p className="font-bold text-gray-900">Low-stock alerts</p>

                    <p className="mt-1 text-sm text-gray-500">
                      Show alerts when products need attention.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={lowStockAlerts}
                    onChange={(event) =>
                      setLowStockAlerts(event.target.checked)
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />
                </label>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <Shield className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">Security</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Frontend demo security settings.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-bold text-amber-900">Demo Mode</p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  This ShopSphere AI project currently uses frontend-only
                  authentication and localStorage. No real passwords, payment
                  credentials, or sensitive authentication data should be stored
                  here.
                </p>
              </div>
            </section>

            {/* Appearance */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                  <Palette className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-950">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    ShopSphere AI interface appearance.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-gray-950 bg-gray-50 p-4">
                  <div className="h-20 rounded-lg bg-white shadow-sm" />

                  <p className="mt-3 font-bold text-gray-900">Light</p>

                  <p className="text-sm text-gray-500">Current theme</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-950 p-4 opacity-60">
                  <div className="h-20 rounded-lg bg-gray-800" />

                  <p className="mt-3 font-bold text-white">Dark</p>

                  <p className="text-sm text-gray-400">Coming later</p>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {saved && (
                <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Settings saved successfully
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
