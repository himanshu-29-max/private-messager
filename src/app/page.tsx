"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [displayId, setDisplayId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call delay
    setTimeout(() => {
      router.push("/vault");
    }, 800);
  };

  const handleGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '@anon_';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDisplayId(result);
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    setIsLoading(true);
    setTimeout(() => {
      router.push("/vault");
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-black text-white">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4AA] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF2D55] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 w-full max-w-md text-center mt-8 mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
          Private Messager
        </h1>
        <p className="text-gray-400 mb-8">Zero-Knowledge Ecosystem</p>

        <GlassPanel className="flex flex-col gap-6 text-left">
          <div>
            <h2 className="text-xl font-semibold mb-1">Identity Access</h2>
            <p className="text-sm text-gray-400">Login with your anonymous ID or linked account</p>
          </div>

          <form onSubmit={handleAccess} className="space-y-4">
            <div>
              <label htmlFor="displayId" className="block text-sm font-medium text-gray-300 mb-1">
                Display ID (or Phone/Email)
              </label>
              <input
                type="text"
                id="displayId"
                value={displayId}
                onChange={(e) => setDisplayId(e.target.value)}
                required
                placeholder="@alpha_7x"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (if set)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent transition-all"
              />
            </div>
            
            <Button type="submit" className="w-full py-3 mt-4" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Vault"}
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="ghost" className="border border-white/10 flex items-center justify-center gap-2" onClick={() => handleSocialLogin('google')}>
              <span className="text-lg">🌐</span> Google
            </Button>
            <Button variant="ghost" className="border border-white/10 flex items-center justify-center gap-2" onClick={() => handleSocialLogin('microsoft')}>
              <span className="text-lg">🪟</span> Microsoft
            </Button>
            <Button variant="ghost" className="border border-white/10 flex items-center justify-center gap-2" onClick={() => handleSocialLogin('apple')}>
              <span className="text-lg">🍏</span> Apple
            </Button>
            <Button variant="ghost" className="border border-white/10 flex items-center justify-center gap-2" onClick={() => handleSocialLogin('phone')}>
              <span className="text-lg">📱</span> Phone
            </Button>
          </div>

          <div className="mt-2 pt-4 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              New to the ecosystem?{" "}
              <button type="button" onClick={handleGenerate} className="text-[#00D4AA] hover:underline focus:outline-none">
                Generate Anonymous Identity
              </button>
            </p>
          </div>
        </GlassPanel>

        <div className="mt-12 flex justify-center items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse"></span>
          E2EE Connection Verified
        </div>
      </div>
    </main>
  );
}
