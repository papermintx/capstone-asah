import React, { useState, useRef } from "react";
import useChat from "../hooks/useChat";
import { Bot, Sparkles, ChevronDown } from "lucide-react";

import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import TypingIndicator from "../components/chat/TypingIndicator";

export default function Chat() {
  const { messages, isTyping, sendMessage, messageEndRef } = useChat();
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isFarFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight > 100;
    setShowScrollButton(isFarFromBottom);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  };

  return (
    <div className="flex flex-col h-[94vh] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20 shrink-0 shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Sentry Copilot</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-gray-500 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Area Chat */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="custom-scrollbar flex-1 bg-gray-50/50 p-4 md:p-6 overflow-y-auto relative scroll-smooth"
      >
        {/* Placeholder */}
        {messages.length === 0 && !isTyping && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-60 pointer-events-none">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              <Sparkles size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ada yang bisa saya bantu?
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Tanyakan tentang status mesin, prediksi kerusakan, atau jadwal maintenance.
            </p>
          </div>
        )}

        {/* List Pesan */}
        <div className="space-y-6 pb-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Floating Scroll Button */}
      <div 
        className={`absolute bottom-24 right-6 z-30 transition-all duration-300 transform ${
          showScrollButton ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToBottom}
          className="bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all flex items-center justify-center group"
          title="Kembali ke bawah"
        >
          <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 z-20">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}