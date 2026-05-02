"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [currentView, setCurrentView] = useState("main"); // main, profile, blocked, password, login_activity
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileName, setProfileName] = useState("Alpha Agent");
  const [displayId, setDisplayId] = useState("@alpha_7x");

  const [blockedContacts, setBlockedContacts] = useState([
    { id: "b1", name: "@unknown_user", date: "Blocked yesterday" }
  ]);

  const [loginActivities] = useState([
    { id: "1", device: "Chrome on Windows", location: "New York, USA", time: "Active now", isCurrent: true, ip: "192.168.1.45" },
    { id: "2", device: "Safari on iPhone", location: "New York, USA", time: "Yesterday at 14:30", isCurrent: false, ip: "192.168.1.102" },
    { id: "3", device: "Firefox on Linux", location: "London, UK", time: "May 1 at 09:15", isCurrent: false, ip: "85.214.132.1" },
  ]);

  const renderMainSettings = () => (
    <>
      <div className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Profile Section */}
        <div 
          className="flex items-center gap-4 cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 p-5 rounded-2xl mb-4 border border-white/5 hover:border-[#00D4AA]/30 group"
          onClick={() => setCurrentView("profile")}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4AA] to-blue-600 p-[2px] shadow-lg shadow-[#00D4AA]/20 group-hover:shadow-[#00D4AA]/40 transition-shadow">
             <div className="w-full h-full rounded-full overflow-hidden bg-black">
               <img src="https://ui-avatars.com/api/?name=Alpha&background=00D4AA&color=000" alt="DP" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white group-hover:text-[#00D4AA] transition-colors">{profileName}</h2>
            <p className="text-sm text-gray-400 font-medium">{displayId}</p>
          </div>
          <div className="text-gray-500 group-hover:translate-x-1 transition-transform">▶</div>
        </div>

        <div className="space-y-2">
          <SettingItem icon="🔑" title="Account & Security" subtitle="Password, linked accounts, delete" onClick={() => setCurrentView("password")} />
          <SettingItem icon="🛡️" title="Login Activity" subtitle="View active sessions and devices" onClick={() => setCurrentView("login_activity")} />
          
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 transition-all hover:bg-white/[0.07]">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl text-blue-400">🔒</div>
              <div>
                <h3 className="font-semibold text-lg text-white">Privacy</h3>
                <p className="text-sm text-gray-400">Control your digital footprint</p>
              </div>
            </div>
            
            <div className="space-y-5 pl-14 pr-2">
              <div className="flex justify-between items-center group">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Last Seen & Online</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={lastSeen} onChange={() => setLastSeen(!lastSeen)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D4AA] shadow-inner"></div>
                </label>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Read Receipts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={readReceipts} onChange={() => setReadReceipts(!readReceipts)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D4AA] shadow-inner"></div>
                </label>
              </div>
              
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors"
                onClick={() => setCurrentView("blocked")}
              >
                <span className="text-sm text-red-400 font-semibold">Blocked Contacts</span>
                <span className="text-sm text-gray-500 bg-black/50 px-2 py-0.5 rounded-full">{blockedContacts.length} {'>'}</span>
              </div>
            </div>
          </div>

          <SettingItem icon="💬" title="Chats" subtitle="Theme, wallpapers, chat history" onClick={() => {}} />
          <SettingItem icon="🔔" title="Notifications" subtitle="Message, group & call tones" onClick={() => {}} />
        </div>

        <div className="pt-8 text-center text-red-500 font-semibold cursor-pointer p-4 hover:bg-red-500/10 rounded-2xl transition-all" onClick={() => router.push('/')}>
          Log out
        </div>
      </div>
    </>
  );

  const renderProfileEdit = () => (
    <>
      <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center gap-4">
        <button onClick={() => setCurrentView("main")} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00D4AA] text-xl transition-colors">←</button>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
      </div>
      <div className="p-6 flex flex-col items-center">
        <div className="relative group cursor-pointer mb-10 mt-4" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-full border-[3px] border-[#00D4AA] p-1 overflow-hidden bg-transparent flex items-center justify-center shadow-2xl shadow-[#00D4AA]/20 transition-transform group-hover:scale-105">
             <div className="w-full h-full rounded-full overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Alpha&background=00D4AA&color=000" alt="DP" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 m-1 backdrop-blur-sm">
            <span className="text-white text-3xl">📷</span>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
        </div>

        <div className="w-full space-y-4">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 focus-within:border-[#00D4AA]/50 focus-within:bg-white/10 transition-all">
            <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Name</label>
            <div className="flex items-center justify-between mt-2">
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-transparent text-xl font-medium text-white outline-none w-full"
              />
              <span className="text-gray-500 text-sm">✏️</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">This is not your username or pin. This name will be visible to your contacts.</p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 focus-within:border-[#00D4AA]/50 focus-within:bg-white/10 transition-all">
            <label className="text-xs text-[#00D4AA] uppercase font-bold tracking-widest">Display ID</label>
            <div className="flex items-center justify-between mt-2">
              <input 
                type="text" 
                value={displayId} 
                onChange={(e) => setDisplayId(e.target.value)}
                className="bg-transparent text-xl font-medium text-white outline-none w-full"
              />
              <span className="text-gray-500 text-sm">✏️</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Your unique identifier for the Zero-Knowledge network. Changing this will expire previous invite links.</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderBlockedContacts = () => (
    <>
      <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center gap-4">
        <button onClick={() => setCurrentView("main")} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00D4AA] text-xl transition-colors">←</button>
        <h1 className="text-xl font-bold tracking-tight text-white">Blocked Contacts</h1>
        <button className="ml-auto w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00D4AA] text-xl transition-colors">➕</button>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-6 text-center font-medium">Blocked contacts will no longer be able to call you or send you messages.</p>
        
        {blockedContacts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No blocked contacts</div>
        ) : (
          <div className="space-y-3">
            {blockedContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold border border-red-500/20">
                    Ø
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{contact.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{contact.date}</p>
                  </div>
                </div>
                <button 
                  className="text-xs font-semibold bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-white"
                  onClick={() => setBlockedContacts(blockedContacts.filter(c => c.id !== contact.id))}
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const handleBindAccount = (provider: string) => {
    alert(`Mock redirect to ${provider} OAuth flow...`);
  };

  const renderPasswordChange = () => (
    <>
      <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center gap-4">
        <button onClick={() => setCurrentView("main")} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00D4AA] text-xl transition-colors">←</button>
        <h1 className="text-xl font-bold tracking-tight text-white">Account & Security</h1>
      </div>
      <div className="p-4 overflow-y-auto pb-10">
        
        {/* Linked Accounts Section */}
        <div className="mb-6">
          <div className="px-2 mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Linked Accounts</h3>
            <p className="text-xs text-gray-500 mt-1">Bind accounts for recovery. Warning: This reduces anonymity.</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🌐</div>
                <span className="font-medium">Google Account</span>
              </div>
              <button className="text-sm font-semibold bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all text-white" onClick={() => handleBindAccount('Google')}>Bind</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl">🪟</div>
                <span className="font-medium">Microsoft Account</span>
              </div>
              <button className="text-sm font-semibold bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all text-white" onClick={() => handleBindAccount('Microsoft')}>Bind</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl">🍏</div>
                <span className="font-medium">Apple ID</span>
              </div>
              <button className="text-sm font-semibold bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all text-white" onClick={() => handleBindAccount('Apple')}>Bind</button>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mb-6">
           <div className="px-2 mb-3">
             <h3 className="text-xs font-bold text-[#00D4AA] uppercase tracking-widest">Change Password</h3>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
             <input type="password" placeholder="Current Password" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] focus:bg-black/60 transition-all placeholder-gray-600" />
             <input type="password" placeholder="New Password" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] focus:bg-black/60 transition-all placeholder-gray-600" />
             <input type="password" placeholder="Confirm New Password" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] focus:bg-black/60 transition-all placeholder-gray-600" />
             <button className="w-full bg-gradient-to-r from-[#00D4AA] to-blue-500 text-black font-bold py-3 rounded-xl mt-2 hover:shadow-lg hover:shadow-[#00D4AA]/20 transition-all transform hover:scale-[1.02]" onClick={() => { alert('Password changed!'); setCurrentView('main'); }}>Update Password</button>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl text-center hover:bg-red-500/10 transition-colors">
          <h2 className="text-red-500 font-bold mb-1">Danger Zone</h2>
          <p className="text-xs text-red-400/70 mb-4 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="bg-red-500/20 text-red-500 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all w-full">Permanently Delete Account</button>
        </div>
      </div>
    </>
  );

  const renderLoginActivity = () => (
    <>
      <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-4">
        <button onClick={() => setCurrentView("main")} className="text-[#00D4AA] text-xl">←</button>
        <h1 className="text-xl font-bold tracking-tight text-white">Login Activity</h1>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-6">Review devices currently logged into your account. If you don't recognize a device, log it out immediately.</p>
        
        <div className="space-y-3">
          {loginActivities.map(activity => (
            <div key={activity.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{activity.device.includes('iPhone') ? '📱' : '💻'}</div>
                  <div>
                    <h3 className="font-semibold text-white">{activity.device}</h3>
                    <p className="text-xs text-gray-400">{activity.location} • {activity.ip}</p>
                  </div>
                </div>
                {activity.isCurrent && (
                  <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-bold px-2 py-1 rounded border border-[#00D4AA]/50 uppercase">Current</span>
                )}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-gray-500">{activity.time}</span>
                {!activity.isCurrent && (
                  <button className="text-xs text-red-500 hover:text-red-400 font-semibold" onClick={() => alert('Device logged out')}>Log out device</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Dynamic Settings Pane */}
        <div className="w-full sm:w-[350px] md:w-[400px] h-full flex flex-col border-r border-white/10 bg-black/20">
          {currentView === "main" && renderMainSettings()}
          {currentView === "profile" && renderProfileEdit()}
          {currentView === "blocked" && renderBlockedContacts()}
          {currentView === "password" && renderPasswordChange()}
          {currentView === "login_activity" && renderLoginActivity()}
        </div>

        {/* Right Side: Details View (Desktop) */}
        <div className="hidden sm:flex flex-1 items-center justify-center bg-black/40">
           <div className="text-center text-gray-500">
             <div className="text-6xl mb-4 opacity-20">
               {currentView === "profile" ? "👤" : currentView === "blocked" ? "🚫" : currentView === "password" ? "🔑" : currentView === "login_activity" ? "🛡️" : "⚙️"}
             </div>
             <p>
               {currentView === "profile" ? "Customize your public identity" : 
                currentView === "blocked" ? "Manage blocked connections" : 
                currentView === "password" ? "Update your security credentials" : 
                currentView === "login_activity" ? "Monitor your account access" : 
                "Select a setting to view details"}
             </p>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SettingItem({ icon, title, subtitle, onClick }: { icon: string, title: string, subtitle: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer rounded-xl transition-colors"
    >
      <div className="text-2xl opacity-80 w-8 text-center">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <div className="text-gray-500">▶</div>
    </div>
  );
}
