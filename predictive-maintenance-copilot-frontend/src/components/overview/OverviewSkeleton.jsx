import React from "react";

export default function OverviewSkeleton() {

  // Container
  const CardBase = ({ children, className = "" }) => (
    <div className={`bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm animate-pulse flex flex-col h-full ${className}`}>
      {children}
    </div>
  );

  // Header Kecil
  const SkeletonHeader = () => (
    <div className="flex items-center gap-3 mb-4 shrink-0">
      <div className="w-32 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  // Total Mesin
  const SkeletonSimpleMetric = () => (
    <CardBase>
      <SkeletonHeader />
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-10 bg-gray-300 rounded"></div>
      </div>

      <div className="mt-2">
        <div className="w-24 h-3 bg-gray-100 rounded"></div>
      </div>
    </CardBase>
  );

  // Grafik
  const SkeletonChartMetric = () => (
    <CardBase className="justify-between">
      <SkeletonHeader />
      <div>
        <div className="w-20 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="w-32 h-3 bg-gray-100 rounded mb-6"></div>
        <div className="w-full h-16 bg-gray-50 rounded-lg flex items-end overflow-hidden">
             <div className="w-full h-1/2 bg-gray-100 rounded-t-lg"></div>
        </div>
      </div>
    </CardBase>
  );

  // Progress Bar
  const SkeletonProgressMetric = () => (
    <CardBase className="justify-between">
      <SkeletonHeader />
      <div className="mt-auto">
        <div className="w-20 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="w-24 h-3 bg-gray-100 rounded mb-4"></div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex justify-end mt-2">
            <div className="w-8 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </CardBase>
  );

  // Gauge 
  const SkeletonGaugeMetric = () => (
    <CardBase>
      <SkeletonHeader />
      <div className="flex-1 flex flex-col items-center justify-center pb-2">
        <div className="w-32 h-16 bg-gray-100 rounded-t-full border-t-[12px] border-x-[12px] border-gray-200 box-content relative">
             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 w-16 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded mt-4"></div>
      </div>
    </CardBase>
  );

  // Tabel
  const SkeletonTable = () => (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm animate-pulse mt-8">
      <div className="w-48 h-6 bg-gray-300 rounded mb-6"></div>
      <div className="w-full">
        {/* Table Head */}
        <div className="flex bg-gray-50 py-3 px-4 rounded-lg mb-4">
          {[...Array(7)].map((_, i) => (
             <div key={i} className="flex-1">
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
             </div>
          ))}
        </div>
        {/* Table Body */}
        <div className="space-y-4">
          {[...Array(5)].map((_, r) => (
            <div key={r} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
               {/* Kolom Data */}
               {[...Array(6)].map((_, c) => (
                 <div key={c} className="flex-1">
                    <div className="w-12 h-4 bg-gray-100 rounded"></div>
                 </div>
               ))}
               <div className="flex-1">
                  <div className="w-16 h-8 bg-gray-100 rounded-lg"></div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SkeletonSimpleMetric />
        <SkeletonChartMetric />
        <SkeletonProgressMetric />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonGaugeMetric />
        <SkeletonProgressMetric />
        <SkeletonProgressMetric />
      </div>

      <SkeletonTable />
    </div>
  );
} 