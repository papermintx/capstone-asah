import React from "react";

export default function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 h-full">
      <div className="h-7 w-52 bg-gray-200 rounded"></div>
      <div className="h-5 w-40 bg-gray-200 rounded"></div>

      {/* STATUS BADGE */}
      <div className="h-6 w-24 bg-gray-300 rounded-full mt-3"></div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 p-5 rounded-xl shadow-sm border animate-pulse">
            <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* DESCRIPTION BOX */}
      <div className="bg-gray-100 p-6 rounded-xl border shadow-sm space-y-3 animate-pulse">
        <div className="h-4 w-28 bg-gray-300 rounded"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
      </div>

      {/* CHART SKELETON */}
      <div className="bg-gray-100 p-6 rounded-xl border shadow-sm animate-pulse">
        <div className="h-4 w-40 bg-gray-300 rounded mb-4"></div>
        <div className="h-64 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}