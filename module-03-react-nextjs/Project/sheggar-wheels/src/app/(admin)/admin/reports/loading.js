import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <SkeletonBox className="w-32 h-9 mb-2" />
          <SkeletonText className="w-44" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="w-36 h-10" />
          <SkeletonBox className="w-40 h-10" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 bg-white border border-neutral-200 rounded-2xl">
            <SkeletonText className="w-24 mb-2" />
            <SkeletonBox className="w-20 h-8" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <SkeletonBox className="h-14 rounded-none border-b border-neutral-100" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex justify-between items-center border-b border-neutral-100 last:border-0">
            <div className="space-y-1">
              <SkeletonText className="w-32" />
              <SkeletonText className="w-24" />
            </div>
            <SkeletonText className="w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
