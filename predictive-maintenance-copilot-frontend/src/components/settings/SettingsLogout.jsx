import React from "react";

export default function SettingsLogout({ onLogout }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-red-300">
      <h2 className="text-xl font-bold text-red-600 mb-2">Logout</h2>
      <p className="text-gray-500 text-sm mb-4">Keluar dari aplikasi</p>

      <button
        onClick={onLogout}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 
                   transition-all duration-200 hover:scale-[1.03] active:scale-95"
      >
        Logout
      </button>
    </div>
  );
}