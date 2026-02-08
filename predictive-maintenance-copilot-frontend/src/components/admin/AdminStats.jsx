import React from "react";
import { Users, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-500 mb-1">Total Users</p><p className="text-3xl font-bold text-purple-600">{stats.total}</p></div>
            <Users className="w-8 h-8 text-purple-300" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-500 mb-1">Active</p><p className="text-3xl font-bold text-green-500">{stats.active}</p></div>
            <div className="p-2 bg-green-50 rounded-full border border-green-100"><CheckCircle className="w-6 h-6 text-green-500" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-500 mb-1">Inactive</p><p className="text-3xl font-bold text-red-500">{stats.inactive}</p></div>
            <div className="p-2 bg-red-50 rounded-full border border-red-100"><XCircle className="w-6 h-6 text-red-400" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-500 mb-1">Admins</p><p className="text-3xl font-bold text-indigo-600">{stats.admins}</p></div>
            <div className="p-2 bg-indigo-50 rounded-full border border-indigo-100"><ShieldCheck className="w-6 h-6 text-indigo-400" /></div>
        </div>
    </div>
  );
}