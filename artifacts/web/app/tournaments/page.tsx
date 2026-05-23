"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TournamentCard } from "@/components/ui/tournament-card";
import { MOCK_TOURNAMENTS } from "@/lib/mock-data";
import { Search, SlidersHorizontal, Gamepad2, Users, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const GAMES = ["All", "Free Fire", "BGMI", "Valorant", "COD Mobile", "PUBG Mobile"];
const COMING_SOON_GAMES = new Set(["BGMI", "Valorant", "COD Mobile"]);
const MODES = ["All", "Solo", "Duo", "Squad"];
const STATUSES = ["All", "Live", "Upcoming", "Completed"];

export default function TournamentsPage() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_TOURNAMENTS.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.game.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedGame !== "All" && t.game !== selectedGame) return false;
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

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tournaments, games..."
                className="gaming-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border font-heading font-semibold text-sm transition-all",
                showFilters ? "bg-purple/20 border-purple/50 text-purple-300" : "border-purple/20 text-slate-400 hover:border-purple/40"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-purple/15 space-y-3"
            >
              {[
                { label: "Game", options: GAMES, state: selectedGame, setState: setSelectedGame },
                { label: "Mode", options: MODES, state: selectedMode, setState: setSelectedMode },
                { label: "Status", options: STATUSES, state: selectedStatus, setState: setSelectedStatus },
              ].map((filter) => (
                <div key={filter.label}>
                  <p className="text-xs text-slate-500 font-heading uppercase tracking-wider mb-2">{filter.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((opt) => {
                      const isComingSoon = filter.label === "Game" && COMING_SOON_GAMES.has(opt);
                      return (
                        <button
                          key={opt}
                          disabled={isComingSoon}
                          onClick={() => !isComingSoon && filter.setState(opt)}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-heading font-semibold border transition-all",
                            isComingSoon
                              ? "border-white/5 text-slate-600 cursor-not-allowed opacity-60"
                              : filter.state === opt
                              ? "bg-purple-600/30 border-purple-500/60 text-purple-300"
                              : "border-white/10 text-slate-400 hover:border-white/20"
                          )}
                        >
                          {opt}
                          {isComingSoon && (
                            <span className="ml-1.5 text-[9px] font-bold text-amber-500/80 uppercase tracking-wide">Soon</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {GAMES.slice(1).map((game) => {
            const isComingSoon = COMING_SOON_GAMES.has(game);
            return (
              <button
                key={game}
                disabled={isComingSoon}
                onClick={() => !isComingSoon && setSelectedGame(selectedGame === game ? "All" : game)}
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all",
                  isComingSoon
                    ? "border-white/5 text-slate-600 cursor-not-allowed opacity-60"
                    : selectedGame === game
                    ? "bg-purple-600/30 border-purple-500/60 text-purple-300"
                    : "border-white/10 text-slate-400 hover:border-white/20"
                )}
              >
                {game}
                {isComingSoon && (
                  <span className="ml-1.5 text-[9px] font-bold text-amber-500/80 uppercase tracking-wide">Soon</span>
                )}
              </button>
            );
          })}
        </div>

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
