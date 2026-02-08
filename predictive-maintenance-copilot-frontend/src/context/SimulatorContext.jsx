import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { adminServices } from "../api/adminServices";
import { toast } from "react-hot-toast";

const SimulatorContext = createContext(null);

export const SimulatorProvider = ({ children }) => {
  const [simType, setSimType] = useState(null);
  const [machines, setMachines] = useState([]);
  const anomalyIntervalRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await adminServices.getMachines();
        setMachines(data.data || data);
        
        const statusRes = await adminServices.getSimulatorStatus();
        if (statusRes.data.isRunning && simType !== 'anomaly') {
            setSimType('normal');
        }
      } catch (err) {
        console.error("Simulator Context Error:", err);
      }
    };
    init();

    return () => stopAnomalyLoop();
  }, []);

  const triggerRandomAnomaly = async () => {
    if (machines.length === 0) return;
    const randomMachine = machines[Math.floor(Math.random() * machines.length)];
    try {
      await adminServices.triggerAnomaly(randomMachine.id);
    } catch (err) {
      console.error("Anomaly failed", err);
    }
  };

  const startAnomaly = async () => {
    if (machines.length === 0) {
        const { data } = await adminServices.getMachines();
        setMachines(data.data || data);
        if (data.length === 0) return toast.error("No machines available");
    }

    if (simType === 'normal') {
        await adminServices.stopSimulator(); 
    }

    setSimType('anomaly');
    toast.success("Anomaly Simulation Started (Background)");

    triggerRandomAnomaly(); 
    if (anomalyIntervalRef.current) clearInterval(anomalyIntervalRef.current);
    anomalyIntervalRef.current = setInterval(triggerRandomAnomaly, 5000);
  };

  const startNormal = async () => {
    stopAnomalyLoop(); 
    try {
      await adminServices.startNormalSimulator();
      setSimType('normal');
      toast.success("Normal Simulation Started");
    } catch (err) {
      toast.error("Failed start Normal");
    }
  };

  const stopAll = async () => {
    stopAnomalyLoop();
    try {
      await adminServices.stopSimulator();
      setSimType(null);
      toast.success("Simulation Stopped");
    } catch (err) {
      toast.error("Failed stop");
    }
  };

  const stopAnomalyLoop = () => {
    if (anomalyIntervalRef.current) {
      clearInterval(anomalyIntervalRef.current);
      anomalyIntervalRef.current = null;
    }
  };

  return (
    <SimulatorContext.Provider value={{ simType, startNormal, startAnomaly, stopAll }}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => useContext(SimulatorContext);