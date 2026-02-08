import React, { useState, useEffect } from "react";
import { adminServices } from "../api/adminServices";
import { toast } from "react-hot-toast";
import { Filter, RotateCw, Ticket } from "lucide-react";

import TechnicianStats from "../components/technician/TechnicianStats";
import TicketList from "../components/technician/TicketList";
import UpdateTicketModal from "../components/technician/UpdateTicket";

const Technician = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await adminServices.getAllTickets();
      setTickets(data);
    } catch (err) { console.error("Error tickets"); } 
    finally { setLoading(false); }
  };

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdate = async (newStatus) => {
    if (!newStatus) return toast.error("Pilih status baru");
    try {
      await adminServices.updateTicketStatus(selectedTicket.id, newStatus);
      toast.success("Status tiket diperbarui!");
      fetchTickets();
      setIsModalOpen(false);
    } catch (err) { toast.error("Gagal update"); }
  };

  // Logic Stats & Filter
  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    canceled: tickets.filter(t => t.status === 'canceled').length,
  };
  const filteredTickets = tickets.filter(t => filter === "all" ? true : t.status === filter);

  return (
    <div className="p-6 space-y-6 min-h-screen relative bg-gray-50">
      
      {/* STATS */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <TechnicianStats stats={stats} />

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center gap-4 border-t border-gray-100 pt-6">
            <label className="font-semibold text-gray-700 flex items-center"><Filter className="w-5 h-5 mr-2" /> Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 outline-none">
                <option value="all">All Tickets</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
                <option value="canceled">Canceled</option>
            </select>
            <button onClick={fetchTickets} className="ml-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center shadow-md justify-center">
                <RotateCw className="w-5 h-5 mr-2" /> Refresh
            </button>
        </div>
      </div>

      {/* TICKET LIST */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Ticket className="w-7 h-7 mr-2 text-gray-700" /> Maintenance Tickets 
            <span className="text-amber-600 ml-2 text-lg">({filteredTickets.length})</span>
        </h3>
        <TicketList tickets={filteredTickets} loading={loading} onUpdateClick={openModal} />
      </div>

      {/* MODAL */}
      <UpdateTicketModal 
        isOpen={isModalOpen} 
        ticket={selectedTicket} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleUpdate} 
      />
    </div>
  );
};

export default Technician;