"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Fields required", {
        description: "Please enter both your email and password to log in.",
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.error("Database connection required", {
        description: "Authentication is closed during Beta. Please use guest mode.",
        duration: 4000,
      });
      setLoading(false);
    }, 8000);
  };

  const handleGuestAccess = () => {
    toast.success("Welcome, Guest User!", {
      description: "You have full access to analysis tools. No account required.",
      duration: 3000,
    });
    router.push("/dashboard");
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between">
      {/* TopNavBar */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            VentureLens AI
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={handleGuestAccess} className="text-primary hover:opacity-80 transition-opacity text-sm font-semibold">
              Enter Guest Mode
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Access VentureLens AI</h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Login is restricted to partner venture capital networks during public beta.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary bg-surface/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary bg-surface/50 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity active:scale-98 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? "Connecting to partner database..." : "Partner Login"}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink mx-4 text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">or</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          <button
            onClick={handleGuestAccess}
            className="w-full py-3 border border-secondary text-secondary hover:bg-secondary-container/20 rounded-lg text-sm font-bold transition-all active:scale-98"
          >
            Continue as Guest (No Registration)
          </button>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-6 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
