const STATUS_STYLES = {
  requested: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  reviewed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-neutral-200 text-neutral-700 border-neutral-300",
  disputed: "bg-orange-100 text-orange-800 border-orange-200",
  resolved: "bg-teal-100 text-teal-800 border-teal-200",
};

const STATUS_LABELS = {
  requested: "Requested",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  reviewed: "Reviewed",
  declined: "Declined",
  cancelled: "Cancelled",
  disputed: "Disputed",
  resolved: "Resolved",
};

export default function BookingStatusPill({ status }) {
  const style =
    STATUS_STYLES[status] || "bg-neutral-100 text-neutral-700 border-neutral-200";
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${style}`}
    >
      {label}
    </span>
  );
}