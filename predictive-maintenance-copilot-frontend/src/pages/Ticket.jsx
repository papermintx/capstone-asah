import React, { useState } from "react";
import useTickets from "../hooks/useTickets";
import { Ticket as TicketIcon, Inbox } from "lucide-react";

import TicketItem from "../components/ticket/TicketItem";
import TicketDetail from "../components/ticket/TicketDetail";
import TicketFilter from "../components/ticket/TicketFilter";
import TicketSkeleton from "../components/ticket/TicketSkeleton";

export default function Ticket() {
  const { tickets, loading } = useTickets();

  const [selected, setSelected] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [filter, setFilter] = useState("open");

  const filteredTickets = tickets.filter((t) => t.status === filter);

  return (
    <div className="flex flex-col h-[94vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TicketIcon size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Maintenance Tickets</h1>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="px-6 py-3 border-b border-gray-100 bg-white z-10 shrink-0">
        <TicketFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar relative">
        
        {loading ? (
          <div className="space-y-4">
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
          </div>
        ) : filteredTickets.length === 0 ? (
          // Empty State
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-60">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              <Inbox size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Tidak ada tiket
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Saat ini tidak ada tiket dengan status <span className="font-medium text-blue-600">"{filter}"</span>.
            </p>
          </div>
        ) : (
          // List Tiket
          <div className="space-y-4">
            {filteredTickets.map((t) => (
              <TicketItem
                key={t.id}
                ticket={t}
                onView={() => {
                  setSelected(t);
                  setOpenDetail(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <TicketDetail
        open={openDetail}
        ticket={selected}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
}