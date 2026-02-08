import React, { useState, useEffect } from "react";
import { X, AlertTriangle, AlertCircle } from "lucide-react";

const NotificationItem = ({ n, removeNotification }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Trigger animasi masuk saat mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
  }, []);

  // Fungsi untuk menutup notifikasi
  const handleClose = () => {
    setIsExiting(true); 
    setTimeout(() => {
      removeNotification(n.id); 
    }, 400); 
  };

  // AUTO DISMISS
  useEffect(() => {
    const duration = 5000; 
    
    const timer = setTimeout(() => {
      handleClose(); 
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  // CONFIG TEMA
  const isCritical = n.type === "critical";
  const title = isCritical ? "Perlu Perbaikan" : "Perlu Perhatian";
  const message = `${title}: Mesin ${n.machine || "Unknown"} terdeteksi bermasalah`;

  const theme = isCritical
    ? {
        border: "border-l-rose-500",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        titleColor: "text-gray-900",
        icon: AlertCircle,
      }
    : {
        border: "border-l-amber-500",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        titleColor: "text-gray-900",
        icon: AlertTriangle,
      };

  const Icon = theme.icon;

  return (
    <div
      className={`
        w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${hasMounted && !isExiting 
          ? "opacity-100 translate-x-0 max-h-[200px] mb-3"
          : "opacity-0 translate-x-[100%] max-h-0 mb-0" 
        }
      `}
    >
      {/* CARD */}
      <div 
        className={`
          pointer-events-auto relative w-full bg-white rounded-lg shadow-xl shadow-gray-200/50 
          border border-gray-100 ${theme.border} border-l-[6px] 
          flex items-start p-4 gap-3 
          transform transition-transform duration-300 hover:translate-x-[-6px]
        `}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-full ${theme.iconBg}`}>
          <Icon size={20} className={theme.iconColor} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex justify-between items-start">
            <h4 className={`text-sm font-bold ${theme.titleColor} leading-tight`}>
              {title}
            </h4>
            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap ml-2">
              {n.time}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 -mt-1 -mr-1 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function NotificationToast({ notifications = [], removeNotification }) {
  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col w-full max-w-sm pointer-events-none">
      {notifications.map((n) => (
        <NotificationItem 
          key={n.id} 
          n={n} 
          removeNotification={removeNotification} 
        />
      ))}
    </div>
  );
}