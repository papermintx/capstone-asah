import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Info, Factory, Cpu } from "lucide-react"; // Menggunakan Factory/Cpu agar sesuai tema Machine
import axiosClient from "../api/axiosClient";

import useMachineDetailData from "../hooks/useMachineDetailData";

import DetailSkeleton from "../components/machine-detail/DetailSkeleton";
import DetailHeader from "../components/machine-detail/DetailHeader";
import StatusBadge from "../components/machine-detail/StatusBadge";
import SummaryGrid from "../components/machine-detail/SummaryGrid";
import PredictionCard from "../components/machine-detail/PredictionCard";
import TemperatureChart from "../components/machine-detail/TemperatureChart";
import CreateTicketPopup from "../components/CreateTicketPopup";

export default function MachineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    machine,
    statistics,
    tempData,
    latestPrediction,
    loading,
    error,
  } = useMachineDetailData(id);

  const [showPopup, setShowPopup] = useState(false);
  const [ticket, setTicket] = useState({
    priority: "Warning",
    title: "",
    description: "",
  });

  // Logic Submit Ticket
  const handleCreateTicket = async () => {
    try {
      if (!ticket.title || !ticket.description) {
        alert("Isi semua field sebelum membuat ticket.");
        return;
      }

      const payload = {
        machineId: id,
        title: ticket.title,
        description: ticket.description,
      };

      await axiosClient.post("/maintenance-tickets", payload);
      setShowPopup(false);
      navigate("/ticket");
    } catch (err) {
      console.error("Gagal membuat ticket:", err);
      alert("Gagal membuat ticket.");
    }
  };

  // State Error
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Detail Machine</h1>
        <p className="mt-6 text-gray-500">Gagal memuat detail mesin.</p>
      </div>
    );
  }

  // LOGIC TANGGAL
  const formattedDate = machine?.updatedAt 
    ? new Date(machine.updatedAt).toLocaleDateString("id-ID", {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md h-[94vh] overflow-auto custom-scrollbar">
      {/* State Loading */}
      {loading || !machine ? (
        <DetailSkeleton />
      ) : (
        <>
          {/* Main Content */}
          <DetailHeader 
            machine={machine} 
            onBack={() => navigate(-1)} 
            onCreateTicket={() => setShowPopup(true)} 
          />
          
          <StatusBadge status={machine.status} />
          
          <SummaryGrid machine={machine} statistics={statistics} />

          {/* DESCRIPTION CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <Cpu size={100} />
            </div>

            <div className="flex items-start gap-4 relative z-10">
              {/* Ikon Box */}
              <div className="p-3 bg-gray-100 text-gray-600 rounded-xl mt-1">
                <Cpu size={22} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Machine Description</h3>
                
                {/* Deskripsi */}
                <div className="text-gray-600 text-sm leading-7 text-justify">
                  {machine.description ? (
                    machine.description
                  ) : (
                    <span className="italic text-gray-400 flex items-center gap-2">
                      <Info size={16} /> No detailed description available for this unit.
                    </span>
                  )}
                </div>

                {/* Footer Data Teknis */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-xs text-gray-400 font-medium">
                  {/* Type */}
                  <span className="flex items-center gap-1">
                    <Factory size={12} /> Type: {machine.type || "-"}
                  </span>
                  
                  {/* Last Updated */}
                  {formattedDate && (
                    <span>Last Updated: {formattedDate}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <PredictionCard latestPrediction={latestPrediction} />
          
          <TemperatureChart data={tempData} />

          {/* Popup Ticket */}
          {showPopup && (
            <CreateTicketPopup
              ticket={ticket}
              setTicket={setTicket}
              technicians={[]}
              onClose={() => setShowPopup(false)}
              onSubmit={handleCreateTicket}
            />
          )}
        </>
      )}
    </div>
  );
}