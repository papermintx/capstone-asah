import React from "react";
import { 
  Activity, AlertTriangle, AlertCircle, BrainCircuit, 
  CalendarClock, Wrench, ShieldCheck, Radio, Timer 
} from "lucide-react";

export default function PredictionCard({ latestPrediction }) {
  if (!latestPrediction) return null;

  const { 
    riskScore, failurePredicted, failureType, 
    anomalyDetected, predictedFailureTime, confidence, timestamp 
  } = latestPrediction;

  const formatRiskScore = (score) => {
    if (score == null) return "0.0";
    if (score > 1) {
      return score.toFixed(1);
    }
    return (score * 100).toFixed(1);
  };

  // Status Logic
  let status = "healthy";
  if (failurePredicted) status = "critical";
  else if (anomalyDetected || riskScore >= 0.7) status = "warning";
  else if (riskScore >= 0.4) status = "caution";

  // Theme Configuration
  const themes = {
    healthy:  { color: "text-emerald-700", border: "border-emerald-500", bg: "bg-emerald-50/50", icon: Activity },
    caution:  { color: "text-blue-700",    border: "border-blue-500",    bg: "bg-blue-50/50",    icon: Activity },
    warning:  { color: "text-amber-700",   border: "border-amber-500",   bg: "bg-amber-50/50",   icon: AlertTriangle },
    critical: { color: "text-rose-700",    border: "border-rose-500",    bg: "bg-rose-50/50",    icon: AlertCircle },
  };
  
  const t = themes[status];
  const StatusIcon = t.icon;
  
  // Format Date
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString("id-ID", { 
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" 
  }) : "-";

  return (
    <div className={`w-full bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden flex flex-col md:flex-row`}>
      
      {/* Indicator */}
      <div className={`w-2 md:w-1.5 ${t.bg.replace('/50', '-500')} flex-shrink-0`}></div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-5">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl mt-1 ${t.bg}`}>
              <StatusIcon size={20} className={t.color} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Diagnostic Insight</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Timer size={12} />
                <span>Last Analysis: {fmtDate(timestamp)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confidence</span>
            <div className="flex items-center gap-1.5">
              <BrainCircuit size={16} className="text-indigo-500" />
              <span className="text-xl font-bold text-gray-800">{(confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Risk Probability</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900 tracking-tight">
                {/* --- MENGGUNAKAN HELPER FUNCTION DI SINI --- */}
                {formatRiskScore(riskScore)}
              </span>
              <span className="text-lg font-bold text-gray-400">%</span>
            </div>
          </div>

          {/* IDENTIFIED ISSUE */}
          <div className="flex flex-col justify-center border-l-0 md:border-l border-gray-100 md:pl-6">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Identified Issue</span>
            {failureType ? (
              <div className="flex items-start gap-3">
                <Wrench size={18} className="text-gray-600 mt-1" />
                <div>
                  <span className="block text-base font-bold text-gray-800 leading-tight">{failureType}</span>
                  {anomalyDetected && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                      Anomaly
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 opacity-60">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-500">No Active Issues</span>
              </div>
            )}
          </div>

          {/* TARGET TIMELINE */}
          <div className="flex flex-col justify-center border-l-0 md:border-l border-gray-100 md:pl-6">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Timeline</span>
            {predictedFailureTime ? (
              <div className="flex items-start gap-3">
                <CalendarClock size={18} className="text-rose-600 mt-1" />
                <div>
                  <span className="block text-base font-bold text-gray-800 leading-tight">
                    {fmtDate(predictedFailureTime)}
                  </span>
                  <span className="text-xs font-medium text-rose-600 mt-0.5 block">Estimated Failure</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 opacity-60">
                <Radio size={18} className="text-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-500">Continuous Monitoring</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}