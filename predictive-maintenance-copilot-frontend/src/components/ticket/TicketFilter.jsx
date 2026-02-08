import React from "react";

export default function TicketFilter({ filter, setFilter }) {
  const filters = ["open", "in_progress", "closed", "canceled"];

  return (
    <div className="flex gap-3 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg capitalize ${
            filter === f ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          {f.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}