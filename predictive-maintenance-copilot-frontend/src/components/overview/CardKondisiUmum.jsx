import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import useAnimatedValue from "../../hooks/useAnimatedValue";

export default function CardKondisiUmum({ kondisiUmum, status }) {
  const rawValue = kondisiUmum ?? 0;
  const animatedValue = useAnimatedValue(rawValue, 700);

  const value = Math.max(0, Math.min(100, animatedValue));

  let color = "#22c55e";
  if (status === "Perlu Perhatian") color = "#facc15";
  if (status === "Buruk") color = "#ef4444";

  const data = [
    { name: "Used", value },
    { name: "Rest", value: 100 - value },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col">
      <p className="font-semibold text-gray-700 mb-3">Kondisi Umum Mesin</p>

      <div className="relative flex justify-center items-center mt-2 overflow-visible">
        <PieChart width={240} height={160}>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={85}
            outerRadius={105}
            stroke="none"
            dataKey="value"
            cx="50%"
            cy="70%"
          >
            <Cell fill={color} />
            <Cell fill="#f3f4f6" />
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <p className="text-3xl font-bold" style={{ color }}>
            {Math.round(value)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {status ?? "Status"}
          </p>
        </div>
      </div>
    </div>
  );
}
