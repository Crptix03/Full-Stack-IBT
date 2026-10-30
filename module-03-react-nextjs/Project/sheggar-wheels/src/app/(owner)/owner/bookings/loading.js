import { SkeletonBox, SkeletonText, SkeletonListItem } from "@/components/Skeleton";

export default function OwnerBookingsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SkeletonBox className="w-56 h-9 mb-2" />
      <SkeletonText className="w-48 mb-8" />
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  );
}
