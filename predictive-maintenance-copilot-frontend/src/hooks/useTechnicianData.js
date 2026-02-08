import { useState, useEffect, useCallback } from "react";
import { adminServices } from "../api/adminServices";
import { toast } from "react-hot-toast";

export const useTechnicianData = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminServices.getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat tiket");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateTicketStatus = async (ticketId, currentStatus) => {
    let nextStatus = "";
    if (currentStatus === "open") nextStatus = "in_progress";
    else if (currentStatus === "in_progress") nextStatus = "closed";
    else return;

    try {
      await adminServices.updateTicketStatus(ticketId, nextStatus);
      toast.success(`Status tiket diubah ke ${nextStatus.replace("_", " ")}`);
      fetchTickets();
    } catch (err) {
      toast.error("Gagal update status tiket");
      console.error(err);
    }
  };

  return {
    tickets,
    loading,
    updateTicketStatus,
    refreshTickets: fetchTickets,
  };
};