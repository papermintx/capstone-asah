import React, { useState, useEffect } from "react"; // Hapus useRef
import { adminServices } from "../api/adminServices";
import { toast } from "react-hot-toast";
import { Filter, RotateCw } from "lucide-react";

import AdminStats from "../components/admin/AdminStats";
import SimulatorPanel from "../components/admin/SimulatorPanel";
import UsersTable from "../components/admin/UsersTable";
import { EditUserPopup, EditRolePopup } from "../components/admin/AdminPopups"; 

// IMPORT HOOK DARI CONTEXT BARU
import { useSimulator } from "../context/SimulatorContext";

const Admin = () => {
  // PANGGIL STATE & FUNGSI DARI GLOBAL CONTEXT
  const { simType, startNormal, startAnomaly, stopAll } = useSimulator();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [rolePopupOpen, setRolePopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // Tidak perlu fetchMachines atau checkSimStatus disini lagi, 
    // karena sudah dihandle oleh SimulatorContext
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await adminServices.getAllUsers(); setUsers(data); } 
    catch (err) { toast.error("Failed to load users"); } finally { setLoading(false); }
  };

  // User Actions (Tetap disini karena spesifik halaman admin)
  const handleToggleStatus = async (id, isActive) => {
    try { await adminServices.toggleUserStatus(id, isActive ? "deactivate" : "activate"); fetchUsers(); toast.success("Status Updated"); } catch (err) {}
  };

  const handleUpdateRole = async (newRole) => {
    try { await adminServices.updateUserRole(selectedUser.id, newRole); toast.success("Role updated"); setRolePopupOpen(false); fetchUsers(); } catch (err) {}
  };

  const stats = {
    total: users.length, active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length, admins: users.filter(u => u.role === 'admin').length
  };

  const filteredUsers = users.filter(u => (filterRole === "all" || u.role === filterRole) && (filterStatus === "all" || (filterStatus === "active" ? u.isActive : !u.isActive)));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      <AdminStats stats={stats} />
      
      {/* SimulatorPanel sekarang dikendalikan oleh Global Context */}
      <SimulatorPanel 
        simType={simType} 
        onStartNormal={startNormal} 
        onStartAnomaly={startAnomaly} 
        onStop={stopAll} 
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <span className="text-gray-600 font-semibold flex items-center text-sm"><Filter size={16} className="mr-2" /> Filter:</span>
            <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 outline-none" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="all">All Roles</option><option value="admin">Admin</option><option value="technician">Technician</option><option value="operator">Operator</option>
            </select>
            <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm"><RotateCw size={16} /> Refresh</button>
      </div>

      <UsersTable 
        users={filteredUsers} 
        loading={loading} 
        onEdit={(u)=>{setSelectedUser(u); setEditPopupOpen(true)}} 
        onRole={(u)=>{setSelectedUser(u); setRolePopupOpen(true)}} 
        onToggleStatus={handleToggleStatus} 
      />

      <EditUserPopup isOpen={editPopupOpen} user={selectedUser} onClose={()=>setEditPopupOpen(false)} onConfirm={()=>{setEditPopupOpen(false); toast.success("User updated")}} />
      <EditRolePopup isOpen={rolePopupOpen} user={selectedUser} onClose={()=>setRolePopupOpen(false)} onConfirm={handleUpdateRole} />
    </div>
  );
};

export default Admin;