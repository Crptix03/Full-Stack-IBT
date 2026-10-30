import { SkeletonBox, SkeletonText, SkeletonListItem } from "@/components/Skeleton";

export default function AdminBookingsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <SkeletonBox className="w-44 h-9 mb-2" />
          <SkeletonText className="w-36" />
        </div>
        <SkeletonBox className="w-32 h-10" />
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}
