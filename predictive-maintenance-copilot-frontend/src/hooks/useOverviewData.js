import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axiosClient from "../api/axiosClient";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

export default function useOverviewData() {
  const [machines, setMachines] = useState([]);
  const [totalMesin, setTotalMesin] = useState(0);

  const [avgTemp, setAvgTemp] = useState(0);
  const [avgWear, setAvgWear] = useState(0);
  const [kondisiUmum, setKondisiUmum] = useState(0);
  const [kondisiStatus, setKondisiStatus] = useState("Sangat Baik");
  
  const [mesinPerhatian, setMesinPerhatian] = useState(0);
  const [mesinPerbaikan, setMesinPerbaikan] = useState(0);
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);

  // STATE & REF UNTUK NOTIF
  const [notifications, setNotifications] = useState([]);
  const lastStatusRef = useRef({});      

  const machinesRef = useRef([]);

  // PUSH / REMOVE NOTIF
  const pushNotification = (machineName, type) => {
    const notif = {
      id: Date.now() + Math.random(),
      machine: machineName,
      type,
      time: new Date().toLocaleTimeString("id-ID"),
    };

    setNotifications((prev) => [notif, ...prev]);

    // auto-dismiss 6 detik
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // UPDATE STATE
  const updateMachineState = (currentList, newData) => {
    const updates = Array.isArray(newData) ? newData : [newData];

    const updatedList = currentList.map((m) => {
      const update = updates.find(
        (u) =>
          u.machine_id === m.id ||
          u.id === m.id ||
          u.machineId === m.id
      );

      if (!update) return m;

      const processK =
        update.processTemp ?? update.process_temp ?? m.processTemp;
      const airK = update.airTemp ?? update.air_temp ?? m.airTemp;

      const toC = (v) => (v && v > 200 ? +(v - 273.15).toFixed(1) : v);
      const suhuC = processK
        ? toC(processK)
        : airK
        ? toC(airK)
        : m.suhuC ?? null;

      const wear = update.toolWear ?? update.tool_wear ?? m.wear;
      const speed =
        update.rotationalSpeed ?? update.rotational_speed ?? m.speed;
      const torque = update.torque ?? m.torque;

      // hitung riskScore
      let riskScore = m.riskScore ?? 0;

      if (update.latestPrediction?.riskScore != null) {
        riskScore = update.latestPrediction.riskScore;
      } else if (suhuC != null && wear != null) {
        const t = Math.min(suhuC / 90, 1);
        const w = Math.min(wear / 250, 1);
        riskScore = t * 0.6 + w * 0.4;
      }

      const healthScore = Math.round((1 - riskScore) * 100);

      // DETEKSI PERUBAHAN STATUS UNTUK NOTIF 
      const prevStatus = lastStatusRef.current[m.id] || "safe";
      const currentStatus =
        riskScore > 0.7 ? "critical" :
        riskScore > 0.4 ? "warning" :
        "safe";

      if (currentStatus !== prevStatus) {
        const namaMesin = m.name || m.productId || `ID-${m.id}`;

        if (currentStatus === "critical") {
          pushNotification(namaMesin, "critical");
        } else if (currentStatus === "warning") {
          pushNotification(namaMesin, "warning");
        }
      }

      // simpan status terbaru untuk mesin ini
      lastStatusRef.current[m.id] = currentStatus;

      return {
        ...m,
        name: m.name ?? m.productId ?? `ID-${m.id}`,
        productId: m.productId,

        processTemp: processK,
        suhuC,
        wear,
        speed,
        torque,
        riskScore,
        healthScore,
        updatedAt: update.timestamp || new Date().toISOString(),
      };
    });

    // simpan ke ref + trigger render
    machinesRef.current = updatedList;
    setMachines([...updatedList]);
    setTotalMesin(updatedList.length);

    //REBUILD AGGREGATE 
    let tSum = 0,
      tCount = 0,
      wSum = 0,
      wCount = 0,
      healthSum = 0;
    let warning = 0,
      critical = 0;

    updatedList.forEach((m) => {
      if (m.suhuC != null) {
        tSum += m.suhuC;
        tCount++;
      }
      if (m.wear != null) {
        wSum += m.wear;
        wCount++;
      }

      healthSum += m.healthScore || 0;

      if (m.riskScore > 0.7) critical++;
      else if (m.riskScore > 0.4) warning++;
    });

    setAvgTemp(tCount ? (tSum / tCount).toFixed(1) : avgTemp);
    setAvgWear(wCount ? Math.round(wSum / wCount) : avgWear);

    setMesinPerbaikan(critical);
    setMesinPerhatian(warning);

    const avgHealth = updatedList.length
      ? Math.round(healthSum / updatedList.length)
      : kondisiUmum;
    setKondisiUmum(avgHealth);

    if (critical > 0) setKondisiStatus("Buruk");
    else if (warning > 0) setKondisiStatus("Perlu Perhatian");
    else setKondisiStatus("Sangat Baik");

    setChartData(
      updatedList
        .filter((m) => m.suhuC != null)
        .slice(0, 7)
        .map((m, i) => ({
          name: m.productId || `M-${i + 1}`,
          value: m.suhuC,
        }))
    );
  };

  // FETCH DATA AWAL
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/machines");
      const list = res.data.data || [];

      const stats = await Promise.all(
        list.map((m) =>
          axiosClient
            .get(`/sensors/statistics/${m.id}`)
            .then((r) => ({
              id: m.id,
              ...r.data.latestReading,
              latestPrediction: r.data.latestPrediction,
            }))
            .catch(() => ({ id: m.id }))
        )
      );

      const initialData = list.map((m) => {
        const s = stats.find((x) => x.id === m.id);
        return {
          id: m.id,
          name: m.productId || m.name,
          productId: m.productId,
          type: m.type || "-",
          status: m.status || "unknown",
          riskScore: s?.latestPrediction?.riskScore ?? 0,
          ...s,
        };
      });

      updateMachineState(initialData, initialData);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch initial data:", err);
      setError(err);
      setLoading(false);
    }
  };

  // SOCKET REALTIME
  useEffect(() => {
    fetchInitialData();

    const socket = io(`${SOCKET_URL}/sensors`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("subscribe:all-sensors");
    });

    socket.on("sensors:update", (d) => {
      if (machinesRef.current.length > 0) {
        updateMachineState(machinesRef.current, d);
      }
    });

    return () => socket.disconnect();
  }, []);

  return {
    machines,
    loading,
    error,
    totalMesin,
    avgTemp,
    avgWear,
    kondisiUmum,
    kondisiStatus,
    mesinPerhatian,
    mesinPerbaikan,
    chartData,
    notifications,
    removeNotification,
  };
}
