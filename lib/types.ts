export type Category = "All" | "Electronics" | "Fashion" | "Home" | "Fitness";

export type Product = {
  id: number;

  title: string;

  category: "Electronics" | "Fashion" | "Home" | "Fitness";

  price: number;

  oldPrice?: number;

  rating: number;

  reviews: number;

  image: string;

  badge?: string;

  description: string;

  tags: string[];
};

export type CartItem = Product & {
  quantity: number;
};
