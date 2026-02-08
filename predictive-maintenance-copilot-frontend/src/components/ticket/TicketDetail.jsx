import React from "react";
import { X, User, MapPin, Clock, Ticket, Cpu } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function TicketDetail({ open, ticket, onClose }) {
  if (!open || !ticket) return null;

  const formattedCreated = new Date(ticket.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      {/* Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100">

        {/* HEADER */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Ticket size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ticket Information</h2>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT SCROLLABLE */}
        <div className="p-7 max-h-[75vh] overflow-y-auto">
          
          {/* MACHINE CONTEXT */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6 flex items-start gap-4">
            <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm mt-1">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Target Machine</p>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {ticket.machine?.productId || "Unknown Machine ID"}
              </h3>
              <p className="text-sm text-blue-700/80 mt-1">
                Maintenance required for this unit.
              </p>
            </div>
          </div>

          {/* GRID LAYOUT UTAMA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">

            {/* STATUS COLUMN */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
              <StatusBadge status={ticket.status} />
            </div>

            {/* CREATED AT COLUMN */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Created At</p>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-fit">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm font-semibold">{formattedCreated}</span>
              </div>
            </div>

          </div>

          {/* DESCRIPTION SECTION */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Issue Description
            </h4>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
              {ticket.description || "No description provided."}
            </div>
          </div>

          {/* METADATA GRID (Requester & Location) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Requester */}
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors group">
              <div className="p-2 bg-gray-100 text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-full transition-colors">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Requested By</p>
                <p className="text-sm font-bold text-gray-900 truncate" title={ticket.requestedBy?.email}>
                  {ticket.requestedBy?.email || "-"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors group">
              <div className="p-2 bg-gray-100 text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-full transition-colors">
                <MapPin size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {ticket.machine?.location || "-"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-end px-7 py-5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl 
            transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}