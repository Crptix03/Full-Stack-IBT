import { SkeletonBox, SkeletonText, SkeletonStatCard } from "@/components/Skeleton";

export default function AdminOverviewLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBox className="w-48 h-9 mb-2" />
      <SkeletonText className="w-52 mb-8" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white border border-neutral-200 rounded-2xl">
            <div className="flex justify-between mb-2">
              <SkeletonBox className="w-40 h-6" />
              <SkeletonBox className="w-8 h-6 rounded-full" />
            </div>
            <SkeletonText className="w-full mb-4" />
            <SkeletonText className="w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
