import { SkeletonBox, SkeletonText } from "@/components/Skeleton";

export default function CarDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Back link */}
      <SkeletonText className="w-28 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Hero image */}
          <SkeletonBox className="w-full h-96 rounded-2xl mb-6" />

          {/* Title */}
          <SkeletonBox className="w-64 h-10 mb-2" />
          <SkeletonText className="w-48 mb-6" />

          {/* Description */}
          <div className="space-y-2 mb-8">
            <SkeletonText className="w-full" />
            <SkeletonText className="w-5/6" />
            <SkeletonText className="w-4/6" />
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonBox key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-4">
            <SkeletonBox className="w-32 h-10" />
            <SkeletonText className="w-16" />
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <SkeletonText className="w-full" />
              <SkeletonText className="w-3/4" />
            </div>
            <SkeletonBox className="w-full h-12 mt-4" />
            <SkeletonBox className="w-full h-12" />
          </div>
        </aside>
      </div>
    </div>
  );
}
