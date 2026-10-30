import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBox className="w-32 h-9 mb-2" />
      <SkeletonText className="w-44 mb-8" />
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-5 flex items-center gap-4 border-b border-neutral-100 last:border-0">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <SkeletonText className="w-36" />
                <SkeletonBox className="w-16 h-5 rounded-full" />
                <SkeletonBox className="w-16 h-5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <SkeletonText className="w-44" />
                <SkeletonText className="w-28" />
              </div>
            </div>
            <SkeletonBox className="w-24 h-9" />
          </div>
        ))}
      </div>
    </div>
  );
}
