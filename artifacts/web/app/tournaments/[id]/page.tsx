"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_TOURNAMENTS } from "@/lib/mock-data";
import { formatCurrency, formatTimeLeft, getGameIcon } from "@/lib/utils";
import { ArrowLeft, Trophy, Users, Clock, Shield, Map, Swords, Eye, EyeOff, CheckCircle2, AlertCircle, Wallet, Upload, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournament = MOCK_TOURNAMENTS.find(t => t.id === params.id);
  const [timeLeft, setTimeLeft] = useState(tournament ? formatTimeLeft(tournament.match_time) : "");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "rules" | "participants">("info");

  const MOCK_ROOM = { id: "ELITE2025", password: "battle99" };

  useEffect(() => {
    if (!tournament) return;
    const interval = setInterval(() => setTimeLeft(formatTimeLeft(tournament.match_time)), 1000);
    return () => clearInterval(interval);
  }, [tournament]);

  if (!tournament) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h1 className="font-display font-bold text-2xl text-white mb-4">TOURNAMENT NOT FOUND</h1>
        <Link href="/tournaments" className="btn-secondary px-6 py-3 rounded-xl font-heading font-bold">← Back to Tournaments</Link>
      </div>
    );
  }

  const slotsLeft = tournament.max_slots - tournament.filled_slots;
  const slotsPercent = Math.round((tournament.filled_slots / tournament.max_slots) * 100);
  const isLive = tournament.status === "live";
  const isCompleted = tournament.status === "completed";
  const isFull = slotsLeft === 0;

  async function handleRegister() {
    setRegistering(true);
    await new Promise(r => setTimeout(r, 1200));
    setRegistered(true);
    setRegistering(false);
  }

  function copyRoomId() {
    navigator.clipboard.writeText(MOCK_ROOM.id);
    setCopiedRoomId(true);
    setTimeout(() => setCopiedRoomId(false), 2000);
  }

  const prizeDist = [
    { pos: "1st Place", prize: Math.round(tournament.prize_pool * 0.5), color: "text-yellow-400", icon: "🥇" },
    { pos: "2nd Place", prize: Math.round(tournament.prize_pool * 0.3), color: "text-slate-300", icon: "🥈" },
    { pos: "3rd Place", prize: Math.round(tournament.prize_pool * 0.2), color: "text-amber-600", icon: "🥉" },
  ];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-heading text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tournaments
        </button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden mb-6"
        >
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-cyan-900/30 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl opacity-20 select-none">{getGameIcon(tournament.game)}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Status + badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {isLive ? (
                <div className="flex items-center gap-1.5 live-badge border rounded-full px-3 py-1.5 text-sm font-heading font-bold">
                  <div className="live-dot" /> LIVE NOW
                </div>
              ) : isCompleted ? (
                <div className="status-completed border rounded-full px-3 py-1.5 text-sm font-heading font-bold">ENDED</div>
              ) : (
                <div className="status-upcoming border rounded-full px-3 py-1.5 text-sm font-heading font-bold">UPCOMING</div>
              )}
              <div className="bg-black/40 border border-white/10 rounded-full px-3 py-1.5 text-sm font-heading text-slate-300">{tournament.game_mode}</div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-slate-300 text-sm font-heading mb-1">{tournament.game}</p>
                <h1 className="font-display font-black text-2xl md:text-3xl text-white leading-tight">{tournament.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-heading">PRIZE POOL</p>
                <p className="font-display font-black text-2xl gradient-text-gold">{formatCurrency(tournament.prize_pool)}</p>
              </div>
            </div>
          </div>

          {/* Key stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-purple/15">
            {[
              { icon: <Wallet className="w-4 h-4 text-yellow-400" />, label: "Entry Fee", value: `₹${tournament.entry_fee}`, color: "text-yellow-400" },
              { icon: <Users className="w-4 h-4 text-cyan-400" />, label: "Slots Left", value: isFull ? "FULL" : `${slotsLeft}/${tournament.max_slots}`, color: isFull ? "text-red-400" : "text-cyan-400" },
              { icon: <Map className="w-4 h-4 text-purple-400" />, label: "Map", value: tournament.map_name ?? "TBA", color: "text-purple-400" },
              { icon: <Clock className="w-4 h-4 text-slate-400" />, label: isLive ? "Status" : "Starts In", value: isLive ? "LIVE" : isCompleted ? "ENDED" : timeLeft, color: isLive ? "text-red-400" : "text-slate-300" },
            ].map((s, i) => (
              <div key={i} className="p-4 text-center">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="text-xs text-slate-500 font-heading mb-0.5">{s.label}</p>
                <p className={cn("font-display font-bold text-sm", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: details tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex border-b border-purple/15">
                {[
                  { key: "info", label: "Match Info" },
                  { key: "rules", label: "Rules" },
                  { key: "participants", label: "Participants" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={cn(
                      "flex-1 py-3.5 font-heading font-bold text-sm tracking-wide transition-all border-b-2",
                      activeTab === tab.key
                        ? "border-purple-500 text-purple-400 bg-purple/5"
                        : "border-transparent text-slate-400 hover:text-white"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "info" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-heading font-bold text-white mb-3 text-sm uppercase tracking-wider">Prize Distribution</h4>
                      <div className="space-y-2">
                        {prizeDist.map((p) => (
                          <div key={p.pos} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{p.icon}</span>
                              <span className="font-heading font-semibold text-slate-300 text-sm">{p.pos}</span>
                            </div>
                            <span className={cn("font-display font-black text-base", p.color)}>{formatCurrency(p.prize)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-white mb-2 text-sm uppercase tracking-wider">Schedule</h4>
                      <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-slate-300 text-sm font-heading">
                          {format(parseISO(tournament.match_time), "EEEE, MMMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "rules" && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-slate-300 leading-relaxed text-sm mb-4">{tournament.rules}</p>
                    <ul className="space-y-2">
                      {[
                        "Room ID and password will be shared 15 minutes before match time",
                        "Players must join the room within 5 minutes or lose their slot",
                        "Any form of cheating results in immediate disqualification",
                        "Results are final once declared by admin",
                        "Winnings credited to wallet within 24 hours",
                        "Support ID required for any dispute — screenshot your match result",
                      ].map((rule, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === "participants" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-heading text-slate-400 text-sm">{tournament.filled_slots} / {tournament.max_slots} registered</p>
                      <div className="w-32 progress-bar">
                        <div className="progress-fill" style={{ width: `${slotsPercent}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array.from({ length: Math.min(tournament.filled_slots, 18) }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center text-xs font-display text-white flex-shrink-0">
                            {String.fromCharCode(65 + (i % 26))}
                          </div>
                          <span className="text-xs text-slate-300 font-heading truncate">Player{i + 1}</span>
                        </div>
                      ))}
                      {slotsLeft > 0 && Array.from({ length: Math.min(slotsLeft, 6) }).map((_, i) => (
                        <div key={`empty-${i}`} className="flex items-center gap-2 p-2 bg-black/10 rounded-lg border border-dashed border-white/5">
                          <div className="w-6 h-6 rounded border border-dashed border-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-600 text-xs">+</span>
                          </div>
                          <span className="text-xs text-slate-600 font-heading">Open slot</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: action panel */}
          <div className="space-y-4">
            {/* Room ID panel (post-registration or live) */}
            {(registered || isLive) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-5 border border-yellow-500/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-heading font-bold text-yellow-400">ROOM DETAILS</h3>
                </div>
                {showRoom ? (
                  <div className="space-y-3">
                    <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
                      <p className="text-xs text-slate-400 font-heading mb-1">Room ID</p>
                      <div className="flex items-center justify-between">
                        <p className="font-display font-bold text-lg text-yellow-400">{MOCK_ROOM.id}</p>
                        <button onClick={copyRoomId} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                          {copiedRoomId ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedRoomId ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
                      <p className="text-xs text-slate-400 font-heading mb-1">Password</p>
                      <p className="font-display font-bold text-lg text-yellow-400">{MOCK_ROOM.password}</p>
                    </div>
                    <p className="text-xs text-slate-500 font-heading flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      Join the room within 5 minutes of match start time
                    </p>
                  </div>
                ) : (
                  <button onClick={() => setShowRoom(true)} className="btn-gold w-full py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> Reveal Room Details
                  </button>
                )}
              </motion.div>
            )}

            {/* Registration card */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-bold text-white mb-4">Join Tournament</h3>

              {registered ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="font-heading font-bold text-green-400 mb-1">You're Registered!</p>
                  <p className="text-xs text-slate-400 font-heading">Room ID will be revealed before match</p>
                </div>
              ) : isCompleted ? (
                <div className="text-center py-4">
                  <p className="font-heading text-slate-400 mb-2">This tournament has ended.</p>
                  <Link href="/tournaments" className="btn-secondary px-4 py-2 rounded-lg text-sm font-heading font-bold">Browse Active</Link>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-5">
                    {[
                      { label: "Entry Fee", value: `₹${tournament.entry_fee}`, highlight: true },
                      { label: "Your Balance", value: "₹1,250", highlight: false },
                      { label: "Slots Available", value: isFull ? "FULL" : `${slotsLeft} remaining`, highlight: false },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm py-1 border-b border-white/5">
                        <span className="text-slate-400 font-heading">{row.label}</span>
                        <span className={cn("font-heading font-bold", row.highlight ? "text-yellow-400" : "text-white")}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {isFull ? (
                    <div className="text-center py-2">
                      <p className="text-red-400 font-heading font-semibold text-sm mb-3">Tournament is FULL</p>
                      <Link href="/tournaments" className="btn-secondary w-full py-3 rounded-xl font-heading font-bold text-sm text-center block">Browse Other Tournaments</Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="btn-primary w-full py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm relative flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {registering ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          PROCESSING...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          <Swords className="w-4 h-4" /> JOIN FOR ₹{tournament.entry_fee}
                        </span>
                      )}
                    </button>
                  )}

                  <p className="text-xs text-slate-500 font-heading text-center mt-3 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> Secure transaction · Instant slot booking
                  </p>
                </>
              )}
            </div>

            {/* Quick info */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h4 className="font-heading font-bold text-slate-300 text-xs uppercase tracking-wider">Quick Info</h4>
              {[
                { icon: <Swords className="w-4 h-4 text-purple-400" />, label: "Mode", value: tournament.game_mode },
                { icon: <Map className="w-4 h-4 text-cyan-400" />, label: "Map", value: tournament.map_name ?? "TBA" },
                { icon: <Trophy className="w-4 h-4 text-yellow-400" />, label: "Top Prize", value: formatCurrency(Math.round(tournament.prize_pool * 0.5)) },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-slate-400 text-sm font-heading flex-1">{item.label}</span>
                  <span className="text-white font-heading font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
