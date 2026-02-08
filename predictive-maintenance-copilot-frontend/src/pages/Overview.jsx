import React from "react";
import { LayoutDashboard } from "lucide-react";

import useOverviewData from "../hooks/useOverviewData";
import useUserProfile from "../hooks/useUserProfile";

import OverviewSkeleton from "../components/overview/OverviewSkeleton";
import NotificationToast from "../components/common/NotificationToast";

import CardTotalMesin from "../components/overview/CardTotalMesin";
import CardRataRataSuhu from "../components/overview/CardRataRataSuhu";
import CardToolWear from "../components/overview/CardToolWear";
import CardKondisiUmum from "../components/overview/CardKondisiUmum";
import CardPerluPerhatian from "../components/overview/CardPerluPerhatian";
import CardPerluPerbaikan from "../components/overview/CardPerluPerbaikan";
import RingkasanStatusMesin from "../components/overview/RingkasanStatusMesin";

export default function Overview() {
  // DATA OVERVIEW
  const {
    machines,
    loading,
    error,
    totalMesin,
    avgTemp,
    avgWear,
    mesinPerhatian,
    mesinPerbaikan,
    kondisiUmum,
    kondisiStatus,
    notifications,
    removeNotification,
  } = useOverviewData();

  // USER PROFILE
  const { fullName } = useUserProfile();

  return (
    <div className="flex flex-col h-[94vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* NOTIFIKASI */}
      <NotificationToast 
        notifications={notifications} 
        removeNotification={removeNotification}
      />

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LayoutDashboard size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-gray-500 font-medium">Realtime Monitoring</span>
            </div>
          </div>
        </div>

        {/* Profil User */}
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Selamat Datang</p>
          <p className="text-sm font-bold text-gray-700">{fullName || "User"}</p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar relative">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            ⚠ Error fetching overview data. Please check connection.
          </div>
        )}

        {loading ? (
          <OverviewSkeleton />
        ) : (
          <>
            {/* GRID KARTU DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <CardTotalMesin total={totalMesin} />
              <CardRataRataSuhu avgTemp={avgTemp} />
              <CardToolWear
                avgWear={avgWear}
                progress={avgWear !== null ? Math.round(avgWear) : 0}
              />

              <CardKondisiUmum kondisiUmum={kondisiUmum} status={kondisiStatus} />
              <CardPerluPerhatian
                jumlah={mesinPerhatian}
                progress={machines.length ? Math.round((mesinPerhatian / machines.length) * 100) : 0}
              />
              <CardPerluPerbaikan
                jumlah={mesinPerbaikan}
                progress={machines.length ? Math.round((mesinPerbaikan / machines.length) * 100) : 0}
              />
            </div>

            {/* TABEL RINGKASAN */}
            <RingkasanStatusMesin machines={machines || []} />
          </>
        )}
      </div>
    </div>
  );
}