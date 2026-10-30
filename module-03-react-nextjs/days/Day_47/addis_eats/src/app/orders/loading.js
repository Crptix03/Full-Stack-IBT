
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-baseline justify-between mb-8">
        <div className="h-9 w-40 bg-neutral-900 rounded animate-pulse" />
        <div className="h-4 w-24 bg-neutral-900 rounded animate-pulse" />
      </div>


      <div className="overflow-hidden border border-neutral-800 rounded-xl">
        <table className="w-full text-sm" aria-hidden="true">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/40">
              <ThSkeleton align="left" width="w-16" />
              <ThSkeleton align="left" width="w-20" />
              <ThSkeleton align="right" width="w-12" />
              <ThSkeleton align="right" width="w-16" />
              <ThSkeleton align="left" width="w-20" />
              <ThSkeleton align="right" width="w-10" />
            </tr>

          </thead>

          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <tr
                key={i}
                className="border-b border-neutral-900 last:border-b-0"
              >
                <TdSkeleton align="left" width="w-20" />
                <TdSkeleton align="left" width="w-24" />
                <TdSkeleton align="right" width="w-6" />
                <TdSkeleton align="right" width="w-16" />
                <TdSkeleton align="left" width="w-20" />
                <TdSkeleton align="right" width="w-10" />
              </tr>

            ))}
          </tbody>

        </table>

      </div>


      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-10 bg-neutral-900 rounded animate-pulse"
          />
        ))}
      </div>

    </div>

  );
}

function ThSkeleton({ align, width }) {
  return (
    <th
      className={`py-3 px-4 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`inline-block h-3 ${width} bg-neutral-800 rounded animate-pulse`}
      />
    </th>

  );
}

function TdSkeleton({ align, width }) {
  return (
    <td
      className={`py-3 px-4 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`inline-block h-4 ${width} bg-neutral-800 rounded animate-pulse`}
      />
    </td>

  );
}