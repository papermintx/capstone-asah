import { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // Load History saat mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto Scroll saat ada pesan baru
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadHistory = async () => {
    try {
      const res = await axiosClient.get("/chat?limit=50&offset=0");
      const formatted = (res.data?.data || []).map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === "user" ? "user" : "bot",
        createdAt: msg.createdAt,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Gagal memuat history chat:", err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Tambahkan pesan user
    const tempId = `u-${Date.now()}`;
    const userMsg = {
      id: tempId,
      text: text,
      sender: "user",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Kirim ke API
      const res = await axiosClient.post("/chat", { message: text });
      const botText = res.data?.text || "⚠️ Bot tidak memberikan balasan.";

      const botMsg = {
        id: `b-${Date.now()}`,
        text: botText,
        sender: "bot",
        createdAt: res.data?.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: `e-${Date.now()}`,
        text: "⚠️ Server tidak merespon. Coba lagi nanti.",
        sender: "bot",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    messageEndRef,
  };
}