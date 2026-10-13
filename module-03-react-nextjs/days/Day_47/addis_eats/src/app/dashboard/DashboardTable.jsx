// The accessible fallback for a chart.
// Screen readers cannot read an SVG — this gives them the same data.
// It is also genuinely useful: copy-paste, print, and zoom all work.

export default function DashboardTable({ caption, columns, rows }) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">{caption}</caption>

        <thead>
          <tr className="border-b border-neutral-800">
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`py-2 px-3 text-xs uppercase tracking-wider text-neutral-500 font-medium ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-neutral-900 last:border-b-0"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`py-2 px-3 ${
                    ci === 0
                      ? "text-left text-neutral-200"
                      : "text-right text-neutral-300 tabular-nums"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}