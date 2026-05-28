"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_TOURNAMENTS, MOCK_REGISTRATIONS, MOCK_LEADERBOARD } from "@/lib/mock-data";
import { formatCurrency, formatTimeLeft, getGameIcon } from "@/lib/utils";
import { useRoomIds } from "@/lib/room-id-context";
import { ArrowLeft, Trophy, Users, Clock, Shield, Map, Swords, Eye, EyeOff, CheckCircle2, AlertCircle, Wallet, Copy, Key, Lock, Loader2, Zap, TrendingUp, ChevronDown, UserPlus, Crown, X, Search, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getRoomId } = useRoomIds();
  const { balance, deductFee, canAfford } = useWallet();

  const tournament = MOCK_TOURNAMENTS.find(t => t.id === params.id);
  const [timeLeft, setTimeLeft] = useState(tournament ? formatTimeLeft(tournament.match_time) : "");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [copiedField, setCopiedField] = useState<"id" | "pass" | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "rules" | "participants">("info");
  const [stake, setStake] = useState(200);

  const isClashSquad = tournament?.id === "t4";
  const effectiveEntryFee = isClashSquad ? stake : (tournament?.entry_fee ?? 0);
  const totalPot = isClashSquad ? stake * 8 : (tournament?.prize_pool ?? 0);
  const winnerTeamPrize = isClashSquad ? Math.round(totalPot * 0.7) : (tournament?.prize_pool ?? 0);
  const perPlayerPrize = isClashSquad ? Math.round(winnerTeamPrize / 4) : (tournament?.prize_pool ?? 0);
  const platformCut = isClashSquad ? Math.round(totalPot * 0.3) : 0;
  const profit = isClashSquad ? perPlayerPrize - stake : 0;

  const STAKE_PRESETS = [100, 250, 500, 750, 1000];

  // ── Squad state ──
  type SquadMember = { username: string; status: "leader" | "invited" | "confirmed" };
  const [playMode, setPlayMode] = useState<"solo" | "squad">("solo");
  const [squadName, setSquadName] = useState("");
  const [squadCode] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([
    { username: "DemoPlayer", status: "leader" },
  ]);
  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const squadFull = squadMembers.length === 4;
  const squadReady = squadFull && squadMembers.every(m => m.status === "leader" || m.status === "confirmed");

  const candidatePlayers = MOCK_LEADERBOARD.filter(
    p => !squadMembers.find(m => m.username === p.username) &&
      p.username.toLowerCase().includes(memberSearch.toLowerCase())
  ).slice(0, 5);

  function addSquadMember(username: string) {
    if (squadMembers.length >= 4) return;
    setSquadMembers(prev => [...prev, { username, status: "invited" }]);
    setMemberSearch("");
    setShowMemberSearch(false);
  }

  function removeSquadMember(username: string) {
    setSquadMembers(prev => prev.filter(m => m.username !== username));
  }

  function acceptInvite(username: string) {
    setSquadMembers(prev => prev.map(m => m.username === username ? { ...m, status: "confirmed" } : m));
  }

  async function copySquadCode() {
    await navigator.clipboard.writeText(`https://elitelobby.in/join/${squadCode}`);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

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
    if (!canAfford(effectiveEntryFee)) return;
    setRegistering(true);
    await new Promise(r => setTimeout(r, 1200));
    const label = isClashSquad
      ? `Clash Squad stake: ${tournament?.title}`
      : `Tournament entry: ${tournament?.title}`;
    const success = deductFee(effectiveEntryFee, label);
    if (success) {
      setRegistered(true);
    }
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
                <p className="text-xs text-slate-400 font-heading">{isClashSquad ? "WINNING TEAM PRIZE" : "PRIZE POOL"}</p>
                <p className="font-display font-black text-2xl gradient-text-gold">{isClashSquad ? formatCurrency(winnerTeamPrize) : formatCurrency(tournament.prize_pool)}</p>
                {isClashSquad && <p className="text-xs text-cyan-400 font-heading">₹{perPlayerPrize} per player</p>}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-purple/15">
            {[
              { icon: <Wallet className="w-4 h-4 text-yellow-400" />, label: isClashSquad ? "Your Stake" : "Entry Fee", value: `₹${effectiveEntryFee}`, color: "text-yellow-400" },
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
              <h3 className="font-heading font-bold text-white mb-4">
                {isClashSquad ? "Choose Your Stake" : "Join Tournament"}
              </h3>

              {registered ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="font-heading font-bold text-green-400 mb-1">You're Registered!</p>
                  <p className="text-xs text-slate-400 font-heading mb-4">
                    {roomReleased ? "Room ID is available — check above!" : "Room ID will be released before match starts."}
                  </p>
                  <Link
                    href={`/tournaments/${tournament.id}/lobby`}
                    className="btn-primary w-full py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Swords className="w-4 h-4" /> Enter Match Lobby
                  </Link>
                </div>
              ) : isCompleted ? (
                <div className="text-center py-4">
                  <p className="font-heading text-slate-400 mb-2">This tournament has ended.</p>
                  <Link href="/tournaments" className="btn-secondary px-4 py-2 rounded-lg text-sm font-heading font-bold">Browse Active</Link>
                </div>
              ) : (
                <>
                  {/* ── CLASH SQUAD STAKE SELECTOR ── */}
                  {isClashSquad && (
                    <div className="mb-5">
                      {/* Preset chips */}
                      <p className="text-xs text-slate-500 font-heading uppercase tracking-widest mb-2">Quick Select</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {STAKE_PRESETS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setStake(p)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition-all",
                              stake === p
                                ? "bg-orange-500/30 border-orange-500/60 text-orange-300"
                                : "border-white/10 text-slate-400 hover:border-orange-500/30 hover:text-orange-300"
                            )}
                          >
                            ₹{p}
                          </button>
                        ))}
                      </div>

                      {/* Slider */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-500 font-heading">₹100</span>
                          <span className="font-display font-black text-lg text-orange-400">₹{stake}</span>
                          <span className="text-xs text-slate-500 font-heading">₹1,000</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={1000}
                          step={50}
                          value={stake}
                          onChange={(e) => setStake(Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #f97316 0%, #f97316 ${((stake - 100) / 900) * 100}%, rgba(255,255,255,0.1) ${((stake - 100) / 900) * 100}%, rgba(255,255,255,0.1) 100%)`,
                          }}
                        />
                      </div>

                      {/* Payout breakdown */}
                      <div className="bg-black/30 rounded-xl p-3 border border-orange-500/20 space-y-2">
                        <p className="text-xs font-heading font-bold text-orange-400 mb-2 uppercase tracking-widest">Payout Breakdown</p>
                        {[
                          { label: "Your Stake", value: `₹${stake}`, color: "text-white" },
                          { label: "Total Pot (8 players)", value: `₹${totalPot}`, color: "text-slate-300" },
                          { label: "Platform Fee (30%)", value: `-₹${platformCut}`, color: "text-red-400" },
                          { label: "Winning Team Prize", value: `₹${winnerTeamPrize}`, color: "text-green-400" },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between text-xs py-0.5 border-b border-white/5 last:border-0">
                            <span className="text-slate-500 font-heading">{row.label}</span>
                            <span className={cn("font-display font-bold", row.color)}>{row.value}</span>
                          </div>
                        ))}
                        <div className="pt-1.5 flex items-center justify-between">
                          <span className="text-xs font-heading font-bold text-slate-300">Your prize if you win</span>
                          <div className="text-right">
                            <span className="font-display font-black text-base text-amber-400">₹{perPlayerPrize}</span>
                            <span className="ml-1.5 text-xs font-heading text-green-400">+₹{profit} profit</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 font-heading">
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        Win 70% of double the pot — your stake × {(perPlayerPrize / stake).toFixed(1)}x return
                      </div>
                    </div>
                  )}

                  {/* Standard fee summary */}
                  {!isClashSquad && (
                    <div className="space-y-2 mb-5">
                      {[
                        { label: "Entry Fee", value: `₹${tournament.entry_fee}`, highlight: true },
                        { label: "Your Balance", value: `₹${balance.toLocaleString()}`, highlight: false, warn: balance < tournament.entry_fee },
                        { label: "Slots Available", value: isFull ? "FULL" : `${slotsLeft} remaining`, highlight: false },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm py-1 border-b border-white/5">
                          <span className="text-slate-400 font-heading">{row.label}</span>
                          <span className={cn("font-heading font-bold", row.highlight ? "text-yellow-400" : (row as {warn?: boolean}).warn ? "text-red-400" : "text-white")}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Balance row for clash squad */}
                  {isClashSquad && (
                    <div className="flex justify-between text-sm py-2 border-b border-white/5 mb-4">
                      <span className="text-slate-400 font-heading">Your Balance</span>
                      <span className={cn("font-heading font-bold", stake > balance ? "text-red-400" : "text-white")}>₹{balance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* ── PLAY MODE SELECTOR (Clash Squad only) ── */}
                  {isClashSquad && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 font-heading uppercase tracking-widest mb-2">Play Mode</p>
                      <div className="flex gap-2">
                        {(["solo", "squad"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setPlayMode(mode)}
                            className={cn(
                              "flex-1 py-2.5 rounded-xl border font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all",
                              playMode === mode
                                ? mode === "squad"
                                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                                  : "bg-purple-600/30 border-purple-500/60 text-purple-300"
                                : "border-white/10 text-slate-400 hover:border-white/20"
                            )}
                          >
                            {mode === "solo" ? <Swords className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                            {mode === "solo" ? "Solo" : "Squad"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── SQUAD BUILDER ── */}
                  {isClashSquad && playMode === "squad" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 space-y-3"
                    >
                      {/* Squad name */}
                      <div>
                        <p className="text-xs text-slate-500 font-heading uppercase tracking-widest mb-1.5">Squad Name</p>
                        <input
                          type="text"
                          value={squadName}
                          onChange={e => setSquadName(e.target.value)}
                          placeholder="Enter squad name..."
                          maxLength={20}
                          className="gaming-input w-full px-3 py-2 rounded-xl text-sm"
                        />
                      </div>

                      {/* Squad invite code */}
                      <div className="flex items-center gap-2 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 font-heading mb-0.5">Invite Code</p>
                          <p className="font-display font-black text-base text-cyan-400 tracking-widest">{squadCode}</p>
                        </div>
                        <button
                          onClick={copySquadCode}
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-heading font-bold px-3 py-1.5 rounded-lg border transition-all flex-shrink-0",
                            codeCopied
                              ? "text-green-400 border-green-500/30 bg-green-500/10"
                              : "text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                          )}
                        >
                          {codeCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                          {codeCopied ? "Copied!" : "Share"}
                        </button>
                      </div>

                      {/* Member slots */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-500 font-heading uppercase tracking-widest">
                            Team Members <span className={cn("font-bold", squadFull ? "text-green-400" : "text-white")}>{squadMembers.length}/4</span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          {squadMembers.map((member) => (
                            <motion.div
                              key={member.username}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-xl border",
                                member.status === "leader" ? "border-yellow-500/30 bg-yellow-500/5" :
                                member.status === "confirmed" ? "border-green-500/30 bg-green-500/5" :
                                "border-white/10 bg-white/3"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0">
                                {member.username[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-white text-xs truncate">{member.username}</p>
                                <div className="flex items-center gap-1">
                                  {member.status === "leader" && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-heading font-bold">
                                      <Crown className="w-2.5 h-2.5" /> Leader
                                    </span>
                                  )}
                                  {member.status === "invited" && (
                                    <span className="text-[10px] text-orange-400 font-heading">Invite sent...</span>
                                  )}
                                  {member.status === "confirmed" && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-green-400 font-heading font-bold">
                                      <CheckCircle2 className="w-2.5 h-2.5" /> Confirmed
                                    </span>
                                  )}
                                </div>
                              </div>
                              {member.status === "invited" && (
                                <button
                                  onClick={() => acceptInvite(member.username)}
                                  className="text-[10px] font-heading font-bold text-green-400 bg-green-500/10 border border-green-500/25 rounded-lg px-2 py-1 hover:bg-green-500/20 transition-colors flex-shrink-0"
                                >
                                  Accept
                                </button>
                              )}
                              {member.status !== "leader" && (
                                <button
                                  onClick={() => removeSquadMember(member.username)}
                                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 ml-auto"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </motion.div>
                          ))}

                          {/* Empty slots */}
                          {Array.from({ length: 4 - squadMembers.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-white/10">
                              <div className="w-8 h-8 rounded-lg border border-dashed border-white/15 flex items-center justify-center flex-shrink-0">
                                <span className="text-slate-600 text-xs">+</span>
                              </div>
                              <span className="text-xs text-slate-600 font-heading">Open slot</span>
                            </div>
                          ))}
                        </div>

                        {/* Add member search */}
                        {!squadFull && (
                          <div className="mt-2 relative">
                            <button
                              onClick={() => setShowMemberSearch(!showMemberSearch)}
                              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-cyan-500/30 text-cyan-400 text-xs font-heading font-bold hover:bg-cyan-500/5 transition-colors"
                            >
                              <UserPlus className="w-3.5 h-3.5" /> Add Teammate
                            </button>

                            {showMemberSearch && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-full mb-1 left-0 right-0 bg-[#0d0d1a] border border-purple/30 rounded-xl overflow-hidden shadow-2xl z-20"
                              >
                                <div className="p-2 border-b border-white/5">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                    <input
                                      autoFocus
                                      type="text"
                                      value={memberSearch}
                                      onChange={e => setMemberSearch(e.target.value)}
                                      placeholder="Search player..."
                                      className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-heading text-white placeholder-slate-500 focus:outline-none focus:border-purple/40"
                                    />
                                  </div>
                                </div>
                                {candidatePlayers.length > 0 ? (
                                  <div className="max-h-40 overflow-y-auto">
                                    {candidatePlayers.map(p => (
                                      <button
                                        key={p.username}
                                        onClick={() => addSquadMember(p.username)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                                      >
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0">
                                          {p.username[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-heading font-bold text-white truncate">{p.username}</p>
                                          <p className="text-[10px] text-slate-500 font-heading">{p.game} · #{p.rank}</p>
                                        </div>
                                        <span className="text-[10px] text-purple-400 font-heading flex-shrink-0">{p.wins}W</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 font-heading text-center py-4">No players found</p>
                                )}
                              </motion.div>
                            )}
                          </div>
                        )}

                        {/* Squad ready status */}
                        {squadFull && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn(
                              "mt-2 flex items-center gap-2 p-2.5 rounded-xl border text-xs font-heading font-bold",
                              squadReady
                                ? "border-green-500/30 bg-green-500/5 text-green-400"
                                : "border-orange-500/30 bg-orange-500/5 text-orange-400"
                            )}
                          >
                            {squadReady ? (
                              <><CheckCircle2 className="w-4 h-4" /> Squad ready — all members confirmed!</>
                            ) : (
                              <><AlertCircle className="w-4 h-4" /> Waiting for members to accept invite...</>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {isFull ? (
                    <div className="text-center py-2">
                      <p className="text-red-400 font-heading font-semibold text-sm mb-3">Tournament is FULL</p>
                      <Link href="/tournaments" className="btn-secondary w-full py-3 rounded-xl font-heading font-bold text-sm text-center block">Browse Other Tournaments</Link>
                    </div>
                  ) : !canAfford(effectiveEntryFee) ? (
                    <div className="text-center py-2 space-y-2">
                      <p className="text-red-400 font-heading font-semibold text-sm">Insufficient wallet balance</p>
                      <p className="text-slate-500 text-xs font-heading">You need ₹{effectiveEntryFee} · You have ₹{balance.toLocaleString()}</p>
                      <Link href="/wallet/deposit" className="btn-gold w-full py-3 rounded-xl font-heading font-bold text-sm text-center block">+ Add Funds to Wallet</Link>
                    </div>
                  ) : isClashSquad && playMode === "squad" && !squadReady ? (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm flex items-center justify-center gap-2 opacity-40 cursor-not-allowed bg-gradient-to-r from-cyan-700 to-teal-600 text-white"
                    >
                      <Users className="w-4 h-4" />
                      {!squadFull ? `Add ${4 - squadMembers.length} more member${4 - squadMembers.length !== 1 ? "s" : ""}` : "Waiting for confirmations..."}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className={cn(
                        "w-full py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm relative flex items-center justify-center gap-2 disabled:opacity-60",
                        isClashSquad && playMode === "squad"
                          ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white shadow-lg shadow-cyan-900/30 transition-all"
                          : isClashSquad
                          ? "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-900/30 transition-all"
                          : "btn-primary"
                      )}
                    >
                      {registering ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          PROCESSING...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          {isClashSquad && playMode === "squad" ? <Users className="w-4 h-4" /> : isClashSquad ? <Zap className="w-4 h-4" /> : <Swords className="w-4 h-4" />}
                          {isClashSquad && playMode === "squad"
                            ? `REGISTER SQUAD · ₹${stake} × 4`
                            : isClashSquad
                            ? `STAKE ₹${stake} · WIN ₹${perPlayerPrize}`
                            : `JOIN FOR ₹${tournament.entry_fee}`}
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
