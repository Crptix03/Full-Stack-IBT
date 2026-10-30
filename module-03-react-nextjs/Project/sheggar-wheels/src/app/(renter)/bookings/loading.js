import { SkeletonBox, SkeletonText, SkeletonListItem } from "@/components/Skeleton";

export default function BookingsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <SkeletonBox className="w-44 h-9 mb-2" />
          <SkeletonText className="w-32" />
        </div>
        <SkeletonBox className="w-32 h-10" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonBox key={i} className="w-24 h-9 rounded-full" />
        ))}
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}
