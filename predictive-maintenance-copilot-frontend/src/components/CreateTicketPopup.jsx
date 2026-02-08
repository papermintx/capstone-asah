import React from "react";
import { X, Tag, FileText } from "lucide-react";

export default function CreateTicketPopup({
  ticket,
  setTicket,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all scale-100 relative z-10 overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Tag size={16} className="text-gray-400" /> Ticket Title
            </label>
            <input
              type="text"
              value={ticket.title}
              onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
              placeholder="e.g., Abnormal Vibration Detected"
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" /> Description
            </label>
            <textarea
              value={ticket.description}
              onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-3 border h-32 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
            shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
          >
            Create Ticket
          </button>
        </div>

      </div>
    </div>
  );
}