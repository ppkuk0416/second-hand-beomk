"use client";

import { Review } from "@/lib/types";
import { Star } from "lucide-react";

interface ReviewsSectionProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          }
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">실사용 후기</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-yellow-400 font-bold">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">({reviews.length}개)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {review.author[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {review.author}
                  </div>
                  <div className="text-gray-500 text-xs">{review.source}</div>
                </div>
              </div>
              <div className="text-right">
                <StarRating rating={review.rating} />
                <div className="text-gray-500 text-xs mt-0.5">
                  {review.date}
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
