import React from "react";
import { Plus, ArrowLeft } from "lucide-react";

export default function DetailHeader({ machine, onBack, onCreateTicket }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <span className="uppercase tracking-wider font-semibold text-xs">Machine ID</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{machine.productId}</h1>
        <p className="text-gray-500 flex items-center gap-1 mt-1">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          {machine.location}
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onCreateTicket}
          className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex justify-center items-center gap-2 
             transition-all duration-200 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <Plus size={18} /> Create Ticket
        </button>

        <button
          onClick={onBack}
          className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium 
            hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 flex justify-center items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
}