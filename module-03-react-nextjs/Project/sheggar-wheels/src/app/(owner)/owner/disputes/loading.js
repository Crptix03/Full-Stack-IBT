import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function DisputesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SkeletonBox className="w-36 h-9 mb-2" />
      <SkeletonText className="w-48 mb-8" />
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-white border border-neutral-200 rounded-2xl">
            <div className="flex justify-between mb-3">
              <SkeletonText className="w-40" />
              <SkeletonBox className="w-20 h-6 rounded-full" />
            </div>
            <SkeletonText className="w-64 mb-3" />
            <SkeletonText className="w-full mb-2" />
            <SkeletonText className="w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
