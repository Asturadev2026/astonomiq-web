"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

type Message =
  | { type: "text"; role: "user" | "ai"; content: string }
  | { type: "table"; role: "ai"; content: any[] };

export default function AIChatWidget() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      type: "text",
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(
        "https://asturaintelligence.app.n8n.cloud/webhook/chat/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input }),
        }
      );

      const data = await res.json();

      // If database returned results
      if (data.result && Array.isArray(data.result)) {
        setMessages((prev) => [
          ...prev,
          {
            type: "table",
            role: "ai",
            content: data.result,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            role: "ai",
            content: "No records found.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "text", role: "ai", content: "Error fetching response." },
      ]);
    }
  };

  const renderTable = (data: any[]) => {
    if (!data.length) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto border rounded-lg mt-2">
        <table className="min-w-full text-xs border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-2 py-1 text-left border-b whitespace-nowrap"
                >
                  {col.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-2 py-1 border-b whitespace-nowrap"
                  >
                    {row[col] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-2xl border rounded-2xl overflow-hidden ${
          expanded ? "w-[600px] h-[500px]" : "w-14 h-14"
        }`}
      >
        {!expanded ? (
          <div className="flex items-center justify-center h-full bg-indigo-600 text-white rounded-2xl cursor-pointer">
            <MessageCircle size={22} />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">
              Recon AI Assistant
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.type === "text" && (
                    <div
                      className={`p-2 rounded-lg max-w-[90%] ${
                        m.role === "user"
                          ? "bg-indigo-100 ml-auto text-right"
                          : "bg-gray-100"
                      }`}
                    >
                      {m.content}
                    </div>
                  )}

                  {m.type === "table" && renderTable(m.content)}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t">
              <input
                className="flex-1 p-2 text-sm outline-none"
                placeholder="Ask about transactions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-3 text-indigo-600 hover:text-indigo-800"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
