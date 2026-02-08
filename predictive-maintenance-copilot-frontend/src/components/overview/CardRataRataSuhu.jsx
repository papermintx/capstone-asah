import React, { useEffect, useState } from "react";
import { Thermometer } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CardRataRataSuhu({ avgTemp }) {
  const [history, setHistory] = useState([]);

  // Load data historis awal
  useEffect(() => {
    loadHistorical();
  }, []);

  // REALTIME LISTENER
  useEffect(() => {
    if (avgTemp !== null && avgTemp !== 0) {
      const now = new Date();
      const timeStr = now.toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHistory((prev) => {
        const newData = [...prev, { time: timeStr, value: Number(avgTemp) }];
        return newData.slice(-50); 
      });
    }
  }, [avgTemp]);

  const loadHistorical = async () => {
    try {
      const res = await axiosClient.get(`/sensors?limit=100&offset=0`);
      let rows = Array.isArray(res.data?.data) ? res.data.data : [];

      rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const result = rows.map((r) => {
        const tempK = r.processTemp ?? r.airTemp;
        
        const timeStr = new Date(r.timestamp).toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit", 
        });

        return {
          time: timeStr, 
          value: tempK != null ? +(tempK - 273.15).toFixed(1) : 0,
        };
      });

      setHistory(result.slice(-50)); 
    } catch (e) {
      console.error("Gagal load historical temperature:", e);
    }
  };

  // LOGIC WARNA 
  let color = "#22c55e";
  const tempValue = Number(avgTemp);

  if (tempValue >= 42) {
    color = "#ef4444"; 
  } else if (tempValue >= 38) {
    color = "#facc15"; 
  }

  return (
    <div className="bg-white p-5 rounded-[20px] shadow border flex flex-col h-full justify-between">

      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div>
            <Thermometer size={22} className="text-gray-600" />
          </div>
          <p className="font-semibold text-gray-700 text-sm">
            Rata-Rata Suhu Proses
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-4xl font-bold transition-colors duration-500" style={{ color }}>
            {avgTemp !== null ? `${avgTemp}°C` : "-"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time Average Process Temp
          </p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{ top: 10, right: 10, bottom: 5, left: -10 }}
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              minTickGap={20} 
              dy={4}
            />

            <YAxis
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              tickCount={4} 
              domain={[(dataMin) => Math.floor(dataMin - 2), (dataMax) => Math.ceil(dataMax + 2)]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#64748b", fontSize: 10 }}
              itemStyle={{ color, fontWeight: 600 }}
              formatter={(v) => [`${v}°C`, "Suhu"]}
            />

            <Area
              isAnimationActive={true} 
              animationDuration={1500} 
              animationEasing="ease-in-out"

              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}