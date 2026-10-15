"use client";

import { Product } from "@/lib/types";

const ORDERS_KEY = "shopsphere-orders";

export type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type OrderStatus =
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  deliveryMethod: string;
  paymentMethod: string;

  status: OrderStatus;

  createdAt: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getOrders(): Order[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const storedOrders = localStorage.getItem(ORDERS_KEY);

    if (!storedOrders) {
      return [];
    }

    const parsedOrders = JSON.parse(storedOrders);

    if (!Array.isArray(parsedOrders)) {
      return [];
    }

    return parsedOrders;
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  window.dispatchEvent(new Event("orders-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
  const order: Order = {
    ...orderData,
    id: `SS-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const orders = getOrders();

  saveOrders([order, ...orders]);

  return order;
}

export function getOrderById(orderId: string): Order | null {
  const orders = getOrders();

  return orders.find((order) => order.id === orderId) ?? null;
}

export function clearOrders(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(ORDERS_KEY);

  window.dispatchEvent(new Event("orders-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}
