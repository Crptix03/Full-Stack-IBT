import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function OwnerReviewsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SkeletonBox className="w-36 h-9 mb-2" />
      <SkeletonText className="w-48 mb-8" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex justify-between mb-3">
              <div className="space-y-2">
                <SkeletonBox className="w-40 h-5" />
                <SkeletonText className="w-32" />
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <SkeletonBox key={s} className="w-5 h-5 rounded" />
                ))}
              </div>
            </div>
            <SkeletonText className="w-full mb-2" />
            <SkeletonText className="w-4/5 mb-4" />
            <SkeletonBox className="w-36 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
