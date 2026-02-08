import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";

const markdownComponents = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 text-sm leading-relaxed whitespace-pre-line">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-4 mb-2 space-y-1 text-sm">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  h1: ({ children }) => (
    <h1 className="text-lg font-bold mb-2 mt-2 border-b pb-1">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold mb-2 mt-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mb-1">{children}</h3>
  ),
  code: ({ children }) => (
    // Ubah text-emerald -> text-blue
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-blue-700 border border-gray-200">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    // Ubah border-emerald -> border-blue
    <blockquote className="border-l-4 border-blue-500 pl-3 italic text-gray-500 my-2">
      {children}
    </blockquote>
  ),
};

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex w-full gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      
      {/* Avatar Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm 
        ${isUser ? "bg-white border-gray-200" : "bg-blue-100 border-blue-200"}`}>
        {isUser ? (
          <User size={16} className="text-gray-600" />
        ) : (
          <Bot size={16} className="text-blue-600" />
        )}
      </div>

      {/* Bubble Message */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-gray-500">
            {isUser ? "Anda" : "Copilot"}
          </span>
        </div>

        <div
          className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm border 
          ${isUser
            // USER: Biru (bg-blue-600)
            ? "bg-blue-600 text-white rounded-tr-none border-blue-600"
            // BOT: Putih (Default)
            : "bg-white text-gray-700 rounded-tl-none border-gray-200"
          }`}
        >
          {!isUser ? (
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
          )}
        </div>
      </div>
    </div>
  );
}