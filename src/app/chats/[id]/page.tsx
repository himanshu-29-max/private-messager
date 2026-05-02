"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";

export default function DirectChat({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const chatId = resolvedParams.id;
  
  const [messages, setMessages] = useState([
    { id: "1", text: "Are the keys verified?", sender: "them", time: "10:41 AM", status: "READ" },
    { id: "2", text: "Yes, connection is secure.", sender: "me", time: "10:42 AM", status: "READ" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate remote user typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "SENT" // Will update to DELIVERED/READ via WebSocket
    }]);
    setNewMessage("");
  };

  const getStatusIcon = (status: string) => {
    if (status === "SENT") return <span className="text-gray-500 text-xs">✓</span>;
    if (status === "DELIVERED") return <span className="text-gray-500 text-xs tracking-[-2px]">✓✓</span>;
    if (status === "READ") return <span className="text-[#00D4AA] text-xs tracking-[-2px]">✓✓</span>;
    return null;
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Left Sidebar (Hidden on mobile when chat is open, visible on desktop) */}
        <div className="hidden sm:flex flex-col w-[350px] md:w-[400px] h-full border-r border-white/10 bg-black/20">
          <div className="p-4 flex justify-between items-center border-b border-white/5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Chats</h1>
            <button className="text-gray-400 hover:text-white" onClick={() => router.push('/chats')}>🔙</button>
          </div>
          {/* Mock active chat selection */}
          <div className="flex items-center gap-4 p-3 bg-white/5 border-l-4 border-[#00D4AA] cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-[#00D4AA]/50 flex items-center justify-center font-bold">
              S
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-200">@sigma_9</h3>
              <p className="text-sm text-[#00D4AA]">Typing...</p>
            </div>
          </div>
        </div>

        {/* Right Side Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] relative">
          {/* Chat Header */}
          <GlassPanel className="flex justify-between items-center rounded-none border-t-0 border-l-0 border-r-0 border-b border-white/10 py-3 px-4 bg-black/60 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button className="sm:hidden text-gray-400 mr-2" onClick={() => router.push('/chats')}>←</button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <h2 className="font-semibold text-lg leading-tight">@sigma_9</h2>
                <p className="text-xs text-[#00D4AA]">{isTyping ? "typing..." : "Online"}</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <button className="text-gray-400 hover:text-[#00D4AA] text-xl">📞</button>
              <button className="text-gray-400 hover:text-[#00D4AA] text-xl">📹</button>
              <button className="text-gray-400 hover:text-white text-xl">⋮</button>
            </div>
          </GlassPanel>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
            <div className="text-center my-4">
              <span className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full border border-white/10">
                🔒 Messages are end-to-end encrypted.
              </span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.sender === "me" ? "self-end items-end ml-auto" : "self-start items-start"}`}>
                <div className={`px-4 py-2 rounded-2xl relative group ${msg.sender === "me" ? "bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-white rounded-br-sm" : "bg-white/10 border border-white/5 rounded-bl-sm"}`}>
                  <p className="text-sm md:text-base leading-relaxed break-words">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                    {msg.sender === "me" && getStatusIcon(msg.status)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="self-start max-w-[75%] bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 w-16">
                 <div className="flex gap-1 justify-center items-center h-full">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-black/60 border-t border-white/10 backdrop-blur-md">
            <form onSubmit={handleSend} className="flex gap-2 items-center max-w-4xl mx-auto">
              <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors text-xl">😀</button>
              <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors text-xl" onClick={() => fileInputRef.current?.click()}>📎</button>
              <input type="file" ref={fileInputRef} className="hidden" />
              
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message" 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#00D4AA] text-sm sm:text-base"
              />
              
              {newMessage.trim() ? (
                <button type="submit" className="p-2.5 bg-[#00D4AA] text-black rounded-full hover:bg-[#00D4AA]/80 transition-colors">
                   <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              ) : (
                <button type="button" className="p-2.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors" title="Hold to record voice note">
                   <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
