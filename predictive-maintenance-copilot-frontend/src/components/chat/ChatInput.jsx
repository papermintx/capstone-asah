import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize logic
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    if (text === "") {
      const textarea = textareaRef.current;
      if (textarea) textarea.style.height = "auto";
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    
    onSend(text);
    setText("");
    
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    adjustHeight();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 w-full"
    >
      {/* TEXTAREA INPUT */}
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ketik pesan Anda di sini..."
        className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3.5 
        focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
        transition-all shadow-sm resize-none overflow-y-auto min-h-[46px]"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        // Style scrollbar khusus untuk textarea ini juga
        style={{ 
            maxHeight: "120px",
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent" 
        }}
      />
      
      {/* TOMBOL KIRIM */}
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        // Ukuran fixed h-[46px] w-[46px] sama dengan tinggi awal textarea (padding + line-height)
        className={`h-[46px] w-[46px] rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm
          ${!text.trim() || disabled 
            ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
            : "text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
          }`}
      >
        <Send size={20} className={!text.trim() || disabled ? "opacity-50" : "opacity-100"} />
      </button>
    </form>
  );
}