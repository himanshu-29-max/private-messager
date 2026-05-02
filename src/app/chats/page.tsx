"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Mock Contacts/Chats + Rooms
  const mockChats = [
    { id: "chat1", name: "@sigma_9", lastMessage: "Are the keys verified?", time: "10:42 AM", unread: 2, isOnline: true, type: "direct" },
    { id: "room1", name: "Project Alpha Sync", lastMessage: "3 Members • PIN Required", time: "09:15 AM", unread: 5, isOnline: false, type: "room" },
    { id: "chat2", name: "@delta_force", lastMessage: "Meeting at 1400 hrs.", time: "Yesterday", unread: 0, isOnline: false, type: "direct" },
    { id: "room2", name: "Family Channel", lastMessage: "5 Members", time: "Yesterday", unread: 0, isOnline: false, type: "room" },
    { id: "chat3", name: "@omega_zero", lastMessage: "File transfer complete.", time: "Tuesday", unread: 0, isOnline: true, type: "direct" },
  ];

  const handleChatClick = (chat: any) => {
    if (chat.type === "room") {
      setSelectedRoomId(chat.id);
      setShowGatekeeper(true); // Always ask for PIN for this demo
    } else {
      router.push(`/chats/${chat.id}`);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGatekeeper(false);
    if (selectedRoomId) {
      router.push(`/rooms/${selectedRoomId}`);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateRoom(false);
    alert("Room created! (Mock)");
  };

  return (
    <AppLayout>
      <div className="flex h-full bg-black/60 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Left Sidebar / Main List */}
        <div className="w-full sm:w-[350px] md:w-[400px] h-full flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-3xl z-10">
          
          {/* Header */}
          <div className="p-5 flex justify-between items-center border-b border-white/5">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Chats</h1>
            <div className="flex gap-3">
              <button 
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-300 hover:text-white" 
                title="New Room (Group)" 
                onClick={() => setShowCreateRoom(true)}
              >
                <span className="text-lg">👥</span>
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 flex items-center justify-center transition-colors text-[#00D4AA]" 
                title="Add Contact" 
                onClick={() => setShowAddContact(true)}
              >
                <span className="text-lg">➕</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search @id or Room"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA] focus:bg-white/5 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1">
            {mockChats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => handleChatClick(chat)}
                className="flex items-center gap-4 p-3 hover:bg-white/[0.08] cursor-pointer rounded-2xl transition-all duration-300 border border-transparent hover:border-white/5 group"
              >
                {/* Avatar */}
                <div className="relative">
                  {chat.type === "room" ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF2D55]/20 to-[#FF2D55]/5 border border-[#FF2D55]/30 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                      👥
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                      {chat.name.substring(1, 2).toUpperCase()}
                    </div>
                  )}
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00D4AA] rounded-full border-2 border-black shadow-[0_0_8px_#00D4AA]"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold truncate ${chat.type === 'room' ? 'text-white' : 'text-gray-200'}`}>
                      {chat.name}
                    </h3>
                    <span className={`text-xs font-medium ${chat.unread > 0 ? "text-[#00D4AA]" : "text-gray-500"}`}>
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${chat.type === 'room' ? 'text-[#FF2D55]/80' : 'text-gray-400'}`}>
                      {chat.type === 'room' && chat.name.includes("Alpha") && <span className="text-xs border border-[#FF2D55]/40 px-1 rounded mr-1">🔒 PIN</span>}
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-[#00D4AA] text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_#00D4AA]/50">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Empty State (Hidden on mobile) */}
        <div className="hidden sm:flex flex-1 flex-col items-center justify-center z-10 relative">
          <div className="absolute w-64 h-64 bg-[#00D4AA]/5 rounded-full blur-[100px]"></div>
          <div className="text-7xl mb-8 opacity-20 transform hover:scale-110 transition-transform duration-700">💬</div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-3">
            The Fortress
          </h2>
          <p className="text-gray-500 text-sm max-w-md text-center font-medium leading-relaxed">
            Select a chat or room to start a Zero-Knowledge, End-to-End Encrypted conversation.
          </p>
          <div className="mt-10 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA] animate-pulse"></span>
            <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-widest">E2EE Connection Active</span>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-gray-900/80 border border-white/10 p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Add Contact</h2>
            <p className="text-gray-400 text-sm mb-6">Enter a user's @DisplayID to add them to your secure contacts.</p>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowAddContact(false); }}>
              <div>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00D4AA] transition-colors" 
                  placeholder="@display_id" 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium" onClick={() => setShowAddContact(false)}>Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-blue-500 text-black font-bold shadow-lg shadow-[#00D4AA]/20">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-gray-900/80 border border-white/10 p-6 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FF2D55]/20 flex items-center justify-center text-xl">👥</div>
              <h2 className="text-2xl font-bold text-white">Create Private Room</h2>
            </div>
            <form onSubmit={handleCreateRoom} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Room Name</label>
                <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00D4AA] transition-colors" placeholder="E.g., Confidential Ops" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#FF2D55] uppercase tracking-widest mb-2">Gatekeeper PIN</label>
                <input type="password" required className="w-full bg-black/50 border border-[#FF2D55]/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FF2D55] transition-colors" placeholder="Must be strong" />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium" onClick={() => setShowCreateRoom(false)}>Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF2D55] to-purple-600 text-white font-bold shadow-lg shadow-[#FF2D55]/20">Deploy Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gatekeeper PIN Modal */}
      {showGatekeeper && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF2D55]/20 to-[#FF2D55]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF2D55]/30 animate-pulse shadow-[0_0_30px_rgba(255,45,85,0.2)]">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Room Locked</h2>
            <p className="text-[#FF2D55] text-xs font-bold tracking-widest uppercase mb-10 bg-[#FF2D55]/10 inline-block px-3 py-1 rounded-full border border-[#FF2D55]/20">
              5 Failed Attempts = Auto-Destruct
            </p>
            
            <form onSubmit={handleVerifyPin} className="space-y-8">
              <input 
                type="password" 
                required 
                autoFocus
                className="w-full bg-transparent border-b-2 border-white/20 px-4 py-4 text-center text-4xl tracking-[1em] text-white focus:outline-none focus:border-[#00D4AA] transition-colors" 
                placeholder="••••" 
                maxLength={4}
              />
              <div className="flex gap-4">
                <button type="button" className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors font-bold text-gray-300" onClick={() => setShowGatekeeper(false)}>Abort</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#00D4AA] to-blue-500 text-black font-extrabold shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:scale-105 transition-transform">Enter Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
