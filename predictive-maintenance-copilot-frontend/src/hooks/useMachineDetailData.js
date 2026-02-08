import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axiosClient from "../api/axiosClient";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

const calculateHealthScore = (suhu, wear) => {
  if (suhu == null || wear == null) return 100;

  const t = Math.min(suhu / 90, 1);   
  const w = Math.min(wear / 250, 1); 

  const risk = (t * 0.6) + (w * 0.4);
  return Math.round((1 - risk) * 100);
};

export default function useMachineDetailData(id) {
  const [machine, setMachine] = useState(null);
  
  // Initial State
  const [statistics, setStatistics] = useState({ 
    avgTemp: 0, 
    avgWear: 0, 
    avgRPM: 0,
    healthScore: 100,
    torque: 0
  });
  
  const [tempData, setTempData] = useState([]);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const chartDataRef = useRef([]);

  // FETCH PREDIKSI
  const fetchLatestPrediction = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axiosClient.get(`/predictions/machine/${id}?limit=5&sort=timestamp:desc`);
      const rawData = response.data;
      const dataArray = Array.isArray(rawData) ? rawData : (rawData.data ? rawData.data : []);

      const sortedData = dataArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latest = sortedData[0];

      if (latest) {
        setLatestPrediction({
          timestamp: latest.timestamp,
          riskScore: latest.riskScore,
          confidence: latest.confidence,
          failurePredicted: latest.failurePredicted,
          failureType: latest.failureType,
          predictedFailureTime: latest.predictedFailureTime,
        });
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  }, [id]);

  // WEBSOCKET REAL-TIME UPDATE
  const handleSensorUpdate = (newData) => {
    const processK = newData.processTemp ?? newData.process_temp;
    const airK = newData.airTemp ?? newData.air_temp;
    const valToC = (v) => (v != null && v > 200) ? +(v - 273.15).toFixed(1) : v;
    
    const suhuC = processK ? valToC(processK) : (airK ? valToC(airK) : 0);
    const wear = newData.toolWear ?? newData.tool_wear ?? 0;
    const speed = newData.rotationalSpeed ?? newData.rotational_speed ?? 0;
    const torque = newData.torque ?? newData.Torque ?? 0;

    // Update Chart
    const ts = new Date(newData.timestamp || new Date());
    const timeLabel = ts.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newChartPoint = { time: timeLabel, value: suhuC || 0 };
    const updatedChart = [...chartDataRef.current, newChartPoint].slice(-50);
    chartDataRef.current = updatedChart;
    setTempData(updatedChart);

    // HEALTH
    const liveHealth = calculateHealthScore(suhuC, wear);

    setStatistics({
      avgTemp: suhuC,
      avgWear: wear,
      avgRPM: speed,
      healthScore: liveHealth,
      torque
    });

    setMachine(prev => prev ? ({ ...prev, healthScore: liveHealth, torque }) : null);
  };

  // LOAD AWAL DATA
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const detailRes = await axiosClient.get(`/machines/${id}`);
      setMachine(detailRes.data);

      const lastSensorRes = await axiosClient.get(`/sensors?limit=1&offset=0&machineId=${id}`);
      const lastSensorData = lastSensorRes.data?.data?.[0];

      let initialTemp = 0;
      let initialWear = 0;
      let initialRPM = 0;
      let initialHealth = 100;
      let initialTorque = 0;

      if (lastSensorData) {
        const kTemp = lastSensorData.processTemp ?? 0;
        initialTemp = kTemp > 200 ? +(kTemp - 273.15).toFixed(1) : kTemp;
        initialWear = lastSensorData.toolWear ?? 0;
        initialRPM = lastSensorData.rotationalSpeed ?? 0;
        initialTorque = lastSensorData.torque ?? lastSensorData.Torque ?? 0;

        initialHealth = calculateHealthScore(initialTemp, initialWear);
      }

      setStatistics({ 
        avgTemp: initialTemp, 
        avgWear: initialWear, 
        avgRPM: initialRPM,
        healthScore: initialHealth,
        torque: initialTorque
      });

      setMachine(prev => ({ ...prev, healthScore: initialHealth, torque: initialTorque }));

      // Chart History
      const historic = await axiosClient.get(`/sensors?limit=50&offset=0&machineId=${id}`);
      const rows = Array.isArray(historic.data?.data) ? historic.data.data : [];
      const chart = rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((r) => {
          const ts = new Date(r.timestamp);
          const c = r.processTemp != null ? +(r.processTemp - 273.15).toFixed(1) : 0;
          return { 
             time: ts.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), 
             value: c 
          };
        });

      setTempData(chart);
      chartDataRef.current = chart;

      await fetchLatestPrediction();
      setError(false);

    } catch (err) {
      console.error("Error loading detail:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 4. EFFECTS
  useEffect(() => {
    if (!id) return;
    loadInitialData();

    const socket = io(`${SOCKET_URL}/sensors`, { 
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(`🟢 Connected to Sensor WebSocket for Machine ${id}`);
      socket.emit("subscribe:sensor", { machineId: id });
    });

    socket.on("sensor:update", (newData) => {
      if (newData.machine_id === id || newData.machineId === id) {
        handleSensorUpdate(newData);
      }
    });

    const predictionInterval = setInterval(() => {
        fetchLatestPrediction();
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(predictionInterval);
    };
  }, [id, fetchLatestPrediction]);

  return {
    machine,
    statistics,
    tempData,
    latestPrediction,
    loading,
    error,
    refresh: loadInitialData,
  };
}