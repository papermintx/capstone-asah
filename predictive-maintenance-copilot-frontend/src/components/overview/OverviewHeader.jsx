import React from "react";

export default function OverviewHeader({ fullName }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Predictive Maintenance Copilot</h1>

      <div className="text-right">
        <p className="text-sm text-gray-500">Selamat datang</p>
        <p className="text-lg font-semibold text-gray-700">
          {fullName || "-"}
        </p>
      </div>
    </div>
  );
}