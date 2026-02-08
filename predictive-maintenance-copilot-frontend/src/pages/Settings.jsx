import React from "react";
import useSettings from "../hooks/useSettings";
import { Settings as SettingsIcon } from "lucide-react";

import SettingsSkeleton from "../components/settings/SettingsSkeleton";
import SettingsProfile from "../components/settings/SettingsProfile";
import SettingsResetPassword from "../components/settings/ResetPassword";
import SettingsLogout from "../components/settings/SettingsLogout";

export default function Settings() {
  const {
    loading,
    fullName,
    email,
    resetPasswordEmail,
    setResetPasswordEmail,
    handleResetPassword,
    handleLogout,
  } = useSettings();

  return (
    <div className="flex flex-col h-[94vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SettingsIcon size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Settings</h1>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Account & Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar relative">
        {loading ? (
           <SettingsSkeleton />
        ) : (
          <div className="space-y-6"> 
            <SettingsProfile 
              fullName={fullName} 
              email={email} 
            />

            <SettingsResetPassword
              email={resetPasswordEmail}
              onEmailChange={setResetPasswordEmail}
              onReset={handleResetPassword}
            />

            <SettingsLogout 
              onLogout={handleLogout} 
            />
          </div>
        )}
      </div>
    </div>
  );
}