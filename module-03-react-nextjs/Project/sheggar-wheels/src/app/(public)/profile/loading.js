import { SkeletonBox, SkeletonText, SkeletonStatCard } from "@/components/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SkeletonBox className="w-40 h-9 mb-8" />

      {/* Identity card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-6">
          <SkeletonBox className="w-20 h-20 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBox className="w-48 h-7" />
            <div className="flex gap-2">
              <SkeletonBox className="w-16 h-6 rounded-full" />
              <SkeletonBox className="w-16 h-6 rounded-full" />
            </div>
            <SkeletonText className="w-48" />
            <SkeletonText className="w-36" />
            <SkeletonText className="w-52" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 last:border-0">
            <SkeletonBox className="w-4 h-4 rounded" />
            <SkeletonText className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
