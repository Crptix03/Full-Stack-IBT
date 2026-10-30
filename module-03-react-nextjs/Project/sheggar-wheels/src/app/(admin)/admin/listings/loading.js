import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function AdminListingsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBox className="w-48 h-9 mb-2" />
      <SkeletonText className="w-52 mb-8" />
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-5 border-b border-neutral-100 last:border-0">
            <div className="flex items-start gap-4 mb-3">
              <SkeletonBox className="w-24 h-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <SkeletonText className="w-40" />
                  <SkeletonBox className="w-20 h-5 rounded-full" />
                </div>
                <SkeletonText className="w-32" />
                <SkeletonText className="w-28" />
              </div>
            </div>
            <div className="flex gap-2 pl-28">
              <SkeletonBox className="w-24 h-8" />
              <SkeletonBox className="w-20 h-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
