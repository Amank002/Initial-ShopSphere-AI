"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const ADMIN_AUTH_KEY = "shopsphere-admin-auth";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let isAuthenticated = false;

      try {
        isAuthenticated =
          localStorage.getItem(ADMIN_AUTH_KEY) === "true" ||
          sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
      } catch {
        isAuthenticated = false;
      }

      setAuthenticated(isAuthenticated);
      setCheckingAuth(false);

      if (isLoginPage && isAuthenticated) {
        router.replace("/admin");
        return;
      }

      if (!isLoginPage && !isAuthenticated) {
        router.replace("/admin/login");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isLoginPage, router]);

  function handleLogout() {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } finally {
      setAuthenticated(false);
      router.replace("/admin/login");
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/30">
            <span className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>

          <h1 className="mt-5 text-xl font-black text-white">ShopSphere AI</h1>

          <p className="mt-2 text-sm text-white/60">
            Verifying admin access...
          </p>
        </div>
      </main>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-sm text-white/70">Redirecting to admin login...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin navigation */}
      <header className="sticky top-18 z-40 border-b border-gray-200 bg-white">
        <div className="container-app">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <nav
              aria-label="Admin navigation"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
            >
              {navigation.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-violet-950 text-white shadow-md"
                        : "bg-transparent text-white-900 hover:bg-violet-100"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 sm:px-4"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div>{children}</div>
    </div>
  );
}
