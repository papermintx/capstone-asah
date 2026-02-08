import React from "react";
import { Cpu, MapPin, Factory } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import useAnimatedValue from "../../hooks/useAnimatedValue";

export default function MachineCard({ machine, onClick }) {
  
  // hook animasi nilai health score
  const animatedScore = useAnimatedValue(machine.healthScore || 0, 1000);
  const displayScore = Math.round(animatedScore);

  // Helper functions
  const getHealthColor = (score) => {
    if (score < 40) return "#ef4444"; 
    if (score < 70) return "#f59e0b";
    return "#10b981";
  };

  const getStatusStyle = (s) => {
    if (s === "operational") 
      return { container: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" };
    if (s === "maintenance") 
      return { container: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
    if (s === "retired") 
      return { container: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" }; 
    return { container: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-500" };
  };

  const style = getStatusStyle(machine.status);
  const healthColor = getHealthColor(displayScore);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm 
                 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 
                 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Decorative Top Line */}
      <div 
        className="absolute top-0 left-0 w-full h-1 transition-colors duration-500" 
        style={{ backgroundColor: healthColor }}
      />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Cpu size={24} />
          </div>
          
          <div>
            <h2 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {machine.name}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">ID: {machine.id.substring(0, 8)}...</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${style.container}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></span>
          {machine.status || "Unknown"}
        </span>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
            <Factory size={12} /> Type
          </p>
          <p className="text-sm font-semibold text-gray-700 truncate" title={machine.type}>
            {machine.type}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1">
            <MapPin size={12} /> Location
          </p>
          <p className="text-sm font-semibold text-gray-700 truncate" title={machine.location}>
            {machine.location}
          </p>
        </div>
      </div>

      {/* HEALTH SCORE SECTION */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Health Score</span>
          <span 
            className="text-lg font-bold transition-colors duration-500"
            style={{ color: healthColor }}
          >
            {displayScore}%
          </span>
        </div>

        {/* Chart Container */}
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={[{ name: "Health", value: animatedScore }]} 
                layout="vertical" 
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Bar
                dataKey="value"
                barSize={12}
                fill={healthColor}
                background={{ fill: "transparent" }}
                isAnimationActive={false} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}