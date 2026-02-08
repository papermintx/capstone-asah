import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/maintenance-tickets");
      const data = res.data || [];

      const processed = data.map((t) => ({
        ...t,
        createdAtFormatted: new Date(t.createdAt).toLocaleString("en-US", {
          hour12: false,
        }),
      }));

      setTickets(processed);
    } catch (err) {
      console.error("Gagal fetch tiket:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  return { tickets, loading, refresh: fetchTickets };
}