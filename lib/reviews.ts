"use client";

export type ProductReview = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

const REVIEWS_KEY = "shopsphere-product-reviews";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getReviews(): ProductReview[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(REVIEWS_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function getProductReviews(productId: string | number): ProductReview[] {
  const normalizedId = String(productId);

  return getReviews().filter(
    (review) => String(review.productId) === normalizedId,
  );
}

export function addReview(
  reviewData: Omit<ProductReview, "id" | "createdAt">,
): ProductReview {
  if (!isBrowser()) {
    throw new Error("Reviews can only be added in the browser.");
  }

  const review: ProductReview = {
    ...reviewData,
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const reviews = getReviews();

  const updatedReviews = [review, ...reviews];

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

  window.dispatchEvent(new Event("reviews-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));

  return review;
}

export function deleteReview(reviewId: string): void {
  if (!isBrowser()) {
    return;
  }

  const reviews = getReviews();

  const updatedReviews = reviews.filter((review) => review.id !== reviewId);

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

  window.dispatchEvent(new Event("reviews-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}

export function getAverageRating(productId: string | number): number {
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return Number((total / reviews.length).toFixed(1));
}

export function getRatingDistribution(
  productId: string | number,
): Record<number, number> {
  const reviews = getProductReviews(productId);

  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    if (distribution[review.rating] !== undefined) {
      distribution[review.rating] += 1;
    }
  });

  return distribution;
}

export function clearReviews(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(REVIEWS_KEY);

  window.dispatchEvent(new Event("reviews-updated"));
  window.dispatchEvent(new Event("shopsphere-sync"));
}
