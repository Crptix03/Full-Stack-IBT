import { SkeletonBox, SkeletonText, SkeletonStatCard, SkeletonListItem } from "@/components/Skeleton";

export default function OwnerDashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <SkeletonBox className="w-56 h-9 mb-2" />
          <SkeletonText className="w-36" />
        </div>
        <SkeletonBox className="w-28 h-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((col) => (
          <div key={col} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
            {[...Array(3)].map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
