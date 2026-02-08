import React from "react";
import { Activity, Play, Square, AlertTriangle } from "lucide-react";

export default function SimulatorPanel({ simType, onStartNormal, onStartAnomaly, onStop }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Normal */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 flex flex-col h-full ${simType === 'normal' ? 'border-green-400 shadow-green-100' : 'border-gray-100'}`}>
          <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${simType === 'normal' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}><Activity size={28} /></div>
                  <div><h3 className="font-bold text-gray-800 text-lg">Normal Simulation</h3><p className="text-xs text-gray-500 font-medium">Standard Operation Mode</p></div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${simType === 'normal' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${simType === 'normal' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>{simType === 'normal' ? 'RUNNING' : 'IDLE'}
              </div>
          </div>
          <div className="flex gap-3 mt-auto">
              <button onClick={onStartNormal} disabled={simType === 'normal'} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${simType === 'normal' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'}`}>
                  {simType === 'normal' ? 'Running...' : <><Play size={18} className="mr-2" /> Start Normal</>}
              </button>
              <button onClick={onStop} disabled={simType !== 'normal'} className="px-5 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50"><Square size={20} /></button>
          </div>
      </div>

      {/* Anomaly */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 flex flex-col h-full ${simType === 'anomaly' ? 'border-red-400 shadow-red-100' : 'border-gray-100'}`}>
          <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${simType === 'anomaly' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}><AlertTriangle size={28} /></div>
                  <div><h3 className="font-bold text-gray-800 text-lg">Anomaly Simulation</h3><p className="text-xs text-gray-500 font-medium">Fault Injection Mode</p></div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${simType === 'anomaly' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${simType === 'anomaly' ? 'bg-red-500 animate-ping' : 'bg-gray-400'}`}></div>{simType === 'anomaly' ? 'INJECTING' : 'IDLE'}
              </div>
          </div>
          <div className="flex gap-3 mt-auto">
              <button onClick={onStartAnomaly} disabled={simType === 'anomaly'} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${simType === 'anomaly' ? 'bg-red-100 text-red-700 cursor-default' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'}`}>
                  {simType === 'anomaly' ? 'Injecting Faults...' : <><AlertTriangle size={18} className="mr-2" /> Start Anomaly</>}
              </button>
              <button onClick={onStop} disabled={simType !== 'anomaly'} className="px-5 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50"><Square size={20} /></button>
          </div>
      </div>
    </div>
  );
}