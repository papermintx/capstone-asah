import React from "react";
import { Activity, Thermometer, Wrench, Fan, GaugeCircle } from "lucide-react";

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 transition-all duration-300">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

export default function SummaryGrid({ machine, statistics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <SummaryCard 
        label="Health Score" 
        value={`${machine?.healthScore ?? 0}%`} 
        icon={Activity} 
        color="bg-green-100 text-green-600"
      />
      <SummaryCard 
        label="Suhu Proses"  
        value={`${statistics.avgTemp ?? 0}°C`} 
        icon={Thermometer}
        color="bg-blue-100 text-blue-600"
      />
      <SummaryCard 
        label="Tool Wear" 
        value={`${statistics.avgWear ?? 0} min`} 
        icon={Wrench}
        color="bg-orange-100 text-orange-600"
      />
      <SummaryCard 
        label="Kecepatan" 
        value={`${statistics.avgRPM ?? 0} RPM`} 
        icon={Fan}
        color="bg-purple-100 text-purple-600"
      />
      <SummaryCard  
        label="Torque" 
        value={`${(statistics.torque ?? 0).toFixed(1)} Nm`}
        icon={GaugeCircle}
        color="bg-red-100 text-red-600"
      />
    </div>
  );
}
