"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useState, useRef } from "react";

export default function StatusPage() {
  const [viewingStory, setViewingStory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockStories = [
    { id: "s2", name: "@sigma_9", time: "10 minutes ago", isMe: false, hasUpdate: true, color: "from-[#00D4AA] to-blue-500" },
    { id: "s3", name: "@delta_force", time: "Today, 14:30", isMe: false, hasUpdate: true, color: "from-purple-500 to-pink-500" },
    { id: "s4", name: "@omega_zero", time: "Yesterday, 22:15", isMe: false, hasUpdate: false, color: "from-gray-600 to-gray-700" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        alert("Story uploaded successfully! (Mock)");
      }, 1500);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main Status List */}
        <div className="w-full sm:w-[350px] md:w-[400px] h-full flex flex-col border-r border-white/10 bg-black/20">
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/40">
            <h1 className="text-2xl font-bold tracking-tight text-white">Status</h1>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-white text-xl">➕</button>
              <button className="text-gray-400 hover:text-white text-xl">⋮</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* My Status - Upload Section */}
            <div>
              <div 
                className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-xl">
                    <img src="https://ui-avatars.com/api/?name=Alpha&background=00D4AA&color=000" alt="Profile" className="rounded-full w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00D4AA] rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black">
                    +
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white">My status</h3>
                  <p className="text-sm text-gray-400">
                    {isUploading ? "Uploading..." : "Tap to add status update"}
                  </p>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>

            <hr className="border-white/10" />

            {/* Recent Updates */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-4 px-2">Recent updates</h4>
              <div className="space-y-2">
                {mockStories.filter(s => s.hasUpdate).map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => setViewingStory(story.name)}
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
                  >
                    <div className={`p-[2px] rounded-full bg-gradient-to-tr ${story.color}`}>
                      <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-black flex items-center justify-center font-bold">
                        {story.name.substring(1, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">{story.name}</h3>
                      <p className="text-sm text-gray-400">{story.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viewed Updates */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-4 px-2 mt-4">Viewed updates</h4>
              <div className="space-y-2 opacity-60">
                {mockStories.filter(s => !s.isMe && !s.hasUpdate).map(story => (
                  <div key={story.id} className="flex items-center gap-4 p-2 rounded-xl">
                    <div className={`p-[2px] rounded-full bg-gradient-to-tr ${story.color}`}>
                      <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-black flex items-center justify-center font-bold">
                        {story.name.substring(1, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">{story.name}</h3>
                      <p className="text-sm text-gray-400">{story.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Story Viewer (Desktop) */}
        <div className="hidden sm:flex flex-1 items-center justify-center bg-black">
          {viewingStory ? (
            <div className="w-full max-w-md aspect-[9/16] bg-gray-900 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4">
              {/* Progress Bar */}
              <div className="flex gap-1 z-10 w-full mb-4">
                <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-1/3 animate-[width_3s_linear]"></div>
                </div>
              </div>
              
              {/* Story Header */}
              <div className="flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold border border-white/20">
                  {viewingStory.substring(1, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{viewingStory}</h3>
                  <p className="text-xs text-white/70">10 minutes ago</p>
                </div>
                <button className="ml-auto text-white/70 hover:text-white" onClick={() => setViewingStory(null)}>✕</button>
              </div>

              {/* Story Content */}
              <div className="absolute inset-0 flex items-center justify-center z-0 bg-gradient-to-br from-[#00D4AA]/20 to-blue-900/40">
                <p className="text-2xl font-bold text-center px-6">Encrypted Status Update 🔒</p>
              </div>

              {/* Reply Box */}
              <div className="z-10 mt-auto flex gap-2 pt-4 border-t border-white/10">
                <input 
                  type="text" 
                  placeholder="Reply..." 
                  className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:border-[#00D4AA] backdrop-blur-md"
                />
                <button className="text-2xl opacity-70 hover:opacity-100">❤️</button>
              </div>
            </div>
          ) : (
             <div className="text-center text-gray-500">
               <div className="text-6xl mb-4 opacity-20">⭕</div>
               <p>Click on a contact to view their status update</p>
             </div>
          )}
        </div>
      </div>
      
      {/* Mobile Story Viewer Overlay */}
      {viewingStory && (
        <div className="sm:hidden fixed inset-0 z-[60] bg-black">
          <div className="w-full h-full relative flex flex-col p-4 pb-8">
             {/* Progress Bar */}
             <div className="flex gap-1 z-10 w-full mb-4">
               <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-1/3 animate-[width_3s_linear]"></div>
               </div>
             </div>
             
             {/* Story Header */}
             <div className="flex items-center gap-3 z-10">
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold border border-white/20">
                 {viewingStory.substring(1, 2).toUpperCase()}
               </div>
               <div>
                 <h3 className="font-semibold text-shadow">{viewingStory}</h3>
                 <p className="text-xs text-white/70 text-shadow">10 minutes ago</p>
               </div>
               <button className="ml-auto text-white p-2" onClick={() => setViewingStory(null)}>✕</button>
             </div>

             {/* Story Content */}
             <div className="absolute inset-0 flex items-center justify-center z-0 bg-gradient-to-br from-[#00D4AA]/20 to-blue-900/40">
               <p className="text-2xl font-bold text-center px-6">Encrypted Status Update 🔒</p>
             </div>

             {/* Reply Box */}
             <div className="z-10 mt-auto pt-4 flex gap-2">
               <input 
                 type="text" 
                 placeholder="Reply..." 
                 className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] backdrop-blur-md"
               />
             </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
