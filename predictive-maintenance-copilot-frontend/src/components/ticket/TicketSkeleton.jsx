import React from "react";

export default function TicketSkeleton() {
  const SkeletonItem = () => (
    <div className="w-full bg-white border rounded-2xl px-6 py-5 shadow-sm animate-pulse">
      {/* Top row */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Title */}
      <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>

      {/* Bottom row */}
      <div className="flex justify-between mt-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  );
}