import React from "react";
import { 
  Users, CheckCircle, XCircle, ShieldCheck, 
  Mail, User, Wrench, Eye, Ban, Edit
} from "lucide-react";

export default function UsersTable({ users, loading, onEdit, onRole, onToggleStatus }) {
  const getRoleBadge = (role) => {
    const styles = {
      admin: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: ShieldCheck, label: 'Admin' },
      technician: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Wrench, label: 'Technician' },
      operator: { bg: 'bg-blue-100', text: 'text-blue-700', icon: User, label: 'Operator' },
      viewer: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Eye, label: 'Viewer' },
    };
    const style = styles[role] || styles.viewer;
    const Icon = style.icon;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center w-fit gap-1.5 ${style.bg} ${style.text}`}>
        <Icon size={12} strokeWidth={2.5} /> {style.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Users className="text-gray-700" size={24} />
            <h3 className="text-lg font-bold text-gray-800">Users <span className="text-purple-600 ml-1">({users.length})</span></h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 uppercase font-bold text-xs tracking-wider border-b border-gray-200">
                    <tr><th className="px-6 py-4">Email</th><th className="px-6 py-4">Full Name</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading...</td></tr> : users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-700"><div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" />{user.email}</div></td>
                            <td className="px-6 py-4 text-gray-600">{user.fullName || "User System"}</td>
                            <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center w-fit gap-1.5 ${user.isActive ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                                    {user.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />} {user.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(user)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition"><Edit size={12} /> Edit</button>
                                    <button onClick={() => onRole(user)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition"><ShieldCheck size={12} /> Role</button>
                                    <button onClick={() => onToggleStatus(user.id, user.isActive)} className={`${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition`}>
                                        {user.isActive ? <Ban size={12} /> : <CheckCircle size={12} />} {user.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}