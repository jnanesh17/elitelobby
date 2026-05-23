"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_TOURNAMENTS, MOCK_REGISTRATIONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Shield, Users, Trophy, DollarSign, BarChart3, Bell, Ban, CheckCircle2, XCircle, Clock, Plus, Edit, Trash2, Eye, TrendingUp, ImageIcon, X, ChevronDown, ChevronUp, Gift, ClipboardList, Search, Download, ChevronRight, Key, Lock, Unlock, Send, RotateCcw } from "lucide-react";
import { useRoomIds } from "@/lib/room-id-context";
import { useNotifications } from "@/lib/notifications-context";
import { cn } from "@/lib/utils";

type AdminTab = "overview" | "tournaments" | "registrations" | "users" | "payments" | "announcements";

const MOCK_PENDING_PAYMENTS = [
  {
    id: "p1", user: "CyberWarrior99", amount: 500, utr: "012345678901",
    time: "2 min ago", upi: "cyberwarrior@paytm", bonus: 25,
    screenshot: "https://placehold.co/400x600/0a0a14/7c3aed?text=Payment+Screenshot",
  },
  {
    id: "p2", user: "NeonSniper88", amount: 1000, utr: "098765432100",
    time: "15 min ago", upi: "neonsniper@okaxis", bonus: 100,
    screenshot: "https://placehold.co/400x600/0a0a14/06b6d4?text=Payment+Screenshot",
  },
  {
    id: "p3", user: "GhostRider_X", amount: 200, utr: "055566677700",
    time: "32 min ago", upi: "ghostrider@upi", bonus: 0,
    screenshot: null,
  },
  {
    id: "p4", user: "StormRaider_K", amount: 2000, utr: "020304050607",
    time: "1 hr ago", upi: "stormraider@ybl", bonus: 300,
    screenshot: "https://placehold.co/400x600/0a0a14/f59e0b?text=Payment+Screenshot",
  },
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

function RegistrationsTab({ onViewTournament }: { onViewTournament?: (id: string) => void }) {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const tournament = selectedTournament
    ? MOCK_TOURNAMENTS.find((t) => t.id === selectedTournament)
    : null;

  const regs = MOCK_REGISTRATIONS.filter((r) => {
    if (selectedTournament && r.tournament_id !== selectedTournament) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.username.toLowerCase().includes(q) ||
        r.game_uid.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Per-tournament summary
  const tournamentSummary = MOCK_TOURNAMENTS.map((t) => {
    const tRegs = MOCK_REGISTRATIONS.filter((r) => r.tournament_id === t.id);
    const revenue = tRegs.filter((r) => r.payment_status === "confirmed").length * t.entry_fee;
    return { ...t, regCount: tRegs.length, confirmed: tRegs.filter(r => r.payment_status === "confirmed").length, pending: tRegs.filter(r => r.payment_status === "pending").length, revenue };
  });

  return (
    <div className="space-y-5">
      {/* Tournament summary cards */}
      <div>
        <h3 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-purple-400" /> Tournament Registrations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tournamentSummary.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTournament(selectedTournament === t.id ? null : t.id)}
              className={cn(
                "glass-card rounded-2xl p-4 text-left border-2 transition-all hover:border-purple/40",
                selectedTournament === t.id ? "border-purple/60 bg-purple/5" : "border-transparent"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-heading font-bold text-white text-sm leading-tight">{t.title}</p>
                  <p className="text-xs text-slate-500 font-heading">{t.game} · {t.game_mode}</p>
                </div>
                <span className={cn("text-xs font-heading font-bold border rounded-full px-2 py-0.5", `status-${t.status}`)}>
                  {t.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-black/30 rounded-xl p-2.5 text-center">
                  <p className="font-display font-black text-xl text-white">{t.regCount}</p>
                  <p className="text-xs text-slate-500 font-heading">Total</p>
                </div>
                <div className="bg-black/30 rounded-xl p-2.5 text-center">
                  <p className="font-display font-black text-xl text-green-400">{t.confirmed}</p>
                  <p className="text-xs text-slate-500 font-heading">Paid</p>
                </div>
                <div className="bg-black/30 rounded-xl p-2.5 text-center">
                  <p className="font-display font-black text-xl text-yellow-400">₹{(t.revenue / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-slate-500 font-heading">Revenue</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="progress-bar flex-1 mr-3 h-1.5 rounded-full">
                  <div className="progress-fill h-full rounded-full" style={{ width: `${Math.round((t.filled_slots / t.max_slots) * 100)}%` }} />
                </div>
                <span className="text-xs text-slate-400 font-heading">{t.filled_slots}/{t.max_slots}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player list */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple/10">
          <p className="font-heading font-bold text-white text-sm">
            {tournament ? `${tournament.title} — ` : "All "}
            <span className="text-purple-400">{regs.length} registrants</span>
          </p>
          <div className="flex items-center gap-2">
            {selectedTournament && (
              <button
                onClick={() => setSelectedTournament(null)}
                className="text-xs text-slate-400 hover:text-white font-heading transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search player..."
                className="gaming-input pl-8 pr-3 py-1.5 rounded-lg text-xs w-40"
              />
            </div>
          </div>
        </div>

        {regs.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-slate-500 font-heading text-sm">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full gaming-table">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Player</th>
                  <th className="text-left hidden sm:table-cell">Game UID</th>
                  <th className="text-left hidden md:table-cell">Email</th>
                  {!selectedTournament && <th className="text-left hidden lg:table-cell">Tournament</th>}
                  <th className="text-right">Entry Fee</th>
                  <th className="text-center">Payment</th>
                  <th className="text-right hidden md:table-cell">Registered</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((r, i) => {
                  const t = MOCK_TOURNAMENTS.find((t) => t.id === r.tournament_id);
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td className="text-slate-500 font-heading text-xs">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0">
                            {r.username[0]}
                          </div>
                          <span className="font-heading font-semibold text-white text-sm">{r.username}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell font-mono text-xs text-cyan-400">{r.game_uid}</td>
                      <td className="hidden md:table-cell text-slate-400 text-xs font-heading">{r.email}</td>
                      {!selectedTournament && (
                        <td className="hidden lg:table-cell">
                          <button
                            onClick={() => setSelectedTournament(r.tournament_id)}
                            className="text-xs text-purple-400 hover:text-purple-300 font-heading font-semibold transition-colors flex items-center gap-1"
                          >
                            {t?.title} <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      )}
                      <td className="text-right font-display font-bold text-yellow-400 text-sm">₹{r.fee_paid}</td>
                      <td className="text-center">
                        <span className={cn(
                          "text-xs font-heading font-bold border rounded-full px-2 py-0.5",
                          r.payment_status === "confirmed"
                            ? "text-green-400 border-green-500/30 bg-green-500/10"
                            : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                        )}>
                          {r.payment_status === "confirmed" ? "✓ Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="hidden md:table-cell text-right text-xs text-slate-500 font-heading">
                        {new Date(r.registered_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with totals */}
        {regs.length > 0 && (
          <div className="px-5 py-3 border-t border-purple/10 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-heading">
              {regs.filter(r => r.payment_status === "confirmed").length} confirmed · {regs.filter(r => r.payment_status === "pending").length} pending
            </p>
            <p className="text-xs text-slate-400 font-heading">
              Total collected: <span className="text-yellow-400 font-bold font-display">
                ₹{regs.filter(r => r.payment_status === "confirmed").reduce((s, r) => s + r.fee_paid, 0).toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState(
    MOCK_PENDING_PAYMENTS.map((p) => ({ ...p, status: "pending" as "pending" | "approved" | "rejected", expanded: false }))
  );
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  function approve(id: string) {
    setPayments((ps) => ps.map((p) => p.id === id ? { ...p, status: "approved" } : p));
  }
  function reject(id: string) {
    setPayments((ps) => ps.map((p) => p.id === id ? { ...p, status: "rejected" } : p));
  }
  function toggle(id: string) {
    setPayments((ps) => ps.map((p) => p.id === id ? { ...p, expanded: !p.expanded } : p));
  }

  const filtered = payments.filter((p) => filter === "all" || p.status === filter);
  const counts = { all: payments.length, pending: payments.filter(p => p.status === "pending").length, approved: payments.filter(p => p.status === "approved").length, rejected: payments.filter(p => p.status === "rejected").length };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "glass-card rounded-xl p-4 text-left border-2 transition-all",
              filter === f
                ? f === "pending" ? "border-yellow-500/50" : f === "approved" ? "border-green-500/50" : f === "rejected" ? "border-red-500/50" : "border-purple/50"
                : "border-transparent hover:border-white/10"
            )}
          >
            <p className="text-xs font-heading text-slate-400 mb-1 capitalize">{f}</p>
            <p className={cn("font-display font-black text-2xl",
              f === "pending" ? "text-yellow-400" : f === "approved" ? "text-green-400" : f === "rejected" ? "text-red-400" : "text-white"
            )}>{counts[f]}</p>
          </button>
        ))}
      </div>

      {/* Payment cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-slate-500 font-heading">No {filter} payments</p>
          </div>
        )}
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            layout
            className={cn(
              "glass-card rounded-2xl overflow-hidden border",
              p.status === "approved" ? "border-green-500/20" : p.status === "rejected" ? "border-red-500/15" : "border-yellow-500/20"
            )}
          >
            {/* Main row */}
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0">
                {p.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading font-bold text-white text-sm">{p.user}</p>
                  <span className={cn(
                    "text-xs font-heading font-bold border rounded-full px-2 py-0.5",
                    p.status === "approved" ? "border-green-500/30 text-green-400 bg-green-500/10"
                      : p.status === "rejected" ? "border-red-500/30 text-red-400 bg-red-500/10"
                      : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                  )}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-heading">
                  UTR: <span className="font-mono text-cyan-400">{p.utr}</span> · {p.upi} · {p.time}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display font-black text-xl text-yellow-400">₹{p.amount}</p>
                {p.bonus > 0 && (
                  <p className="text-xs text-green-400 font-heading flex items-center gap-1 justify-end">
                    <Gift className="w-3 h-3" />+₹{p.bonus} bonus
                  </p>
                )}
              </div>
              {/* Expand toggle */}
              <button
                onClick={() => toggle(p.id)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/25 transition-all flex-shrink-0"
              >
                {p.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Expanded detail */}
            {p.expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/5 p-4"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Screenshot preview */}
                  <div className="md:w-56 flex-shrink-0">
                    <p className="text-xs text-slate-400 font-heading mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Payment Screenshot
                    </p>
                    {p.screenshot ? (
                      <button
                        onClick={() => setLightbox(p.screenshot!)}
                        className="block w-full rounded-xl overflow-hidden border-2 border-purple/20 hover:border-purple/50 transition-all group"
                      >
                        <img
                          src={p.screenshot}
                          alt="Payment proof"
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="bg-purple/20 py-1.5 text-center">
                          <span className="text-xs text-purple-300 font-heading">Click to enlarge</span>
                        </div>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-white/10 text-slate-600">
                        <ImageIcon className="w-8 h-8" />
                        <p className="text-xs font-heading">No screenshot</p>
                      </div>
                    )}
                  </div>

                  {/* Details & actions */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Amount", value: `₹${p.amount}`, color: "text-yellow-400" },
                        { label: "Bonus Credit", value: p.bonus > 0 ? `+₹${p.bonus}` : "None", color: p.bonus > 0 ? "text-green-400" : "text-slate-500" },
                        { label: "Total Credit", value: `₹${p.amount + p.bonus}`, color: "text-white" },
                        { label: "UPI ID", value: p.upi, color: "text-cyan-400 font-mono text-xs" },
                        { label: "UTR Number", value: p.utr, color: "text-purple-300 font-mono text-xs" },
                        { label: "Submitted", value: p.time, color: "text-slate-400" },
                      ].map((row) => (
                        <div key={row.label} className="bg-black/20 rounded-xl p-3 border border-white/5">
                          <p className="text-xs text-slate-500 font-heading mb-1">{row.label}</p>
                          <p className={cn("font-heading font-bold text-sm", row.color)}>{row.value}</p>
                        </div>
                      ))}
                    </div>

                    {p.status === "pending" && (
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => approve(p.id)}
                          className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-heading font-bold flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve & Credit ₹{p.amount + p.bonus}
                        </button>
                        <button
                          onClick={() => reject(p.id)}
                          className="btn-danger flex-1 py-2.5 rounded-xl text-sm font-heading font-bold flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                    {p.status === "approved" && (
                      <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <p className="text-sm text-green-400 font-heading font-semibold">Approved — ₹{p.amount + p.bonus} credited to player wallet</p>
                      </div>
                    )}
                    {p.status === "rejected" && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-400 font-heading font-semibold">Rejected — player notified</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox}
            alt="Payment screenshot"
            className="max-w-md w-full max-h-[85vh] object-contain rounded-2xl border border-purple/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const totalRegs = MOCK_REGISTRATIONS.length;
  const TABS: { key: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "tournaments", label: "Tournaments", icon: <Trophy className="w-4 h-4" /> },
    { key: "registrations", label: "Registrations", icon: <ClipboardList className="w-4 h-4" />, badge: totalRegs },
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
              {tab.badge != null && (
                <span className="bg-white/15 text-white text-[10px] font-heading font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {tab.badge}
                </span>
              )}
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
          {activeTab === "registrations" && <RegistrationsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "payments" && <PaymentsTab />}
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
