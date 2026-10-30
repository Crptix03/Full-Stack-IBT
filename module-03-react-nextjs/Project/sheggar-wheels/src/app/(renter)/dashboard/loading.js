import { SkeletonBox, SkeletonText, SkeletonStatCard, SkeletonListItem } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBox className="w-56 h-9 mb-2" />
      <SkeletonText className="w-48 mb-8" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Next trip banner */}
      <SkeletonBox className="w-full h-28 rounded-2xl mb-8" />

      {/* Bookings list */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
        {[...Array(4)].map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}
