import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import OwnerReplyForm from "@/components/OwnerReplyForm";
import { Star, CheckCircle } from "lucide-react";

export const metadata = { title: "My Reviews" };

export default async function OwnerReviewsPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner/reviews");

  const myReviews = db.reviews
    .filter((r) => r.ownerId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const carById = (id) => db.cars.find((c) => c.id === id);
  const userById = (id) => db.users.find((u) => u.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Reviews</h1>
      <p className="text-neutral-500 text-sm mb-8">
        {myReviews.length} review{myReviews.length === 1 ? "" : "s"} on your cars.
      </p>

      {myReviews.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center text-neutral-500">
          No reviews yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {myReviews.map((review) => {
            const car = carById(review.carId);
            const renter = userById(review.renterId);
            return (
              <li key={review.id} className="p-6 bg-green-50 border border-green-200 rounded-2xl">

                {/* Header — car name + "Review" label */}
                <h3 className="font-bold mb-1 text-green-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {car ? `${car.make} ${car.model}` : "—"}
                </h3>

                {/* Renter name + date */}
                <p className="text-xs text-green-700 mb-3">
                  By {renter?.name || "—"} · {formatDate(review.createdAt.slice(0, 10))}
                </p>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-5 h-5 ${
                        n <= review.rating
                          ? "fill-orange-400 text-orange-400"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-green-800 ml-1">
                    {review.rating} / 5
                  </span>
                </div>

                {/* Review comment */}
                {review.comment && (
                  <p className="text-sm text-green-900 mb-4">{review.comment}</p>
                )}

                {/* Owner reply — shown if exists, form if not */}
                {review.ownerReply ? (
                  <div className="pl-4 border-l-2 border-green-400">
                    <p className="text-xs text-green-700 uppercase tracking-wider mb-1">
                      Your reply
                    </p>
                    <p className="text-sm text-green-900">{review.ownerReply}</p>
                  </div>
                ) : (
                  <OwnerReplyForm reviewId={review.id} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
