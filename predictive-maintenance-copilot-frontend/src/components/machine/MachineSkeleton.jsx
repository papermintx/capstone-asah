import React from "react";

export default function MachineSkeleton() {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse flex flex-col h-full">
      
      {/* HEADER: Icon, Nama, ID, Badge */}
      <div className="flex justify-between items-start mb-6 mt-2">
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          
          <div>
            {/* Nama Mesin */}
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            {/* ID Mesin */}
            <div className="h-3 w-20 bg-gray-100 rounded"></div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* DETAILS GRID (2 Kotak di tengah) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl h-16 w-full border border-gray-100"></div>
        <div className="bg-gray-50 rounded-xl h-16 w-full border border-gray-100"></div>
      </div>

      {/* HEALTH SCORE SECTION (Footer) */}
      <div className="mt-auto">
        <div className="flex justify-between items-end mb-2">
          {/* Label Health */}
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          {/* Nilai % */}
          <div className="h-5 w-10 bg-gray-200 rounded"></div>
        </div>
        {/* Progress Bar */}
        <div className="h-3 w-full bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}