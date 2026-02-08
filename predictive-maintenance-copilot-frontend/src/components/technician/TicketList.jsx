import React from "react";
import { 
  Inbox, Settings, CheckCircle, XCircle, 
  Clock, Cpu, User, MapPin, Pencil 
} from "lucide-react";

export default function TicketList({ tickets, loading, onUpdateClick }) {
  // Helpers
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (tickets.length === 0) return (
    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
      <Inbox className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>No tickets found</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <div key={ticket.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-amber-300 transition-all duration-300 bg-white hover:shadow-md group">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase flex items-center ${getBadgeStyle(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}{ticket.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center group-hover:text-amber-600 transition-colors">
                <Cpu className="w-5 h-5 mr-2 text-gray-400 group-hover:text-amber-500" />
                Machine: {ticket.machine?.name || ticket.machine?.productId || 'Unknown'}
              </h4>
              <div className="mb-4 w-full">
                <p className="text-gray-600 text-sm break-words whitespace-pre-wrap leading-relaxed">
                  {ticket.description}
                </p>
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap gap-4 border-t border-gray-50 pt-3">
                <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Req: {ticket.requestedBy?.email}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Loc: {ticket.machine?.location || 'N/A'}</span>
              </div>
            </div>
            
            {ticket.status !== 'closed' && ticket.status !== 'canceled' && (
              <div className="flex-shrink-0 md:ml-4 mt-2 md:mt-0">
                <button onClick={() => onUpdateClick(ticket)} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-bold transition text-sm flex items-center justify-center shadow-md shadow-amber-100 whitespace-nowrap">
                  <Pencil className="w-4 h-4 mr-2" /> Update
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}