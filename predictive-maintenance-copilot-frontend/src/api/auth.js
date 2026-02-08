import axiosClient from "./axiosClient";

export const authApi = {
  signup: (payload) => axiosClient.post("/auth/signup", payload),
  login: (payload) => axiosClient.post("/auth/signin", payload),
  me: () => axiosClient.get("/auth/me"),
  resetPassword: (payload) => axiosClient.post("/auth/reset-password", payload),
  updatePassword: (payload) => axiosClient.post("/auth/update-password", payload),
  logout: () => axiosClient.post("/auth/signout"),
};