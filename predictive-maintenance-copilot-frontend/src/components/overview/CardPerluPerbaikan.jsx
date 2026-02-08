import React from "react";
import { Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import useAnimatedValue from "../../hooks/useAnimatedValue";

export default function CardPerluPerbaikan({ jumlah, progress }) {
  const animatedJumlah = useAnimatedValue(jumlah ?? 0, 700);
  const animatedProgress = useAnimatedValue(progress || 0, 700);

  const color = "#ef4444";
  const chartData = [{ name: "Repair", value: Math.max(0, Math.min(100, animatedProgress)) }];

  return (
    <div className="bg-white p-6 rounded-[20px] shadow border flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <Wrench size={22} className="text-gray-600" />
        <p className="font-semibold text-gray-700">Perlu Perbaikan</p>
      </div>

      <div className="mt-4">
        <h2 className="text-5xl font-bold text-red-600">
          {Math.round(animatedJumlah)}
        </h2>
        <p className="text-sm text-gray-400 mt-1">Mesin</p>
      </div>

      <div className="mt-4" style={{ height: "30px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="value"
              barSize={20}
              fill={color}
              background={{ fill: "#e5e7eb", radius: 10 }}
              radius={[10, 10, 10, 10]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 mt-2 text-right font-bold">
        {progress != null ? `${Math.round(animatedProgress)}%` : "-"}
      </p>
    </div>
  );
}
