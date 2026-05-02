"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Vault() {
  const router = useRouter();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateRoom(false);
  };

  const handleEnterRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowGatekeeper(true);
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGatekeeper(false);
    if (selectedRoomId) {
      router.push(`/rooms/${selectedRoomId}`);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center p-8 relative overflow-hidden bg-black text-white h-full overflow-y-auto">
        <div className="z-10 w-full max-w-4xl mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Secure Vault</h1>
              <p className="text-[#00D4AA] text-sm mt-1">Connected: @alpha_7x</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="ghost" className="border border-white/10" onClick={() => router.push('/settings')}>⚙️ Settings</Button>
              <Button onClick={() => setShowCreateRoom(true)}>+ Create Room</Button>
              <Button variant="danger" onClick={() => router.push('/')}>Lock</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Your Private Rooms</h2>
              
              <GlassPanel className="flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleEnterRoom("dummy-room-1")}>
                <div>
                  <h3 className="font-medium text-lg">Project Alpha Sync</h3>
                  <p className="text-sm text-gray-400">3 Members • Last active 2h ago</p>
                </div>
                <div className="text-xs bg-[#FF2D55]/20 text-[#FF2D55] px-2 py-1 rounded border border-[#FF2D55]/50">
                  PIN Required
                </div>
              </GlassPanel>

               <GlassPanel className="flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleEnterRoom("dummy-room-2")}>
                <div>
                  <h3 className="font-medium text-lg">Family Channel</h3>
                  <p className="text-sm text-gray-400">5 Members • Last active just now</p>
                </div>
                <div className="text-xs bg-[#FF2D55]/20 text-[#FF2D55] px-2 py-1 rounded border border-[#FF2D55]/50">
                  PIN Required
                </div>
              </GlassPanel>
            </div>

            <div className="space-y-6">
              <GlassPanel>
                <h3 className="font-semibold text-lg mb-4">Global Network</h3>
                <p className="text-sm text-gray-400 mb-4">Search for a user's Display ID to add them to a room.</p>
                <input
                  type="text"
                  placeholder="Search @id..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
                />
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <GlassPanel className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Create New Room</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Room Name</label>
                  <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00D4AA]" placeholder="E.g., Confidential Ops" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gatekeeper PIN</label>
                  <input type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#FF2D55]" placeholder="Must be strong" />
                </div>
                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setShowCreateRoom(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Create</Button>
                </div>
              </form>
            </GlassPanel>
          </div>
        )}

        {/* Gatekeeper PIN Modal */}
        {showGatekeeper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="w-full max-w-sm text-center">
              <div className="w-16 h-16 bg-[#FF2D55]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF2D55]/50 animate-pulse">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Room Locked</h2>
              <p className="text-[#FF2D55] text-sm mb-8 font-medium">WARNING: 5 failed attempts will permanently delete this room.</p>
              
              <form onSubmit={handleVerifyPin} className="space-y-6">
                <input 
                  type="password" 
                  required 
                  autoFocus
                  className="w-full bg-transparent border-b-2 border-white/20 px-4 py-3 text-center text-3xl tracking-widest text-white focus:outline-none focus:border-[#00D4AA] transition-colors" 
                  placeholder="••••" 
                />
                <div className="flex gap-4">
                  <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setShowGatekeeper(false)}>Abort</Button>
                  <Button type="submit" className="flex-1 bg-[#00D4AA] text-black">Enter</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
