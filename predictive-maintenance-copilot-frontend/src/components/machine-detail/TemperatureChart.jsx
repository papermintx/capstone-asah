import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Thermometer, Activity } from "lucide-react";

export default function TemperatureChart({ data }) {
  const tempColor = "#3b82f6";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10 transition-shadow hover:shadow-md">
      
      {/* HEADER CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Thermometer size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Historical Temperature</h3>
            <p className="text-sm text-gray-500">Monitoring suhu proses 30 titik terakhir</p>
          </div>
        </div>

        {/* Badge Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium 
        self-start sm:self-center">
          <Activity size={14} />
          <span>Live Sensor Data</span>
        </div>
      </div>

      {/* CHART AREA */}
      <div className="h-[320px] w-full"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="tempGradientDetail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tempColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={tempColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={25}
              dy={15}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                padding: "10px 15px"
              }}
              labelStyle={{ color: "#64748b", fontSize: 11, marginBottom: "5px" }}
              itemStyle={{ color: tempColor, fontWeight: 600, fontSize: "14px" }}
              formatter={(v) => [`${v}°C`, "Suhu"]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={tempColor}
              strokeWidth={2}
              fill="url(#tempGradientDetail)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}