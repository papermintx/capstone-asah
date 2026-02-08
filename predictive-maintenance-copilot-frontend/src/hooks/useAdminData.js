import { useState, useEffect, useCallback } from "react";
import { adminServices } from "../api/adminServices";
import { toast } from "react-hot-toast";

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simStatus, setSimStatus] = useState("Unknown");

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminServices.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check Simulator Status
  const checkSimStatus = useCallback(async () => {
    try {
      const { data } = await adminServices.getSimulatorStatus();
      setSimStatus(data.isRunning ? "Running" : "Stopped");
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchUsers();
    checkSimStatus();
  }, [fetchUsers, checkSimStatus]);

  // Actions
  const updateUserRole = async (userId, newRole) => {
    try {
      await adminServices.updateUserRole(userId, newRole);
      toast.success("Role berhasil diupdate");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal update role");
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    const action = isActive ? "deactivate" : "activate";
    try {
      await adminServices.toggleUserStatus(userId, action);
      toast.success(`User berhasil di-${action}`);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal update status");
    }
  };

  const controlSimulator = async (type) => {
    try {
      if (type === "stop") {
        await adminServices.stopSimulator();
        setSimStatus("Stopped");
        toast.success("Simulator dimatikan");
      } else if (type === "normal") {
        await adminServices.startNormalSimulator();
        setSimStatus("Running");
        toast.success("Simulator Normal dijalankan");
      }
    } catch (err) {
      toast.error("Gagal mengontrol simulator");
    }
  };

  return {
    users,
    loading,
    simStatus,
    updateUserRole,
    toggleUserStatus,
    controlSimulator,
    refreshUsers: fetchUsers,
  };
};