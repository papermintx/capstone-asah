import React from "react";
import { Cpu } from "lucide-react";

export default function CardTotalMesin({ total }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Cpu size={22} />
        <p className="font-semibold text-gray-700">Total Mesin</p>
      </div>

      {/* Angka mesinnya */}
      <div className="flex flex-grow items-center">
        <h2 className="text-5xl font-bold text-left">{total ?? "-"}</h2>
      </div>

      {/* Label bawah kiri */}
      <p className="text-sm text-gray-500 mt-1">Mesin Beroperasi</p>
    </div>
  );
}