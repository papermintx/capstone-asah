import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext"; 
import { toast } from "react-hot-toast"; 

export default function useSettings() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data User
  const [fullName, setFullName] = useState("-");
  const [email, setEmail] = useState("-");
  
  // Form State
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      setFullName(res.data.fullName || "-");
      setEmail(res.data.email || "-");
      setResetPasswordEmail(res.data.email || "");
    } catch (err) {
      console.error("Gagal memuat profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordEmail) return toast.error("Email tidak boleh kosong");
    
    try {
      await axiosClient.post("/auth/reset-password", {
        email: resetPasswordEmail,
      });
      toast.success("Link reset password dikirim ke email Anda.");
    } catch (err) {
      toast.error("Gagal mengirim reset password.");
    }
  };

  const handleLogout = () => {
    logout(); 
  };

  return {
    loading,
    fullName,
    email,
    resetPasswordEmail,
    setResetPasswordEmail,
    handleResetPassword,
    handleLogout,
  };
}