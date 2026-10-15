import { products } from "./data";

export async function fetchProducts() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return products;
}
