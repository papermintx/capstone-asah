import React from "react";
import { useNavigate } from "react-router-dom";

export default function RingkasanStatusMesin({ machines = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold mb-3">Ringkasan Status Mesin</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">Tipe</th>
              <th className="px-4 py-2">Skor</th>
              <th className="px-4 py-2">Suhu (°C)</th>
              <th className="px-4 py-2">Tool Wear</th>
              <th className="px-4 py-2">Kecepatan</th>
              <th className="px-4 py-2">Torque</th>
              <th className="px-4 py-2">Update</th>
              <th className="px-4 py-2 text-center">Detail</th>
            </tr>
          </thead>

          <tbody>
            {machines.length > 0 ? (
              machines.map((m) => (
                <tr
                  key={m.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* TIPE (productId) */}
                  <td className="px-4 py-2 font-bold">
                    {m.productId ?? "-"}
                  </td>

                  {/* SKOR */}
                  <td className="px-4 py-2">{m.healthScore ?? "-"}</td>

                  {/* SUHU CELCIUS */}
                  <td className="px-4 py-2">
                    {m.suhuC != null ? `${m.suhuC}°C` : "-"}
                  </td>

                  {/* TOOL WEAR */}
                  <td className="px-4 py-2">
                    {m.wear != null ? `${m.wear} min` : "-"}
                  </td>

                  {/* SPEED */}
                  <td className="px-4 py-2">
                    {m.speed != null ? `${m.speed} RPM` : "-"}
                  </td>

                  {/* TORQUE */}
                  <td className="px-4 py-2">
                    {m.torque != null ? `${Number(m.torque).toFixed(1)} Nm` : "-"}
                  </td>

                  {/* UPDATED AT */}
                  <td className="px-4 py-2">
                    {m.updatedAt
                      ? new Date(m.updatedAt).toLocaleString("en-US", {
                          hour12: true,
                        })
                      : "-"}
                  </td>

                  {/* DETAIL BUTTON */}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => navigate(`/machines/${m.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium 
                      transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-blue-200 hover:shadow-blue-300"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  Data mesin belum tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}