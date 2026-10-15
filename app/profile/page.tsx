"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Heart,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { getOrders, Order } from "@/lib/orders";
import { getWishlist } from "@/lib/store";

const PROFILE_KEY = "shopsphere-profile";

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const defaultProfile: ProfileData = {
  firstName: "ShopSphere",
  lastName: "Customer",
  email: "customer@shopsphere.ai",
  phone: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const [formData, setFormData] = useState<ProfileData>(defaultProfile);

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let savedProfile = defaultProfile;

      try {
        const storedProfile = localStorage.getItem(PROFILE_KEY);

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);

          if (parsedProfile && typeof parsedProfile === "object") {
            savedProfile = {
              ...defaultProfile,
              ...parsedProfile,
            };
          }
        }
      } catch {
        savedProfile = defaultProfile;
      }

      setProfile(savedProfile);
      setFormData(savedProfile);
      setOrders(getOrders());
      setWishlistCount(getWishlist().length);
      setLoaded(true);
    }, 0);

    const refreshProfileData = () => {
      setOrders(getOrders());
      setWishlistCount(getWishlist().length);
    };

    window.addEventListener("orders-updated", refreshProfileData);

    window.addEventListener("wishlist-updated", refreshProfileData);

    window.addEventListener("shopsphere-sync", refreshProfileData);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("orders-updated", refreshProfileData);

      window.removeEventListener("wishlist-updated", refreshProfileData);

      window.removeEventListener("shopsphere-sync", refreshProfileData);
    };
  }, []);

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  const latestOrder = orders[0];

  const handleEdit = () => {
    setFormData(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim()) {
      return;
    }

    setSaving(true);

    const updatedProfile: ProfileData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

    setTimeout(() => {
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setSaving(false);
      setEditing(false);

      window.dispatchEvent(new Event("profile-updated"));

      window.dispatchEvent(new Event("shopsphere-sync"));
    }, 300);
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container-app py-12">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-100" />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="container-app py-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            <User className="h-3.5 w-3.5" />
            My Account
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Welcome, {profile.firstName}
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your profile, orders, wishlist, and account preferences.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-black backdrop-blur">
                {profile.firstName.charAt(0).toUpperCase()}
                {profile.lastName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 text-sm text-indigo-100">{profile.email}</p>

                {profile.phone && (
                  <p className="mt-1 text-sm text-indigo-100">
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Edit Profile
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {editing && (
          <div className="mt-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-950">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your ShopSphere account information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                aria-label="Close profile editor"
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="profile-first-name"
                  className="text-sm font-bold text-gray-700"
                >
                  First Name
                </label>

                <input
                  id="profile-first-name"
                  type="text"
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      firstName: event.target.value,
                    })
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-last-name"
                  className="text-sm font-bold text-gray-700"
                >
                  Last Name
                </label>

                <input
                  id="profile-last-name"
                  type="text"
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      lastName: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="text-sm font-bold text-gray-700"
                >
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="text-sm font-bold text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      phone: event.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !formData.firstName.trim() ||
                    !formData.email.trim()
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
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

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Package size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Wishlist</p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  {wishlistCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Heart size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Total Spent
                </p>

                <p className="mt-2 text-3xl font-black text-gray-950">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShoppingBag size={23} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-gray-950">Account</h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly access your ShopSphere account features.
            </p>

            <div className="mt-5 divide-y divide-gray-100">
              <Link
                href="/orders"
                className="flex items-center justify-between py-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Package size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">My Orders</p>

                    <p className="text-sm text-gray-500">
                      Track and manage your purchases
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between py-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Heart size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Wishlist</p>

                    <p className="text-sm text-gray-500">View saved products</p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </Link>

              <Link
                href="/checkout"
                className="flex items-center justify-between py-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Checkout</p>

                    <p className="text-sm text-gray-500">
                      Continue with your shopping
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between py-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShoppingBag size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">Continue Shopping</p>

                    <p className="text-sm text-gray-500">
                      Discover more products
                    </p>
                  </div>
                </div>

                <ChevronRight size={19} className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* SECURITY */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black text-gray-950">
              Account Security
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your ShopSphere profile is stored locally for this frontend
              demonstration.
            </p>

            <div className="mt-5 rounded-2xl bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">Demo Mode</p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                No real passwords or sensitive authentication information should
                be stored in this demo.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-950">Recent Order</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest shopping activity.
              </p>
            </div>

            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All Orders
              <ArrowRight size={16} />
            </Link>
          </div>

          {latestOrder ? (
            <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {latestOrder.id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(latestOrder.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {latestOrder.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-black text-gray-950">
                    ₹{Number(latestOrder.total).toLocaleString("en-IN")}
                  </p>
                </div>

                <Link
                  href={`/orders/${latestOrder.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  View Order
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <Package size={28} className="mx-auto text-gray-400" />

              <p className="mt-3 font-bold text-gray-900">No orders yet</p>

              <p className="mt-1 text-sm text-gray-500">
                Your completed purchases will appear here.
              </p>

              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Start Shopping
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Bell size={20} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900">Notifications</p>

                <p className="text-sm text-gray-500">
                  Manage shopping alerts and updates.
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Settings size={20} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900">Preferences</p>

                <p className="text-sm text-gray-500">
                  Manage your ShopSphere experience.
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
