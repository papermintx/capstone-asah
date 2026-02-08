import React, { useState, useEffect } from "react";
import { 
  Pencil, X, RotateCw, CheckCircle, XCircle, 
  Inbox, Settings 
} from "lucide-react";

export default function UpdateTicketModal({ isOpen, ticket, onClose, onConfirm }) {
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (isOpen) setNewStatus("");
  }, [isOpen]);

  if (!isOpen || !ticket) return null;

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Inbox className="w-3 h-3 mr-1" />;
      case 'in_progress': return <Settings className="w-3 h-3 mr-1" />;
      case 'closed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'canceled': return <XCircle className="w-3 h-3 mr-1" />;
      default: return <div className="w-2 h-2 rounded-full bg-current mr-2" />;
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    const map = {
        open: ['in_progress', 'canceled'], 
        in_progress: ['closed', 'open', 'canceled'], 
        closed: [],
        canceled: []
    };
    return map[currentStatus] || [];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-800 flex items-center">
            <Pencil className="w-5 h-5 mr-2 text-amber-500" /> Update Ticket
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Ticket Information</h4>
            <div className="space-y-3 text-sm">
              <p className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold text-gray-700 w-32 shrink-0">Machine:</span>
                <span className="text-gray-900 font-medium">{ticket.machine?.name || ticket.machine?.productId}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row">
                <span className="font-semibold text-gray-700 w-32 pt-1 shrink-0">Description:</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 break-words whitespace-pre-wrap pt-1 max-h-40 overflow-y-auto pr-2 border border-transparent">
                    {ticket.description}
                  </p>
                </div>
              </div>
              
              <p className="flex flex-col sm:flex-row sm:items-center pt-2">
                <span className="font-semibold text-gray-700 w-32 shrink-0">Current Status:</span>
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase w-fit flex items-center ${getBadgeStyle(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace('_', ' ')}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <RotateCw className="w-4 h-4 mr-2" /> Update Status
            </label>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none bg-white transition cursor-pointer hover:border-amber-400"
            >
              <option value="">-- Select New Status --</option>
              {getAvailableStatuses(ticket.status).map(st => (
                <option key={st} value={st}>
                    {st.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <button 
                onClick={() => onConfirm(newStatus)} 
                disabled={!newStatus}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-amber-200 flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Confirm Update
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold transition flex items-center justify-center">
              <XCircle className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}