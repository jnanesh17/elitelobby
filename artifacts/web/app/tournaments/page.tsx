"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TournamentCard } from "@/components/ui/tournament-card";
import { MOCK_TOURNAMENTS } from "@/lib/mock-data";
import { Search, SlidersHorizontal, Gamepad2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = ["All", "Solo", "Duo", "Squad"];
const STATUSES = ["All", "Live", "Upcoming", "Completed"];

export default function TournamentsPage() {
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_TOURNAMENTS.filter((t) => {
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-heading font-bold text-orange-400 bg-orange-500/10 border border-orange-500/25 rounded-full px-3 py-1">
              🔥 FREE FIRE ONLY
            </span>
            {liveCount > 0 && (
              <div className="flex items-center gap-1.5 live-badge border rounded-full px-3 py-1 text-xs font-heading font-semibold">
                <div className="live-dot" />
                {liveCount} LIVE
              </div>
            )}
            <span className="text-slate-400 text-sm font-heading">{upcomingCount} upcoming</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
            TOURNAMENT <span className="gradient-text">ARENA</span>
          </h1>
          <p className="text-slate-400 font-heading text-sm">Choose your battlefield and dominate</p>
        </motion.div>

        {/* Mode quick filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center gap-2 mb-5"
        >
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
              {mode === "Squad" ? "⚔️ Squad" : mode === "Duo" ? "🤝 Duo" : mode === "Solo" ? "🎯 Solo" : "All"}
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

          {/* Search */}
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
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-400 font-heading">
            <span className="text-white font-semibold">{filtered.length}</span> tournaments found
          </p>
        </div>

        {/* Tournament grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
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
      </div>
    </div>
  );
}
