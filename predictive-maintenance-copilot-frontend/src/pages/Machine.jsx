import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Cpu, Server } from "lucide-react";

// Hook & Components
import useMachineList from "../hooks/useMachineList";
import MachineCard from "../components/machine/MachineCard";
import MachineSkeleton from "../components/machine/MachineSkeleton";

export default function Machine() {
  const navigate = useNavigate();
  const { machines, loading } = useMachineList();
  const [search, setSearch] = useState("");

  const filtered = machines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[94vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Cpu size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Machine</h1>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-6 py-3 border-b border-gray-100 bg-white z-10 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari mesin berdasarkan nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar relative">
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <MachineSkeleton />
             <MachineSkeleton />
             <MachineSkeleton />
             <MachineSkeleton />
             <MachineSkeleton />
             <MachineSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-60">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              <Server size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Mesin tidak ditemukan
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Tidak ada mesin yang cocok dengan kata kunci <span className="font-medium text-blue-600">"{search}"</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <MachineCard 
                key={m.id} 
                machine={m} 
                onClick={() => navigate(`/machines/${m.id}`)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}