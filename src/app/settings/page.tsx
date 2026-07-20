"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Users,
  Key,
  Bell,
  Trash2,
  Plus,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Check
} from "lucide-react";

type Tab = "account" | "billing" | "team" | "api" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  
  // Account States
  const [displayName, setDisplayName] = useState("VentureLens Guest");
  const [company, setCompany] = useState("Stealth Co");
  const [role, setRole] = useState("Founder");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");

  // API Key States
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string; lastUsed: string }[]>([]);
  const [newKeyName, setNewKeyName] = useState("");

  // Notification States
  const [notifs, setNotifs] = useState({
    onComplete: true,
    onFlags: true,
    weeklyDigest: false,
    updates: true,
    marketing: false
  });

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile Updated", {
      description: "Your local settings profiles have been saved successfully.",
      duration: 3000,
    });
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.warning("Name required", {
        description: "Please assign a label to your new API key.",
        duration: 3000,
      });
      return;
    }
    const newKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: `vl_live_` + Math.random().toString(36).substring(2, 14),
      created: new Date().toLocaleDateString(),
      lastUsed: "Never"
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    toast.success("API Key Generated", {
      description: `Key '${newKey.name}' generated. Copy it immediately.`,
      duration: 5000,
    });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    toast.info("API Key Revoked", {
      duration: 3000,
    });
  };

  const handleDeleteAccount = () => {
    toast.error("Action not permitted", {
      description: "Guest accounts cannot be deleted. Clear local storage database instead.",
      duration: 4000,
    });
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Navigation Header */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
              VentureLens AI
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Dashboard
              </Link>
              <Link href="/templates" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Templates
              </Link>
              <Link href="/settings" className="text-secondary border-b-2 border-secondary pb-1">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Tabs Navigation */}
          <aside className="w-full lg:w-64 bg-white rounded-xl border border-outline-variant/30 p-2 shadow-sm shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "account"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "billing"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Billing</span>
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "team"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Members</span>
              </button>
              <button
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "api"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Key className="w-4 h-4" />
                <span>API Credentials</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "notifications"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
            </nav>
          </aside>

          {/* Settings Canvas Area */}
          <div className="flex-1 w-full bg-white rounded-xl border border-outline-variant/30 p-8 shadow-sm">
            
            {/* Account Tab Content */}
            {activeTab === "account" && (
              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface mb-1">Account Profiles</h2>
                  <p className="text-xs text-on-surface-variant">Update your venture workspace preferences.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-sm focus:ring-2 focus:ring-secondary/15 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email (Read Only)</label>
                    <input
                      type="email"
                      value="guest@venturelens.ai"
                      disabled
                      className="w-full p-3 bg-surface-container-high border border-outline-variant/60 rounded-lg text-sm text-on-surface-variant cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-sm focus:ring-2 focus:ring-secondary/15 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Your Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-sm focus:ring-2 focus:ring-secondary/15 outline-none"
                    >
                      <option value="Founder">Founder / Startup Builder</option>
                      <option value="Investor">Investor / VC Associate</option>
                      <option value="Consultant">Product Consultant</option>
                      <option value="Student">Researcher / Student</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Time Zone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-sm focus:ring-2 focus:ring-secondary/15 outline-none"
                    >
                      <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                      <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-1.5 px-4 py-2 border border-error text-error text-xs font-bold rounded-lg hover:bg-error/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </form>
            )}

            {/* Billing Tab Content */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface mb-1">Billing & Plans</h2>
                  <p className="text-xs text-on-surface-variant">Manage your account plans and usage allocations.</p>
                </div>

                {/* Plan Card */}
                <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono font-bold rounded">
                      ACTIVE TIER
                    </span>
                    <h3 className="text-2xl font-extrabold text-on-surface mt-1">Free Beta Plan</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Unlimited basic analysis engines with local storage backups.</p>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-6 py-2.5 bg-secondary text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  >
                    View Pricing Plans
                  </Link>
                </div>

                {/* Usage meter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end text-xs">
                    <span className="font-bold text-on-surface-variant uppercase tracking-wider">Analysis Meter Usage</span>
                    <span className="font-mono text-on-surface-variant">3 / 10 analyses used</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[30%]" />
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Resets automatically on August 1, 2026. Upgrade to Pro for unlimited priority analysis.
                  </p>
                </div>

                {/* Stripe Placeholder */}
                <div className="pt-6 border-t border-outline-variant/20">
                  <h4 className="text-sm font-bold text-on-surface mb-3">Saved Payment Methods</h4>
                  <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center">
                    <CreditCard className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                    <p className="text-xs text-on-surface-variant">No credit cards saved. Stripe integration is offline in Guest mode.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab Content */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface mb-1">Team Workspace</h2>
                    <p className="text-xs text-on-surface-variant">Manage team members allowed to view your portfolio.</p>
                  </div>
                  <button
                    onClick={() => toast.info("Coming soon", { description: "Collaborative workspaces are on the Q3 roadmap." })}
                    className="flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Member</span>
                  </button>
                </div>

                <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/20 font-bold uppercase tracking-wider text-on-surface-variant">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Workspace Role</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant">
                      <tr>
                        <td className="p-4 font-bold text-on-surface">VentureLens Guest (You)</td>
                        <td className="p-4">guest@venturelens.ai</td>
                        <td className="p-4 font-mono">Owner</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Tip: Connect a collaborative Supabase database connection to invite team co-founders.
                </p>
              </div>
            )}

            {/* API Credentials Tab Content */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface mb-1">API Credentials</h2>
                  <p className="text-xs text-on-surface-variant">Generate secure REST API tokens to run analyses programmatically.</p>
                </div>

                <form onSubmit={handleGenerateKey} className="flex gap-4 items-end max-w-lg">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">API Token Label</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. CI/CD Pipeline Key"
                      className="w-full p-3 bg-surface border border-outline-variant/60 rounded-lg text-sm focus:ring-2 focus:ring-secondary/15 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  >
                    Generate Token
                  </button>
                </form>

                {apiKeys.length === 0 ? (
                  <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center">
                    <Key className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                    <p className="text-xs text-on-surface-variant mb-3">No active tokens generated yet.</p>
                    <button
                      onClick={() => {
                        setNewKeyName("Default Admin Key");
                      }}
                      className="text-xs text-secondary hover:underline font-semibold"
                    >
                      Pre-fill default token configuration
                    </button>
                  </div>
                ) : (
                  <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant/20 font-bold uppercase tracking-wider text-on-surface-variant">
                          <th className="p-4">Key Label</th>
                          <th className="p-4">Token Key</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant">
                        {apiKeys.map((key) => (
                          <tr key={key.id}>
                            <td className="p-4 font-semibold text-on-surface">{key.name}</td>
                            <td className="p-4 font-mono">{key.key}</td>
                            <td className="p-4">{key.created}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleRevokeKey(key.id)}
                                className="text-error hover:underline font-semibold"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    Requests this month: 0 / 1,000 quota limits
                  </span>
                  <Link
                    href="/platform"
                    className="text-secondary hover:underline text-xs font-bold flex items-center gap-1"
                  >
                    <span>Read API Integration Docs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Notifications Tab Content */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-on-surface mb-1">Notification Preferences</h2>
                  <p className="text-xs text-on-surface-variant">Configure email triggers and platform alerts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/20">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Analysis Completions</h4>
                      <p className="text-[11px] text-on-surface-variant">Notify me as soon as a 9-stage analysis finishes building.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifs.onComplete}
                        onChange={(e) => setNotifs({ ...notifs, onComplete: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/20">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Consistency Flags</h4>
                      <p className="text-[11px] text-on-surface-variant">Alert immediately if a competitor conflict or pricing mismatch is flagged.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifs.onFlags}
                        onChange={(e) => setNotifs({ ...notifs, onFlags: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/20">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Weekly Venture Digest</h4>
                      <p className="text-[11px] text-on-surface-variant">Receive a aggregated summary of pipeline tasks once a week.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifs.weeklyDigest}
                        onChange={(e) => setNotifs({ ...notifs, weeklyDigest: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/20">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Product Updates</h4>
                      <p className="text-[11px] text-on-surface-variant">Get notified when new rule logic checking patterns are integrated.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifs.updates}
                        onChange={(e) => setNotifs({ ...notifs, updates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={() => {
                      toast.success("Preferences Saved", { duration: 3000 });
                    }}
                    className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant mt-16">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
