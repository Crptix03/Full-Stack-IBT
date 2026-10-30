import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function BookingDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <SkeletonText className="w-28 mb-6" />

      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <div className="flex justify-between mb-6">
          <div className="space-y-2">
            <SkeletonBox className="w-40 h-7" />
            <SkeletonText className="w-28" />
          </div>
          <SkeletonBox className="w-24 h-7 rounded-full" />
        </div>

        {/* Car card */}
        <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl mb-6">
          <SkeletonBox className="w-24 h-20 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-1/3" />
            <SkeletonText className="w-1/4" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <SkeletonBox className="w-4 h-4 mt-1 shrink-0" />
              <div className="flex-1 space-y-1">
                <SkeletonText className="w-16" />
                <SkeletonText className="w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="space-y-2 pt-4 border-t border-neutral-200 mb-6">
          <div className="flex justify-between">
            <SkeletonText className="w-32" />
            <SkeletonText className="w-20" />
          </div>
          <div className="flex justify-between">
            <SkeletonText className="w-24" />
            <SkeletonText className="w-16" />
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200">
            <SkeletonBox className="w-16 h-5" />
            <SkeletonBox className="w-24 h-5" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <SkeletonBox className="w-36 h-11" />
          <SkeletonBox className="w-28 h-11" />
        </div>
      </div>
    </div>
  );
}
