import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function useUserProfile() {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        setFullName(res.data?.fullName || "");
      } catch (err) {
        console.error("Gagal load profile:", err);
        setFullName("");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  return { fullName, loading };
}