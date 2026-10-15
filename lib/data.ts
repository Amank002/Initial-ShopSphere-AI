import { Product } from "./types";

export const products: Product[] = [
  {
    id: 1,

    title: "AeroSound Pro Headphones",

    category: "Electronics",

    price: 7499,

    oldPrice: 9999,

    rating: 4.7,

    reviews: 284,

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",

    badge: "Best Seller",

    description:
      "Premium wireless headphones with adaptive noise cancellation, 40-hour battery life and spatial audio.",

    tags: ["audio", "wireless", "headphones", "work"],
  },

  {
    id: 2,

    title: "Nimbus Smart Watch",

    category: "Electronics",

    price: 6299,

    oldPrice: 7999,

    rating: 4.6,

    reviews: 192,

    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",

    badge: "Trending",

    description:
      "Minimal smartwatch with health tracking, notifications, GPS and a bright AMOLED display.",

    tags: ["watch", "fitness", "smart", "wearable"],
  },

  {
    id: 3,

    title: "Urban Flex Sneakers",

    category: "Fashion",

    price: 3499,

    oldPrice: 4299,

    rating: 4.5,

    reviews: 417,

    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",

    badge: "20% Off",

    description:
      "Lightweight everyday sneakers designed for city walking and casual outfits.",

    tags: ["shoes", "sneakers", "casual", "walking"],
  },

  {
    id: 4,

    title: "Luma Desk Lamp",

    category: "Home",

    price: 1899,

    rating: 4.4,

    reviews: 126,

    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",

    description:
      "Dimmable LED desk lamp with warm and cool modes and a clean modern silhouette.",

    tags: ["lamp", "desk", "home", "office"],
  },

  {
    id: 5,

    title: "CoreFit Training Mat",

    category: "Fitness",

    price: 1599,

    oldPrice: 1999,

    rating: 4.8,

    reviews: 309,

    image:
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",

    badge: "Top Rated",

    description:
      "Non-slip, joint-friendly exercise mat for yoga, stretching, mobility and home workouts.",

    tags: ["fitness", "yoga", "workout", "mat"],
  },

  {
    id: 6,

    title: "Orbit Mechanical Keyboard",

    category: "Electronics",

    price: 4999,

    rating: 4.8,

    reviews: 221,

    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",

    description:
      "Compact mechanical keyboard with hot-swappable switches, RGB lighting and USB-C.",

    tags: ["keyboard", "coding", "gaming", "office"],
  },

  {
    id: 7,

    title: "Cloud Knit Hoodie",

    category: "Fashion",

    price: 2199,

    rating: 4.3,

    reviews: 98,

    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",

    description:
      "Soft everyday hoodie with a relaxed fit, breathable knit and minimal branding.",

    tags: ["hoodie", "fashion", "casual", "winter"],
  },

  {
    id: 8,

    title: "Nordic Storage Rack",

    category: "Home",

    price: 2799,

    rating: 4.5,

    reviews: 74,

    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",

    description:
      "Space-saving storage rack for bedrooms, home offices and compact apartments.",

    tags: ["storage", "home", "office", "organizer"],
  },
];

export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Fitness",
] as const;
