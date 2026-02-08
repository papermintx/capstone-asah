import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function useSignup() {
  const navigate = useNavigate();

  // State
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handlers
  const handleChange = (e) => {
    if (error) setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authApi.signup(form);
      alert("Permintaan pendaftaran diterima. Silakan cek inbox email Anda untuk verifikasi akun.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "User already registered") {
        setError("Email ini sudah terdaftar. Silakan gunakan email lain atau login.");
      } else {
        setError(msg || "Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
}