export default function PriorityBadge({ priority }) {
  const map = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-md ${map[priority]}`}
    >
      {priority.toUpperCase()}
    </span>
  );
}
