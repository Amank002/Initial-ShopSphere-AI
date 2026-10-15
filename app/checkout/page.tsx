"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, CreditCard, ShoppingBag } from "lucide-react";

import { CartItem, getCart, clearCart } from "@/lib/store";

import { createOrder } from "@/lib/orders";

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const initialForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  const [formData, setFormData] = useState<CheckoutForm>(initialForm);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(getCart());
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
  }, [cart]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0) {
      return;
    }

    const nameParts = formData.name.trim().split(/\s+/).filter(Boolean);

    const firstName = nameParts[0] || "Customer";

    const lastName = nameParts.slice(1).join(" ") || "";

    const order = createOrder({
      items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: Number(item.product.price),
      })),

      total,

      customer: {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      },

      address: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },

      deliveryMethod: "Standard Delivery",

      paymentMethod: "Mock Payment",

      status: "Confirmed",
    });

    setOrderId(order.id);
    setOrderTotal(total);
    setOrderPlaced(true);

    clearCart();
    setCart([]);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-linear-to-r from-indigo-600 to-violet-600 text-white">
          <div className="container-app py-10">
            <h1 className="text-4xl font-black">Order Confirmed</h1>

            <p className="mt-2 text-indigo-100">
              Your ShopSphere order has been placed successfully.
            </p>
          </div>
        </section>

        <section className="container-app py-16">
          <div className="card mx-auto max-w-2xl p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={44} className="text-green-600" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-900">
              Thank you for your order!
            </h2>

            <p className="mt-3 text-gray-500">
              Your order has been successfully placed.
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-500">Order ID</p>

              <p className="mt-1 text-xl font-black text-gray-900">{orderId}</p>
            </div>

            <div className="mx-auto mt-4 max-w-sm rounded-2xl bg-indigo-50 p-5">
              <p className="text-sm font-semibold text-gray-500">Order Total</p>

              <p className="mt-1 text-3xl font-black text-indigo-600">
                ₹{orderTotal.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              This is a simulated frontend order. No real payment has been
              processed.
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
              >
                View My Orders
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Continue Shopping →
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-linear-to-br from-indigo-600 to-violet-600 text-white">
          <div className="container-app py-10">
            <h1 className="text-4xl font-black">Checkout</h1>
          </div>
        </section>

        <section className="container-app py-16">
          <div className="card mx-auto max-w-2xl p-10 text-center">
            <ShoppingBag size={50} className="mx-auto text-indigo-600" />

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <Link
              href="/#products"
              className="mt-7 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              Explore Products →
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-br from-indigo-600 to-violet-600 text-white">
        <div className="container-app py-10">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-black">Checkout</h1>

          <p className="mt-2 text-indigo-100">
            Complete your details to place your order.
          </p>
        </div>
      </section>

      {/* Checkout */}

      <section className="container-app py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Customer Details */}

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3">
                <CreditCard size={24} className="text-indigo-600" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Delivery Details
                </h2>

                <p className="text-sm text-gray-500">
                  Enter your delivery information.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Pincode */}

              <div>
                <label
                  htmlFor="pincode"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Pincode
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Address */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House no, street, area"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* City */}

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* State */}

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Mock Payment */}

            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex items-start gap-3">
                <CreditCard
                  size={22}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <div>
                  <h3 className="font-black text-indigo-900">Mock Payment</h3>

                  <p className="mt-1 text-sm leading-6 text-indigo-700">
                    This ShopSphere demo uses simulated payment processing. No
                    real card, UPI, or banking information is collected.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-indigo-700"
            >
              Place Order — ₹{total.toLocaleString("en-IN")}
            </button>
          </form>

          {/* Order Summary */}

          <aside className="card h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={String(item.product.id)}
                  className="flex items-center gap-3"
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
                      <ShoppingBag size={24} className="text-indigo-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-gray-900">
                      {item.product.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-gray-900">
                    ₹
                    {(
                      Number(item.product.price) * item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-semibold text-gray-900">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-gray-600">
                <span>Delivery</span>

                <span className="font-bold text-green-600">FREE</span>
              </div>

              <div className="mt-5 flex justify-between border-t pt-5">
                <span className="text-lg font-black text-gray-900">Total</span>

                <span className="text-2xl font-black text-indigo-600">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
