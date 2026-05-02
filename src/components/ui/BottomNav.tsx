"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Status", path: "/status", icon: "⭕" },
    { name: "Calls", path: "/calls", icon: "📞" },
    { name: "Chats", path: "/chats", icon: "💬" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 z-50 sm:hidden">
      <div className="flex justify-around items-center p-2 pb-safe">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`);
          return (
            <Link 
              key={tab.name} 
              href={tab.path} 
              className={`flex flex-col items-center p-2 min-w-[64px] transition-colors ${isActive ? "text-[#00D4AA]" : "text-gray-500 hover:text-gray-300"}`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
