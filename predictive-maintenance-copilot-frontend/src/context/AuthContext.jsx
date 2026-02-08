import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("accessToken");
      const savedUser = Cookies.get("user");

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post("/auth/signin", { email, password });
      
      // Simpan cookie
      const cookieOptions = { expires: 1, secure: false, sameSite: 'Strict' };
      Cookies.set("accessToken", data.accessToken, cookieOptions);
      Cookies.set("refreshToken", data.refreshToken, cookieOptions);
      Cookies.set("user", JSON.stringify(data.user), cookieOptions);
      
      setUser(data.user);

      // Redirect Sesuai Role
      if (data.user.role === "technician") {
        navigate("/technician", { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);