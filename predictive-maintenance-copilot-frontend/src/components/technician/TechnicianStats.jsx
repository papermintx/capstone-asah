import React from "react";
import { Inbox, Settings, CheckCircle, XCircle } from "lucide-react";

export default function TechnicianStats({ stats }) {
  const cards = [
    { 
      label: 'Open', 
      count: stats.open, 
      icon: Inbox,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      countText: 'text-red-700',
      iconColor: 'text-red-300'
    },
    { 
      label: 'In Progress', 
      count: stats.in_progress, 
      icon: Settings,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      countText: 'text-blue-700',
      iconColor: 'text-blue-300'
    },
    { 
      label: 'Closed', 
      count: stats.closed, 
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      countText: 'text-green-700',
      iconColor: 'text-green-300'
    },
    { 
      label: 'Canceled', 
      count: stats.canceled, 
      icon: XCircle,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-600',
      countText: 'text-gray-700',
      iconColor: 'text-gray-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((stat, idx) => (
        <div key={idx} className={`${stat.bg} p-4 rounded-xl border ${stat.border} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${stat.text} font-semibold`}>{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.countText}`}>{stat.count}</p>
            </div>
            <stat.icon className={`w-10 h-10 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}