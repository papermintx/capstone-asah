import React from "react";

export default function StatusBadge({ status }) {
  const getStatusStyle = (s) => {
    if (s === "operational") 
      return { container: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" };
    if (s === "maintenance") 
      return { container: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
    return { container: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-500" };
  };

  const style = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-full border mb-6 ${style.container}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></span>
      {status || "Unknown"}
    </span>
  );
}