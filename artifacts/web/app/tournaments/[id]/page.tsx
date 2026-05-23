"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_TOURNAMENTS, MOCK_REGISTRATIONS } from "@/lib/mock-data";
import { formatCurrency, formatTimeLeft, getGameIcon } from "@/lib/utils";
import { useRoomIds } from "@/lib/room-id-context";
import { ArrowLeft, Trophy, Users, Clock, Shield, Map, Swords, Eye, EyeOff, CheckCircle2, AlertCircle, Wallet, Copy, Key, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getRoomId } = useRoomIds();

  const tournament = MOCK_TOURNAMENTS.find(t => t.id === params.id);
  const [timeLeft, setTimeLeft] = useState(tournament ? formatTimeLeft(tournament.match_time) : "");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [copiedField, setCopiedField] = useState<"id" | "pass" | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "rules" | "participants">("info");

  const roomEntry = tournament ? getRoomId(tournament.id) : null;
  const roomReleased = roomEntry?.released ?? false;

  // Real participants for this tournament
  const participants = MOCK_REGISTRATIONS.filter(r => r.tournament_id === params.id);

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

  async function copyField(text: string, field: "id" | "pass") {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  const prizeDist = [
    { pos: "1st Place", prize: Math.round(tournament.prize_pool * 0.5), color: "text-yellow-400", icon: "🥇" },
    { pos: "2nd Place", prize: Math.round(tournament.prize_pool * 0.3), color: "text-slate-300", icon: "🥈" },
    { pos: "3rd Place", prize: Math.round(tournament.prize_pool * 0.2), color: "text-amber-600", icon: "🥉" },
  ];

  const canSeeRoom = registered || isLive || isCompleted;

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-heading text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tournaments
        </button>

        {/* Hero banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden mb-6">
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-cyan-900/30 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl opacity-20 select-none">{getGameIcon(tournament.game)}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

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

          {/* Stats row */}
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
          {/* Left: tabs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex border-b border-purple/15">
                {[
                  { key: "info", label: "Match Info" },
                  { key: "rules", label: "Rules" },
                  { key: "participants", label: `Participants (${participants.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as "info" | "rules" | "participants")}
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
                    {participants.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {participants.map((p) => (
                          <div key={p.id} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center text-xs font-display text-white flex-shrink-0">
                              {p.username[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white font-heading font-semibold truncate">{p.username}</p>
                              <p className="text-xs text-slate-500 font-mono truncate">{p.game_uid}</p>
                            </div>
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
                    ) : (
                      <p className="text-slate-500 font-heading text-sm text-center py-6">No registrations yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: action panel */}
          <div className="space-y-4">
            {/* ── ROOM ID PANEL ── */}
            {canSeeRoom && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "glass-card rounded-2xl p-5 border",
                  roomReleased ? "border-yellow-500/40" : "border-purple/25"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  {roomReleased ? (
                    <Key className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                  <h3 className={cn("font-heading font-bold", roomReleased ? "text-yellow-400" : "text-slate-300")}>
                    ROOM DETAILS
                  </h3>
                  {roomReleased && (
                    <span className="ml-auto text-xs text-green-400 font-heading font-bold flex items-center gap-1 bg-green-500/10 border border-green-500/25 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!roomReleased ? (
                    /* Waiting state */
                    <motion.div
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-dashed border-purple/40 flex items-center justify-center"
                      >
                        <Lock className="w-5 h-5 text-slate-500" />
                      </motion.div>
                      <p className="font-heading font-semibold text-slate-300 text-sm mb-1">
                        {roomEntry ? "Room ID Prepared" : "Room ID Pending"}
                      </p>
                      <p className="text-xs text-slate-500 font-heading leading-relaxed">
                        {roomEntry
                          ? "Admin has set the room ID. It will be released 15 minutes before match time."
                          : "Admin will release the room ID 15 minutes before the match starts."}
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-purple-400 font-heading">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Awaiting release...
                      </div>
                    </motion.div>
                  ) : !showRoom ? (
                    /* Reveal button */
                    <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <p className="text-xs text-slate-400 font-heading text-center mb-3">
                        Room ID is now available! Tap to reveal.
                      </p>
                      <button
                        onClick={() => setShowRoom(true)}
                        className="btn-gold w-full py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Reveal Room Details
                      </button>
                    </motion.div>
                  ) : (
                    /* Room details revealed */
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* Room ID */}
                      <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
                        <p className="text-xs text-slate-400 font-heading mb-1.5">Room ID</p>
                        <div className="flex items-center justify-between">
                          <p className="font-display font-bold text-xl text-yellow-400 tracking-wider">
                            {roomEntry!.room_id}
                          </p>
                          <button
                            onClick={() => copyField(roomEntry!.room_id, "id")}
                            className={cn(
                              "flex items-center gap-1 text-xs font-heading font-bold transition-all px-2 py-1 rounded-lg border",
                              copiedField === "id"
                                ? "text-green-400 border-green-500/30 bg-green-500/10"
                                : "text-slate-400 border-white/10 hover:border-purple/30 hover:text-purple-400"
                            )}
                          >
                            {copiedField === "id" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedField === "id" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="bg-black/40 rounded-xl p-3 border border-yellow-500/20">
                        <p className="text-xs text-slate-400 font-heading mb-1.5">Password</p>
                        <div className="flex items-center justify-between">
                          <p className="font-display font-bold text-xl text-yellow-400 tracking-wider">
                            {roomEntry!.password}
                          </p>
                          <button
                            onClick={() => copyField(roomEntry!.password, "pass")}
                            className={cn(
                              "flex items-center gap-1 text-xs font-heading font-bold transition-all px-2 py-1 rounded-lg border",
                              copiedField === "pass"
                                ? "text-green-400 border-green-500/30 bg-green-500/10"
                                : "text-slate-400 border-white/10 hover:border-purple/30 hover:text-purple-400"
                            )}
                          >
                            {copiedField === "pass" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedField === "pass" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 bg-yellow-500/5 border border-yellow-500/15 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-400 font-heading leading-relaxed">
                          Join within 5 minutes of match start. Screenshot this for your records.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowRoom(false)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-heading transition-colors mx-auto"
                      >
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Registration card */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-heading font-bold text-white mb-4">Join Tournament</h3>

              {registered ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="font-heading font-bold text-green-400 mb-1">You're Registered!</p>
                  <p className="text-xs text-slate-400 font-heading">
                    {roomReleased ? "Room ID is available — check above!" : "Room ID will be released before match starts."}
                  </p>
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
