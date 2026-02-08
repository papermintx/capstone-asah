import React from "react";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
        <Bot size={16} className="text-blue-500/70" />
      </div>

      <div className="px-5 py-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1.5 w-fit">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}