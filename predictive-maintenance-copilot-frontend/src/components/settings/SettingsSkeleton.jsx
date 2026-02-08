import React from "react";

export default function SettingsSkeleton() {
  const SkeletonCard = ({ children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      
      {/* PROFILE SKELETON */}
      <SkeletonCard>
        <div className="h-5 w-24 bg-gray-300 rounded mb-6"></div>
        <div className="space-y-5">
          <div>
            <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div> {/* Label */}
            <div className="h-11 w-full bg-gray-100 rounded-lg border border-gray-100"></div> {/* Input Box */}
          </div>
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div> {/* Label */}
            <div className="h-11 w-full bg-gray-100 rounded-lg border border-gray-100"></div> {/* Input Box */}
          </div>
        </div>
      </SkeletonCard>

      {/* RESET PASSWORD SKELETON */}
      <SkeletonCard>
        <div className="h-5 w-36 bg-gray-300 rounded mb-6"></div>
        <div className="mb-5">
          <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-100 rounded-lg border border-gray-100"></div>
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
      </SkeletonCard>

      {/* LOGOUT SKELETON */}
      <SkeletonCard>
        <div className="h-5 w-20 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-32 bg-gray-100 rounded mb-4"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </SkeletonCard>

    </div>
  );
}