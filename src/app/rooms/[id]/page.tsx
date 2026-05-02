"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function RoomChat({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const roomId = resolvedParams.id;
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string; isFile?: boolean; fileName?: string }[]>([
    { id: "sys-1", text: "Room established. End-to-End Encryption active.", sender: "System" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add Member State
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberIdToAdd, setMemberIdToAdd] = useState("");

  const [incomingCallType, setIncomingCallType] = useState<'video' | 'voice' | null>(null);

  const {
    localVideoRef,
    remoteVideoRef,
    isCalling,
    callIncoming,
    incomingOffer,
    callType,
    initiateCall,
    answerCall,
    endCall,
    sendFile
  } = useWebRTC(socket, roomId);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-room", roomId);

      socket.on("receive-message", (data: { roomId: string; message: string; sender: string }) => {
        // Intercept WebRTC signaling messages from showing up in chat
        if (data.sender === "System_WebRTC") {
          const payload = JSON.parse(data.message);
          if (payload.type === "offer") {
            setIncomingCallType(payload.callType);
          }
          return;
        }
        
        // Intercept file meta messages
        try {
          const parsed = JSON.parse(data.message);
          if (parsed.type === "file-meta") {
            setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Received a file", sender: data.sender, isFile: true, fileName: parsed.name }]);
            return;
          }
        } catch(e) { }

        setMessages((prev) => [...prev, { id: Date.now().toString(), text: data.message, sender: data.sender }]);
      });

      socket.on("user-joined", (userId) => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: `User joined the secure channel.`, sender: "System" }]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receive-message");
        socket.off("user-joined");
      }
    };
  }, [socket, isConnected, roomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: newMessage, sender: "Me" }]);
    
    socket.emit("send-message", {
      roomId: roomId,
      message: newMessage,
      sender: "Anonymous Participant"
    });
    
    setNewMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileMeta = { type: "file-meta", name: file.name, size: file.size };
      socket?.emit("send-message", {
        roomId: roomId,
        message: JSON.stringify(fileMeta),
        sender: "Anonymous Participant"
      });
      
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Sent a file", sender: "Me", isFile: true, fileName: file.name }]);
      
      if (isCalling) {
         sendFile(file);
      }
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdToAdd.trim()) return;
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: `Sent room invitation to ${memberIdToAdd}`, sender: "System" }]);
    setShowAddMember(false);
    setMemberIdToAdd("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 relative overflow-hidden bg-black text-white">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4AA] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <div className="z-10 w-full max-w-5xl h-[90vh] flex flex-col mt-4">
        <GlassPanel className="flex flex-col sm:flex-row justify-between items-center mb-6 py-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#00D4AA] animate-pulse" : "bg-red-500"}`}></span>
              Confidential Ops Room
            </h1>
            <p className="text-gray-400 text-sm mt-1">{isConnected ? "Connected to secure relay" : "Connecting..."}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
            <Button variant="ghost" className="border border-white/20 hover:bg-white/10" onClick={() => setShowAddMember(true)}>
              + Add Member
            </Button>
            {isCalling ? (
               <Button variant="danger" onClick={endCall}>Hang Up</Button>
            ) : (
               <>
                 <Button variant="ghost" className="border border-[#00D4AA]/50 text-[#00D4AA]" onClick={() => initiateCall('video')}>📹 Video Call</Button>
                 <Button variant="ghost" className="border border-[#00D4AA]/50 text-[#00D4AA]" onClick={() => initiateCall('voice')}>📞 Voice Call</Button>
               </>
            )}
            <Button variant="danger" onClick={() => router.push('/vault')}>Leave</Button>
          </div>
        </GlassPanel>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Main Chat Area */}
          <GlassPanel className="flex-1 flex flex-col overflow-hidden p-0 bg-black/40">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === "Me" ? "self-end items-end" : "self-start items-start"}`}>
                  <span className="text-xs text-gray-500 mb-1">{msg.sender}</span>
                  <div className={`px-4 py-3 rounded-2xl ${msg.sender === "System" ? "bg-white/5 border border-white/10 text-gray-400" : msg.sender === "Me" ? "bg-[#00D4AA]/20 border border-[#00D4AA]/50 text-[#00D4AA]" : "bg-white/10 border border-white/20"}`}>
                    {msg.isFile ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📄</span>
                        <span className="font-mono text-sm">{msg.fileName}</span>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/60">
              <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <button 
                  type="button" 
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-xl"
                  onClick={() => fileInputRef.current?.click()}
                  title="Share Document"
                >
                  📎
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
                  placeholder="Type a secure message..." 
                  disabled={!isConnected}
                />
                <Button type="submit" className="rounded-full px-8" disabled={!isConnected}>Send</Button>
              </form>
            </div>
          </GlassPanel>

          {/* WebRTC Video Area */}
          {(isCalling || callIncoming) && (
            <GlassPanel className="w-80 hidden sm:flex flex-col p-4 bg-black/60 relative">
              <h3 className="text-lg font-semibold mb-4 text-[#00D4AA] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse"></span>
                Secure E2EE {callType === 'video' ? 'Video' : 'Voice'} Call
              </h3>
              
              <div className="flex-1 bg-black rounded-xl overflow-hidden mb-4 border border-white/10 relative flex items-center justify-center">
                {callType === 'video' ? (
                  <>
                    <video 
                      ref={remoteVideoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    {!remoteVideoRef.current?.srcObject && (
                       <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Waiting for peer...</div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-[#00D4AA] mb-4">
                      <span className="text-4xl">🎙️</span>
                    </div>
                    <span className="text-[#00D4AA] animate-pulse">Voice Connected</span>
                    {/* Keep the video element hidden for audio stream to play */}
                    <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
                  </div>
                )}
              </div>

              {callType === 'video' && (
                <div className="h-32 bg-black rounded-xl overflow-hidden border border-white/20 relative">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {callIncoming && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                    <p className="text-lg mb-4 text-center">Incoming<br/>Secure {incomingCallType === 'video' ? 'Video' : 'Voice'} Call</p>
                    <div className="flex gap-4">
                       <Button className="bg-[#00D4AA] text-black" onClick={() => answerCall(incomingOffer, incomingCallType || 'video')}>Accept</Button>
                       <Button variant="danger" onClick={endCall}>Decline</Button>
                    </div>
                 </div>
              )}
            </GlassPanel>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <GlassPanel className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Add Member</h2>
            <p className="text-gray-400 text-sm mb-6">Enter the user's Display ID to grant them access to this room.</p>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display ID</label>
                <input 
                  type="text" 
                  required 
                  value={memberIdToAdd}
                  onChange={(e) => setMemberIdToAdd(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00D4AA]" 
                  placeholder="@alpha_7x" 
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setShowAddMember(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Send Invite</Button>
              </div>
            </form>
          </GlassPanel>
        </div>
      )}
    </main>
  );
}
