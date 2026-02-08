import React from "react";
import { Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import useAnimatedValue from "../../hooks/useAnimatedValue";

export default function CardToolWear({ avgWear }) {
  const animatedWear = useAnimatedValue(avgWear ?? 0, 700);

  let color = "#22c55e";
  if (avgWear >= 150) color = "#ef4444";
  else if (avgWear >= 100) color = "#facc15";

  const progressRaw = (animatedWear / 200) * 100;
  const progress = Math.max(0, Math.min(100, Math.round(progressRaw)));

  return (
    <div className="bg-white p-6 rounded-[20px] shadow border flex flex-col justify-between">

      <div className="flex items-center gap-2">
        <Settings size={22} className="text-gray-600" />
        <p className="font-semibold text-gray-700">Rata-rata Tool Wear</p>
      </div>

      <div className="mt-4">
        <h2 className="text-5xl font-bold" style={{ color }}>
          {`${Math.round(animatedWear)} min`}
        </h2>
        <p className="text-sm text-gray-400 mt-1">Keausan Rata-rata</p>
      </div>

      <div className="mt-4" style={{ height: "30px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[{ name: "ToolWear", value: progress }]} layout="vertical">
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
        {progress}%
      </p>
    </div>
  );
}
