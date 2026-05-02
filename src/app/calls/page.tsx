"use client";

import { AppLayout } from "@/components/layout/AppLayout";

export default function CallsPage() {
  const mockCalls = [
    { id: "1", name: "@sigma_9", time: "Today, 10:45 AM", type: "video", incoming: false, missed: false },
    { id: "2", name: "@delta_force", time: "Yesterday, 14:30", type: "voice", incoming: true, missed: true },
  ];

  return (
    <AppLayout>
      <div className="flex h-full">
        <div className="w-full sm:w-[350px] md:w-[400px] h-full flex flex-col border-r border-white/10 bg-black/20">
          
          <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/40">
            <h1 className="text-2xl font-bold tracking-tight text-white">Calls</h1>
            <button className="text-gray-400 hover:text-white text-xl">📞+</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-500 mb-4 px-2">Recent</h4>
            
            {mockCalls.map((call) => (
              <div key={call.id} className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold">
                  {call.name.substring(1, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${call.missed ? 'text-red-500' : 'text-gray-200'}`}>{call.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span className={call.incoming ? (call.missed ? 'text-red-500' : 'text-green-500') : 'text-gray-400'}>
                      {call.incoming ? '↙' : '↗'}
                    </span>
                    {call.time}
                  </div>
                </div>
                <div className="text-[#00D4AA] text-xl">
                  {call.type === 'video' ? '📹' : '📞'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Details View (Desktop) */}
        <div className="hidden sm:flex flex-1 items-center justify-center bg-black/40">
           <div className="text-center text-gray-500">
             <div className="text-6xl mb-4 opacity-20">📞</div>
             <p>Select a call from your history</p>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}
