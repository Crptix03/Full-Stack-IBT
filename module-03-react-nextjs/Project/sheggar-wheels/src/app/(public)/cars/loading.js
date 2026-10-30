import { SkeletonBox, SkeletonText, SkeletonCard } from "@/components/Skeleton";

export default function CarsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Heading */}
      <div className="mb-8">
        <SkeletonBox className="w-48 h-9 mb-2" />
        <SkeletonText className="w-32" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-10 p-5 bg-white border border-neutral-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <SkeletonBox key={i} className="h-10" />
        ))}
      </div>

      {/* Car grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
