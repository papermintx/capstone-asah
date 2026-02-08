import React, { useState, useEffect } from "react";
import { Edit, X, Mail, User, ShieldCheck, CheckCircle, XCircle, UserCog } from "lucide-react";

export function EditUserPopup({ isOpen, user, onClose, onConfirm }) {
  const [form, setForm] = useState({ email: '', fullName: '', role: '' });

  useEffect(() => {
    if (user) setForm({ email: user.email, fullName: user.fullName || '', role: user.role });
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Edit size={20} className="text-gray-700" /> Edit User</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="space-y-5">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100"><label className="text-xs font-semibold text-gray-500 block mb-1">User ID</label><p className="text-xs text-gray-400 font-mono">{user.id}</p></div>
                <div><label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2"><Mail size={16} /> Email</label><input type="email" className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-purple-500 outline-none text-gray-700" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2"><User size={16} /> Full Name</label><input type="text" className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-purple-500 outline-none text-gray-700" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></div>
                
                {/* Role Select inside Edit User Popup */}
                <div>
                    <label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2"><ShieldCheck size={16} /> Role</label>
                    <select className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-purple-500 outline-none bg-white text-gray-700" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="admin">Admin</option><option value="technician">Technician</option><option value="operator">Operator</option><option value="viewer">Viewer</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <button onClick={onConfirm} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition"><CheckCircle size={18} /> Update User</button>
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold flex justify-center items-center gap-2 transition"><XCircle size={18} /> Cancel</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export function EditRolePopup({ isOpen, user, onClose, onConfirm }) {
  const [role, setRole] = useState('');

  useEffect(() => { if (user) setRole(user.role); }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><UserCog size={20} className="text-gray-700" /> Change Role</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="space-y-6">
                <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">User</label><p className="text-base font-semibold text-gray-800 mt-1">{user.email}</p></div>
                <hr className="border-gray-100" />
                <div>
                    <label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2"><ShieldCheck size={16} /> New Role</label>
                    <select className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-purple-500 outline-none bg-white text-gray-700" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option><option value="technician">Technician</option><option value="operator">Operator</option><option value="viewer">Viewer</option>
                    </select>
                </div>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => onConfirm(role)} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition"><CheckCircle size={18} /> Update Role</button>
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold flex justify-center items-center gap-2 transition"><XCircle size={18} /> Cancel</button>
                </div>
            </div>
        </div>
    </div>
  );
}