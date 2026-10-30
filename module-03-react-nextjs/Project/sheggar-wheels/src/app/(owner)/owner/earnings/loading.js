import { SkeletonBox, SkeletonText, SkeletonStatCard } from "@/components/Skeleton";

export default function EarningsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <SkeletonBox className="w-36 h-9 mb-2" />
          <SkeletonText className="w-48" />
        </div>
        <SkeletonBox className="w-32 h-10" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Monthly table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-neutral-100 last:border-0">
            <div className="flex justify-between mb-2">
              <SkeletonText className="w-32" />
              <SkeletonText className="w-24" />
            </div>
            <SkeletonBox className="w-full h-1.5 rounded-full" />
          </div>
        ))}
      </div>

      {/* By car */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-neutral-100 last:border-0">
            <div className="flex justify-between mb-2">
              <div className="space-y-1">
                <SkeletonText className="w-40" />
                <SkeletonText className="w-28" />
              </div>
              <SkeletonText className="w-24" />
            </div>
            <SkeletonBox className="w-full h-1.5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
