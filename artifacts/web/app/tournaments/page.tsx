"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TournamentCard } from "@/components/ui/tournament-card";
import { MOCK_TOURNAMENTS, MOCK_BGMI_TOURNAMENTS, MOCK_COD_TOURNAMENTS } from "@/lib/mock-data";
import { Search, Lock, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = ["All", "Battle Royale", "Clash Squad"];
const STATUSES = ["All", "Live", "Upcoming", "Completed"];

const GAMES = [
  {
    id: "ff",
    label: "Free Fire",
    emoji: "🔥",
    color: "orange",
    activeClass: "bg-orange-500/20 border-orange-500/60 text-orange-300",
    hoverClass: "hover:border-orange-500/30 hover:text-orange-300",
    accentBg: "from-orange-500/10 to-red-500/5",
    accentBorder: "border-orange-500/30",
    badgeBg: "bg-orange-500/15 border-orange-500/30 text-orange-300",
    comingSoon: false,
  },
  {
    id: "bgmi",
    label: "BGMI",
    emoji: "🪖",
    color: "yellow",
    activeClass: "bg-yellow-500/20 border-yellow-500/60 text-yellow-300",
    hoverClass: "hover:border-yellow-500/30 hover:text-yellow-300",
    accentBg: "from-yellow-500/10 to-amber-500/5",
    accentBorder: "border-yellow-500/30",
    badgeBg: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300",
    comingSoon: true,
  },
  {
    id: "cod",
    label: "COD Mobile",
    emoji: "💀",
    color: "green",
    activeClass: "bg-green-500/20 border-green-500/60 text-green-300",
    hoverClass: "hover:border-green-500/30 hover:text-green-300",
    accentBg: "from-green-500/10 to-emerald-500/5",
    accentBorder: "border-green-500/30",
    badgeBg: "bg-green-500/15 border-green-500/30 text-green-300",
    comingSoon: true,
  },
];

function ComingSoonOverlay({ game }: { game: typeof GAMES[0] }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]/70 backdrop-blur-[3px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex flex-col items-center gap-4 px-6 py-8 text-center"
      >
        <div className={cn(
          "w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-lg",
          game.id === "bgmi" ? "border-yellow-500/50 bg-yellow-500/10 shadow-yellow-900/30"
            : "border-green-500/50 bg-green-500/10 shadow-green-900/30"
        )}>
          <Lock className={cn("w-7 h-7", game.id === "bgmi" ? "text-yellow-400" : "text-green-400")} />
        </div>
        <div>
          <p className={cn(
            "font-display font-black text-2xl mb-1",
            game.id === "bgmi" ? "text-yellow-400" : "text-green-400"
          )}>
            COMING SOON
          </p>
          <p className="text-slate-300 font-heading text-sm mb-1">
            {game.label} tournaments are in the works!
          </p>
          <p className="text-slate-500 font-heading text-xs">
            We&apos;re onboarding top {game.label} players. Stay tuned.
          </p>
        </div>
        <button className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl border font-heading font-bold text-sm transition-all",
          game.id === "bgmi"
            ? "border-yellow-500/40 text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20"
            : "border-green-500/40 text-green-300 bg-green-500/10 hover:bg-green-500/20"
        )}>
          <Bell className="w-4 h-4" /> Notify Me
        </button>
      </motion.div>
    </div>
  );
}

