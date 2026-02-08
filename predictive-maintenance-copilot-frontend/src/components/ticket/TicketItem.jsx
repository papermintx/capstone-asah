import { Clock, MapPin, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function TicketItem({ ticket, onView }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col gap-4 
                    transition-all duration-200 hover:shadow-lg hover:border-blue-400">
      
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />

          <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
            <Clock size={16} />
            {ticket.createdAtFormatted}
          </div>
        </div>

        <button
          onClick={onView}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-blue-200 hover:shadow-blue-300"
        >
          View Detail
        </button>
      </div>

      {/* MACHINE TITLE & DESCRIPTION */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
          {/* Ikon Gerigi jadi Biru */}
          <span className="text-blue-600 text-xl">⚙</span> 
          Machine: {ticket.machine?.productId || "--"}
        </h3>

        <p className="text-gray-600 leading-relaxed break-words line-clamp-2">
          {ticket.description}
        </p>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100 mt-1">
        
        {/* Requested By */}
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="font-semibold text-gray-700">Requested by:</span>
          <span className="truncate">{ticket.requestedBy?.email || "--"}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="font-semibold text-gray-700">Location:</span>
          <span>{ticket.machine?.location || "Unknown"}</span>
        </div>

      </div>

    </div>
  );
}