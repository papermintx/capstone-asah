import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
       // Opsional: Logic Refresh Token bisa ditaruh di sini
       // Jika gagal refresh atau token mati:
       if (!window.location.pathname.includes("/login")) {
         Cookies.remove("accessToken");
         Cookies.remove("user");
         window.location.href = "/login";
       }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;