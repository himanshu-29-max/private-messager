"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Chats", path: "/chats", icon: "💬" },
    { name: "Status", path: "/status", icon: "⭕" },
    { name: "Calls", path: "/calls", icon: "📞" },
  ];

  return (
    <div className="hidden sm:flex flex-col w-16 lg:w-64 bg-black/40 border-r border-white/10 h-screen py-4 justify-between">
      <div>
        <div className="px-4 mb-8 hidden lg:block">
          <h2 className="text-[#00D4AA] font-bold text-xl tracking-tight">Messager</h2>
        </div>
        <div className="flex flex-col gap-2 px-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`);
            return (
              <Link 
                key={tab.name} 
                href={tab.path} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isActive ? "bg-white/10 text-[#00D4AA]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="font-medium hidden lg:block">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="px-2">
        <Link 
          href="/settings" 
          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pathname.startsWith("/settings") ? "bg-white/10 text-[#00D4AA]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
        >
          <span className="text-2xl">⚙️</span>
          <span className="font-medium hidden lg:block">Settings</span>
        </Link>
        <Link 
          href="/vault" 
          className="flex items-center gap-4 p-3 mt-2 rounded-xl transition-all text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <span className="text-2xl">🔒</span>
          <span className="font-medium hidden lg:block">Vault</span>
        </Link>
      </div>
    </div>
  );
}
