export default function StatusBadge({ status }) {
  const map = {
    open: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    closed: "bg-red-100 text-red-700",
    canceled: "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-md ${map[status]}`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}
