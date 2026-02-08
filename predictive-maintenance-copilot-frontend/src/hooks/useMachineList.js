import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosClient from "../api/axiosClient";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

export default function useMachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const machinesRef = useRef([]);

  // LOGIC UPDATE STATE
  const updateMachinesState = (currentList, newData) => {
    const updates = Array.isArray(newData) ? newData : [newData];

    const updatedList = currentList.map((m) => {
      const update = updates.find(u => 
        (u.machine_id === m.id) || (u.id === m.id) || (u.machineId === m.id)
      );

      const processK = update?.processTemp ?? update?.process_temp ?? m.processTemp;
      const airK = update?.airTemp ?? update?.air_temp ?? m.airTemp;
      
      const valToC = (v) => (v != null && v > 200) ? +(v - 273.15).toFixed(1) : v;
      const suhuC = processK ? valToC(processK) : (airK ? valToC(airK) : null);
      
      const wear = update?.toolWear ?? update?.tool_wear ?? m.toolWear;
      const torque = update?.torque ?? m.torque;

      // Logic Risiko & Health Score
      let riskScore = 0;

      if (suhuC != null && wear != null) {
          const t = Math.min(suhuC / 90, 1);
          const w = Math.min(wear / 250, 1);
          
          riskScore = (t * 0.6 + w * 0.4);
      }

      const healthScore = Math.round((1 - riskScore) * 100);

      let status = m.status;

      return {
        ...m,
        processTemp: processK,
        airTemp: airK,
        toolWear: wear,
        torque: torque,
        riskScore, 
        healthScore,
        status
      };
    });

    machinesRef.current = updatedList;
    setMachines(updatedList);
  };

  // FETCH DATA AWAL
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Ambil List Mesin
      const res = await axiosClient.get("/machines");
      const list = res.data.data || res.data || [];

      // Ambil Snapshot Sensor Terakhir
      const stats = await Promise.all(
        list.map((m) =>
          axiosClient
            .get(`/sensors/statistics/${m.id}`) 
            .then((r) => ({
              id: m.id,
              ...r.data.latestReading 
            }))
            .catch(() => ({ id: m.id }))
        )
      );

      // Gabungkan Data Awal (Mesin + Sensor Terakhir)
      const initialData = list.map((m) => {
        const lastSensor = stats.find((s) => s.id === m.id);
        return {
          id: m.id,
          name: m.productId || m.name,
          type: m.type || "-",
          location: m.location || "-",
          status: m.status || "unknown",
          ...lastSensor
        };
      });

      // Hitung Score Awal dan Update State
      updateMachinesState(initialData, []); 
      
      setLoading(false);

    } catch (err) {
      console.error("Gagal memuat data mesin:", err);
      setLoading(false);
    }
  };

  // WEBSOCKET SETUP
  useEffect(() => {
    fetchInitialData();

    const socket = io(`${SOCKET_URL}/sensors`, { 
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Machine List WebSocket");
      socket.emit("subscribe:all-sensors");
    });

    socket.on("sensors:update", (newData) => {
      if (machinesRef.current.length > 0) {
        updateMachinesState(machinesRef.current, newData);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { machines, loading };
}