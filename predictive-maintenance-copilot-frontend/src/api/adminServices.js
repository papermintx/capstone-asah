import axiosClient from "./axiosClient";

export const adminServices = {
  // User Management
  getAllUsers: () => axiosClient.get("/users"),
  updateUserRole: (userId, role) => axiosClient.patch(`/users/${userId}/role`, { role }),
  toggleUserStatus: (userId, action) => axiosClient.patch(`/users/${userId}/${action}`),
  
  // Simulator Controls (Admin)
  startNormalSimulator: () => axiosClient.post("/sensors/simulator/start"),
  triggerAnomaly: (machineId) => axiosClient.post(`/sensors/simulator/anomaly/${machineId}`),
  stopSimulator: () => axiosClient.post("/sensors/simulator/stop"),
  getSimulatorStatus: () => axiosClient.get("/sensors/simulator/status"),
  
  // Machine Data
  getMachines: () => axiosClient.get("/machines"),

  // Technician Tasks
  getAllTickets: () => axiosClient.get("/maintenance-tickets"),
  updateTicketStatus: (ticketId, status) => axiosClient.patch(`/maintenance-tickets/${ticketId}`, { status }),

  // RAG DOCUMENTS
  getAllDocuments: (params) => axiosClient.get("/documents", { params }), 
  
  // Endpoint ini HANYA untuk Admin
  uploadDocument: (formData) => axiosClient.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }, 
  }),
  
  // Endpoint ini HANYA untuk Admin
  deleteDocument: (id) => axiosClient.delete(`/documents/${id}`),
};