"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_TOURNAMENTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Shield, Users, Trophy, DollarSign, BarChart3, Bell, Ban, CheckCircle2, XCircle, Clock, Settings, Plus, Edit, Trash2, Eye, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTab = "overview" | "tournaments" | "users" | "payments" | "announcements";

const MOCK_PENDING_PAYMENTS = [
  { id: "p1", user: "CyberWarrior99", amount: 500, txId: "UPI123456789", time: "2 min ago" },
  { id: "p2", user: "NeonSniper88", amount: 1000, txId: "UPI987654321", time: "15 min ago" },
  { id: "p3", user: "GhostRider_X", amount: 200, txId: "UPI555666777", time: "32 min ago" },
];

const MOCK_USERS_ADMIN = [
  { id: "u1", username: "NightShade_X", email: "night@example.com", balance: 5200, status: "active", joined: "Jan 2025" },
  { id: "u2", username: "ShadowKing99", email: "shadow@example.com", balance: 1800, status: "active", joined: "Feb 2025" },
  { id: "u3", username: "BannedUser01", email: "banned@example.com", balance: 0, status: "banned", joined: "Mar 2025" },
];

function OverviewTab() {
  const stats = [
    { label: "Total Revenue", value: "₹4.2L", change: "+18%", icon: <DollarSign className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "Active Players", value: "14,258", change: "+342", icon: <Users className="w-5 h-5" />, color: "text-cyan-400" },
    { label: "Live Tournaments", value: "7", change: "right now", icon: <Trophy className="w-5 h-5" />, color: "text-red-400" },
    { label: "Pending Payments", value: "12", change: "needs review", icon: <Clock className="w-5 h-5" />, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-5"
          >
            <div className={cn("mb-3", s.color)}>{s.icon}</div>
            <p className="text-slate-400 text-xs font-heading mb-1">{s.label}</p>
            <p className={cn("font-display font-black text-2xl", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 font-heading mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-white">Revenue Overview</h3>
          <div className="flex items-center gap-2 text-green-400 text-sm font-heading">
            <TrendingUp className="w-4 h-4" /> +22% this month
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[35, 60, 45, 80, 65, 90, 75, 85, 70, 95, 88, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${h}%`, background: "linear-gradient(to top, #7c3aed, #06b6d4)" }} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
            <span key={m} className="text-xs text-slate-600 font-heading flex-1 text-center">{m}</span>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading font-bold text-white mb-4">Pending Payments</h3>
        <div className="space-y-3">
          {MOCK_PENDING_PAYMENTS.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0">
                {p.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-white text-sm">{p.user}</p>
                <p className="text-xs text-slate-400 font-heading font-mono">{p.txId}</p>
              </div>
              <span className="font-display font-bold text-yellow-400 text-sm">₹{p.amount}</span>
              <span className="text-xs text-slate-500 font-heading hidden sm:block">{p.time}</span>
              <div className="flex gap-1.5">
                <button className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TournamentsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-white">All Tournaments</h3>
        <button className="btn-primary relative px-4 py-2 rounded-xl text-sm font-heading font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Create Tournament</span>
        </button>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full gaming-table">
          <thead>
            <tr>
              <th className="text-left">Tournament</th>
              <th className="text-left hidden sm:table-cell">Game</th>
              <th className="text-right hidden md:table-cell">Prize</th>
              <th className="text-right hidden md:table-cell">Slots</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TOURNAMENTS.map((t) => (
              <tr key={t.id} className="group">
                <td className="font-heading font-semibold text-white text-sm">{t.title}</td>
                <td className="hidden sm:table-cell text-slate-400 text-sm font-heading">{t.game}</td>
                <td className="hidden md:table-cell text-right font-display font-bold text-yellow-400 text-xs">{formatCurrency(t.prize_pool)}</td>
                <td className="hidden md:table-cell text-right text-xs font-heading text-slate-300">{t.filled_slots}/{t.max_slots}</td>
                <td className="text-center">
                  <span className={cn("text-xs font-heading font-bold border rounded-full px-2 py-0.5", `status-${t.status}`)}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple/30 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-white">User Management</h3>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full gaming-table">
          <thead>
            <tr>
              <th className="text-left">Player</th>
              <th className="text-left hidden sm:table-cell">Email</th>
              <th className="text-right hidden md:table-cell">Balance</th>
              <th className="text-left hidden sm:table-cell">Joined</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS_ADMIN.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-xs text-white">
                      {u.username[0]}
                    </div>
                    <span className="font-heading font-semibold text-white text-sm">{u.username}</span>
                  </div>
                </td>
                <td className="hidden sm:table-cell text-slate-400 text-xs font-heading">{u.email}</td>
                <td className="hidden md:table-cell text-right font-display font-bold text-yellow-400 text-xs">₹{u.balance.toLocaleString()}</td>
                <td className="hidden sm:table-cell text-slate-400 text-xs font-heading">{u.joined}</td>
                <td className="text-center">
                  <span className={cn("text-xs font-heading font-bold border rounded-full px-2 py-0.5", u.status === "banned" ? "status-live" : "status-upcoming")}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="text-center">
                  <button className={cn("w-7 h-7 rounded-lg border flex items-center justify-center transition-colors mx-auto",
                    u.status === "banned"
                      ? "border-green-500/30 text-green-400 hover:bg-green-500/20"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/20"
                  )}>
                    {u.status === "banned" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "tournaments", label: "Tournaments", icon: <Trophy className="w-4 h-4" /> },
    { key: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { key: "payments", label: "Payments", icon: <DollarSign className="w-4 h-4" /> },
    { key: "announcements", label: "Announce", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-700 rounded-xl flex items-center justify-center glow-purple">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
              ADMIN <span className="gradient-text">PANEL</span>
            </h1>
            <p className="text-slate-400 text-sm font-heading">Manage tournaments, users, and payments</p>
          </div>
          <div className="ml-auto flex items-center gap-2 live-badge border rounded-full px-3 py-1.5 text-xs font-heading font-semibold">
            <Shield className="w-3 h-3" /> ADMIN ACCESS
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-black/30 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-heading font-bold tracking-wide transition-all whitespace-nowrap",
                activeTab === tab.key ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "tournaments" && <TournamentsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "payments" && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-bold text-white mb-4">Payment Approvals</h3>
              <div className="space-y-3">
                {MOCK_PENDING_PAYMENTS.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-yellow-500/20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-sm text-white">
                      {p.user[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-white">{p.user}</p>
                      <p className="text-xs text-slate-400 font-heading">TX: <span className="font-mono text-cyan-400">{p.txId}</span> · {p.time}</p>
                    </div>
                    <span className="font-display font-black text-lg text-yellow-400">₹{p.amount}</span>
                    <div className="flex gap-2">
                      <button className="btn-gold px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="btn-danger px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "announcements" && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-bold text-white mb-4">Send Announcement</h3>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Title</label>
                  <input type="text" placeholder="Announcement title" className="gaming-input w-full px-4 py-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Message</label>
                  <textarea rows={4} placeholder="Announcement message..." className="gaming-input w-full px-4 py-3 rounded-xl text-sm resize-none" />
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Type</label>
                  <div className="flex gap-2">
                    {["Info", "Warning", "Success"].map((t) => (
                      <button key={t} className={cn("px-4 py-2 rounded-xl text-xs font-heading font-bold border transition-all",
                        t === "Info" ? "bg-cyan-600/20 border-cyan-500/40 text-cyan-400" :
                        t === "Warning" ? "border-yellow-500/20 text-slate-400 hover:border-yellow-500/40" :
                        "border-green-500/20 text-slate-400 hover:border-green-500/40"
                      )}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn-primary relative px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Send to All Players</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
