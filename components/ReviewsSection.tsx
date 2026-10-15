"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";

import {
  addReview,
  deleteReview,
  getProductReviews,
  getRatingDistribution,
  ProductReview,
} from "@/lib/reviews";

type ReviewsSectionProps = {
  productId: string | number;
};

const emptyDistribution: Record<number, number> = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCurrentReviews = () => {
      const productReviews = getProductReviews(productId);

      setReviews(productReviews);
    };

    const timer = setTimeout(() => {
      loadCurrentReviews();
      setLoaded(true);
    }, 0);

    const handleReviewsUpdated = () => {
      loadCurrentReviews();
    };

    window.addEventListener("reviews-updated", handleReviewsUpdated);

    window.addEventListener("shopsphere-sync", handleReviewsUpdated);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("reviews-updated", handleReviewsUpdated);

      window.removeEventListener("shopsphere-sync", handleReviewsUpdated);
    };
  }, [productId]);

  const distribution = loaded
    ? getRatingDistribution(productId)
    : emptyDistribution;

  const averageRating =
    reviews.length > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1),
        )
      : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !title.trim() || !comment.trim()) {
      return;
    }

    setSubmitting(true);

    addReview({
      productId: String(productId),
      name: name.trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    setName("");
    setTitle("");
    setComment("");
    setRating(5);
    setSubmitting(false);

    setReviews(getProductReviews(productId));
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);

    setReviews(getProductReviews(productId));
  };

  if (!loaded) {
    return (
      <section className="container-app py-12">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-gray-200" />

        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-100" />
      </section>
    );
  }

  return (
    <section className="container-app py-12">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          Customer Reviews
        </div>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
          Reviews & Ratings
        </h2>

        <p className="mt-1.5 text-sm text-gray-500 md:text-base">
          See what shoppers think about this product.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="text-5xl font-black text-gray-950">
              {averageRating || "—"}
            </div>

            <div className="mt-2 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={
                    index < Math.round(averageRating)
                      ? "h-5 w-5 fill-amber-400 text-amber-400"
                      : "h-5 w-5 text-gray-300"
                  }
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="mt-7 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] ?? 0;

              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8 font-semibold text-gray-600">
                    {star} ★
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="w-6 text-right text-xs text-gray-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageSquare size={20} />
            </div>

            <div>
              <h3 className="font-black text-gray-950">Write a Review</h3>

              <p className="text-sm text-gray-500">
                Share your experience with other shoppers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-bold text-gray-700">
                Your Rating
              </label>

              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starValue = index + 1;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      aria-label={`Rate ${starValue} out of 5`}
                      className="rounded-md p-1 transition hover:bg-amber-50"
                    >
                      <Star
                        className={
                          starValue <= rating
                            ? "h-6 w-6 fill-amber-400 text-amber-400"
                            : "h-6 w-6 text-gray-300"
                        }
                      />
                    </button>
                  );
                })}

                <span className="ml-2 text-sm font-semibold text-gray-500">
                  {rating}/5
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor={`review-name-${productId}`}
                className="text-sm font-bold text-gray-700"
              >
                Name
              </label>

              <input
                id={`review-name-${productId}`}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor={`review-title-${productId}`}
                className="text-sm font-bold text-gray-700"
              >
                Review Title
              </label>

              <input
                id={`review-title-${productId}`}
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Summarize your experience"
                required
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor={`review-comment-${productId}`}
                className="text-sm font-bold text-gray-700"
              >
                Your Review
              </label>

              <textarea
                id={`review-comment-${productId}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell other shoppers about this product..."
                required
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={
                submitting || !name.trim() || !title.trim() || !comment.trim()
              }
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-950">
            Customer Feedback
          </h3>

          <span className="text-sm text-gray-500">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
              <MessageSquare size={24} />
            </div>

            <h4 className="mt-4 font-black text-gray-900">No reviews yet</h4>

            <p className="mt-1 text-sm text-gray-500">
              Be the first shopper to review this product.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
                        {review.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">{review.name}</p>

                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    aria-label={`Delete review by ${review.name}`}
                    className="self-start rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < review.rating
                          ? "h-4 w-4 fill-amber-400 text-amber-400"
                          : "h-4 w-4 text-gray-300"
                      }
                    />
                  ))}
                </div>

                <h4 className="mt-3 font-black text-gray-900">
                  {review.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