export default function TournamentsPage() {
  const [activeGame, setActiveGame] = useState("ff");
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const currentGame = GAMES.find(g => g.id === activeGame)!;

  const allTournaments =
    activeGame === "ff" ? MOCK_TOURNAMENTS :
    activeGame === "bgmi" ? MOCK_BGMI_TOURNAMENTS :
    MOCK_COD_TOURNAMENTS;

  const filtered = currentGame.comingSoon ? allTournaments : allTournaments.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedMode !== "All" && t.game_mode !== selectedMode) return false;
    if (selectedStatus !== "All" && t.status !== selectedStatus.toLowerCase()) return false;
    return true;
  });

  const liveCount = MOCK_TOURNAMENTS.filter(t => t.status === "live").length;
  const upcomingCount = MOCK_TOURNAMENTS.filter(t => t.status === "upcoming").length;

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {liveCount > 0 && (
              <div className="flex items-center gap-1.5 live-badge border rounded-full px-3 py-1 text-xs font-heading font-semibold">
                <div className="live-dot" /> {liveCount} LIVE
              </div>
            )}
            <span className="text-slate-400 text-sm font-heading">{upcomingCount} upcoming</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
            TOURNAMENT <span className="gradient-text">ARENA</span>
          </h1>
          <p className="text-slate-400 font-heading text-sm">Choose your game, pick your mode, dominate</p>
        </motion.div>

        {/* Game selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="flex gap-3 mb-6"
        >
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={cn(
                "relative flex items-center gap-2.5 px-5 py-3 rounded-xl border font-heading font-bold text-sm transition-all",
                activeGame === game.id
                  ? game.activeClass
                  : cn("border-white/10 text-slate-400", game.hoverClass)
              )}
            >
              <span className="text-base">{game.emoji}</span>
              <span>{game.label}</span>
              {game.comingSoon && (
                <span className="ml-1 text-[9px] font-heading font-black tracking-widest bg-white/10 text-slate-400 rounded-full px-1.5 py-0.5 border border-white/10">
                  SOON
                </span>
              )}
              {!game.comingSoon && activeGame === game.id && liveCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Section header strip */}
        <motion.div
          key={activeGame}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center justify-between px-5 py-3 rounded-xl border mb-5 bg-gradient-to-r",
            currentGame.accentBg, currentGame.accentBorder
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentGame.emoji}</span>
            <div>
              <p className="font-display font-bold text-white text-base leading-tight">{currentGame.label}</p>
              <p className="text-xs font-heading text-slate-400">
                {currentGame.comingSoon
                  ? "Launching soon — register interest"
                  : `${allTournaments.length} tournaments · ${allTournaments.filter(t => t.game_mode === "Solo").length} Solo · ${allTournaments.filter(t => t.game_mode === "Duo").length} Duo · ${allTournaments.filter(t => t.game_mode === "Squad").length} Squad`}
              </p>
            </div>
          </div>
          {currentGame.comingSoon ? (
            <span className={cn("text-xs font-heading font-bold px-3 py-1.5 rounded-full border", currentGame.badgeBg)}>
              🔒 LOCKED
            </span>
          ) : (
            <span className={cn("text-xs font-heading font-bold px-3 py-1.5 rounded-full border", currentGame.badgeBg)}>
              ✅ LIVE
            </span>
          )}
        </motion.div>

        {/* Filters — only for Free Fire */}
        <AnimatePresence>
          {!currentGame.comingSoon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Filter toggle on mobile */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-slate-500 font-heading uppercase tracking-widest mr-1">Mode:</span>
                {MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all",
                      selectedMode === mode
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                    )}
                  >
                    {mode === "Battle Royale" ? "🔥 Battle Royale" : mode === "Clash Squad" ? "⚔️ Clash Squad" : "All"}
                  </button>
                ))}

                <div className="h-4 w-px bg-white/10 mx-1" />
                <span className="text-xs text-slate-500 font-heading uppercase tracking-widest mr-1">Status:</span>
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all",
                      selectedStatus === status
                        ? "bg-purple-600/30 border-purple-500/60 text-purple-300"
                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                    )}
                  >
                    {status}
                  </button>
                ))}

                <div className="relative ml-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tournaments..."
                    className="gaming-input pl-9 pr-4 py-1.5 rounded-xl text-xs w-44 sm:w-56"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-400 font-heading">
                  <span className="text-white font-semibold">{filtered.length}</span> tournaments found
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tournament grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentGame.comingSoon ? (
              /* Coming Soon layout with blurred ghost cards */
              <div className="relative rounded-2xl overflow-hidden">
                {/* Blurred ghost cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 select-none pointer-events-none">
                  {allTournaments.map((tournament, i) => (
                    <div key={tournament.id} className="blur-sm opacity-40">
                      <TournamentCard tournament={tournament} index={i} />
                    </div>
                  ))}
                </div>
                {/* Overlay */}
                <ComingSoonOverlay game={currentGame} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 glass-card rounded-2xl">
                <span className="text-5xl block mb-4">🔥</span>
                <h3 className="font-display font-bold text-xl text-slate-400 mb-2">NO TOURNAMENTS FOUND</h3>
                <p className="text-slate-500 text-sm font-heading">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((tournament, i) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
