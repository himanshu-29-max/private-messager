"use client";

import { BottomNav } from "@/components/ui/BottomNav";
import { SidebarNav } from "@/components/ui/SidebarNav";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden pb-16 sm:pb-0">
        {/* Background glowing effects shared across the app */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#00D4AA] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF2D55] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.02] pointer-events-none"></div>
        
        <div className="z-10 h-full w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
