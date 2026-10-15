"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const ADMIN_AUTH_KEY = "shopsphere-admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem(ADMIN_AUTH_KEY) === "true";

    if (authenticated) {
      router.replace("/admin");
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const validEmail = "admin@shopsphere.ai";
      const validPassword = "admin123";

      if (
        email.trim().toLowerCase() === validEmail &&
        password === validPassword
      ) {
        if (rememberMe) {
          localStorage.setItem(ADMIN_AUTH_KEY, "true");
        } else {
          sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
        }

        router.push("/admin");
        return;
      }

      setLoading(false);
      setError("Invalid admin email or password.");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-violet-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Branding Panel */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-violet-600/30 via-indigo-600/20 to-transparent" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="text-xl font-black text-white">
                    ShopSphere <span className="text-violet-400">AI</span>
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Admin Console
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-violet-200">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Admin Access
                </div>

                <h1 className="text-5xl font-black leading-tight tracking-tight text-white xl:text-6xl">
                  Manage your
                  <span className="block text-violet-400">store smarter.</span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
                  Manage products, orders, customers and business analytics from
                  one professional ShopSphere AI dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-white/40">
              <span>Products</span>
              <span>Orders</span>
              <span>Customers</span>
              <span>Analytics</span>
            </div>
          </div>
        </section>

        {/* Login Panel */}
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <p className="text-xl font-black text-gray-950">
                ShopSphere <span className="text-violet-600">AI</span>
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-gray-950">
                Welcome back
              </h2>

              <p className="mt-2 text-gray-500">
                Sign in to access the admin dashboard.
              </p>
            </div>

            {/* Login Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="admin@shopsphere.ai"
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 accent-violet-600"
                    />
                    Remember me
                  </label>

                  <span className="text-xs font-semibold text-gray-400">
                    Demo account
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-bold text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-500">
                  Demo Credentials
                </p>

                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-bold">Email:</span>{" "}
                    admin@shopsphere.ai
                  </p>

                  <p className="text-gray-700">
                    <span className="font-bold">Password:</span> admin123
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-gray-400">
              ShopSphere AI frontend demo · Authentication is simulated locally.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
