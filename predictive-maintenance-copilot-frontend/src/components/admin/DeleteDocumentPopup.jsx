import React, { useState, useEffect } from "react";
import { Edit, X, Mail, User, ShieldCheck, CheckCircle, XCircle, UserCog, Trash2, AlertTriangle } from "lucide-react";

export function DeleteDocumentPopup({ isOpen, filename, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            
            {/* Icon Peringatan */}
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Document?</h3>
            
            <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <br/>
                <span className="font-bold text-gray-700">"{filename}"</span>?
                <br/>This action cannot be undone.
            </p>

            <div className="flex gap-3">
                <button 
                    onClick={onClose} 
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm} 
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
    </div>
  );
}