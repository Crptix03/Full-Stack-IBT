// Reusable skeleton building blocks used by loading.js files.

export function SkeletonBox({ className = "" }) {
  return (
    <div className={`bg-neutral-200 animate-pulse rounded-xl ${className}`} />
  );
}

export function SkeletonText({ className = "" }) {
  return (
    <div className={`bg-neutral-200 animate-pulse rounded-md h-4 ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <SkeletonBox className="w-full h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <SkeletonText className="w-2/3" />
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-1/2" />
        <SkeletonBox className="w-full h-10 mt-2" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
      <SkeletonBox className="w-10 h-10 mb-3" />
      <SkeletonText className="w-1/2 mb-2" />
      <SkeletonBox className="w-16 h-8" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-neutral-100 last:border-0">
      <SkeletonBox className="w-20 h-16 shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-1/2" />
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-1/4" />
      </div>
      <SkeletonBox className="w-20 h-6 shrink-0" />
    </div>
  );
}

export function SkeletonPageHeader({ wide = false }) {
  return (
    <div className={`${wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-4 pt-10 pb-6`}>
      <SkeletonBox className="w-48 h-9 mb-2" />
      <SkeletonText className="w-64" />
    </div>
  );
}
