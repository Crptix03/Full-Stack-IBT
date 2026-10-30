import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function OwnerCarsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <SkeletonBox className="w-36 h-9 mb-2" />
          <SkeletonText className="w-24" />
        </div>
        <SkeletonBox className="w-28 h-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <SkeletonBox className="w-full h-40 rounded-none" />
            <div className="p-5 space-y-3">
              <SkeletonBox className="w-32 h-6" />
              <SkeletonText className="w-48" />
              <div className="flex gap-2 pt-1">
                <SkeletonBox className="flex-1 h-10" />
                <SkeletonBox className="w-10 h-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
