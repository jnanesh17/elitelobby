"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TournamentCard } from "@/components/ui/tournament-card";
import { StatCard } from "@/components/ui/stats-counter";
import { MOCK_TOURNAMENTS, MOCK_LEADERBOARD, MOCK_RECENT_WINNERS, MOCK_STATS } from "@/lib/mock-data";
import { Trophy, Users, Zap, Shield, ChevronRight, MessageCircle, Star, Crown, Flame, Target, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

function HeroSection() {
  const [activePlayers, setActivePlayers] = useState(14258);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayers((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Scan line effect */}
      <div
        className="pointer-events-none absolute left-0 w-full h-px opacity-10"
        style={{
          background: "linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)",
          animation: "scan-line 8s linear infinite",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 live-badge border rounded-full px-4 py-2 mb-8"
        >
          <div className="live-dot" />
          <span className="font-heading font-semibold text-sm tracking-wide">
            {activePlayers.toLocaleString()} PLAYERS ONLINE NOW
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="font-display font-black leading-none mb-4">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl gradient-text" style={{ filter: "drop-shadow(0 0 30px rgba(124,58,237,0.5))" }}>
              ELITE
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white" style={{ filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5))" }}>
              LOBBY
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-heading font-semibold text-xl md:text-2xl text-slate-300 tracking-widest mb-10 uppercase"
        >
          Compete · Win · <span className="text-purple-400">Dominate</span>
        </motion.p>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {[
            { label: "Total Prize Pool", value: "₹1.25 CR+", color: "text-yellow-400" },
            { label: "Active Players", value: "1.4 Lakh+", color: "text-cyan-400" },
            { label: "Tournaments Run", value: "5000+", color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-full px-5 py-2 flex items-center gap-2 border border-white/10">
              <span className={`font-display font-bold text-sm ${stat.color}`}>{stat.value}</span>
              <span className="text-slate-400 text-xs font-heading">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/tournaments"
            className="btn-primary relative px-8 py-4 rounded-xl text-base font-heading font-bold tracking-wider flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Zap className="w-5 h-5 relative z-10" />
            <span className="relative z-10">JOIN THE BATTLE</span>
          </Link>
          <Link
            href="/leaderboard"
            className="btn-secondary px-8 py-4 rounded-xl text-base font-heading font-bold tracking-wider flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Trophy className="w-5 h-5" />
            VIEW LEADERBOARD
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500 font-heading tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={MOCK_STATS.totalPlayers} suffix="+" label="Total Players" color="purple" icon="🎮" />
          <StatCard value={12500000} prefix="₹" label="Total Prizes Won" color="gold" icon="🏆" />
          <StatCard value={MOCK_STATS.tournamentsThisMonth} label="Tournaments Monthly" color="cyan" icon="⚔️" />
          <StatCard value={MOCK_STATS.activeTournaments} label="Live Right Now" color="red" icon="🔥" />
        </div>
      </div>
    </section>
  );
}

function FeaturedTournaments() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-heading text-sm text-purple-400 tracking-widest uppercase mb-1">Battle Arena</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              ACTIVE <span className="gradient-text">TOURNAMENTS</span>
            </h2>
          </div>
          <Link href="/tournaments" className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TOURNAMENTS.filter((t) => t.status !== "completed").slice(0, 6).map((t, i) => (
            <TournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: <Users className="w-7 h-7" />,
      title: "Create Account",
      desc: "Sign up in seconds. Add your Game UID and verify your account.",
      color: "text-purple-400",
      border: "border-purple/30",
    },
    {
      step: "02",
      icon: <Zap className="w-7 h-7" />,
      title: "Add Funds & Register",
      desc: "Top up your wallet via UPI/QR and register for any tournament.",
      color: "text-cyan-400",
      border: "border-cyan/30",
    },
    {
      step: "03",
      icon: <Trophy className="w-7 h-7" />,
      title: "Compete & Win",
      desc: "Get Room ID before match, dominate, and withdraw your winnings instantly.",
      color: "text-yellow-400",
      border: "border-yellow-500/30",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-heading text-sm text-purple-400 tracking-widest uppercase mb-1">Simple Process</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
            HOW IT <span className="gradient-text">WORKS</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-px bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-yellow-500/30" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`glass-card rounded-xl p-6 text-center border ${step.border}`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-black/40 mb-4 ${step.color}`}>
                {step.icon}
              </div>
              <div className={`font-display font-black text-4xl mb-2 opacity-20 ${step.color}`}>{step.step}</div>
              <h3 className={`font-heading font-bold text-lg mb-2 ${step.color}`}>{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopPlayers() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-heading text-sm text-yellow-400 tracking-widest uppercase mb-1">Hall of Fame</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              TOP <span className="gradient-text-gold">EARNERS</span>
            </h2>
          </div>
          <Link href="/leaderboard" className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
            Full Board <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full gaming-table">
            <thead>
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Player</th>
                <th className="text-left hidden sm:table-cell">Game</th>
                <th className="text-right hidden md:table-cell">Kills</th>
                <th className="text-right hidden md:table-cell">Wins</th>
                <th className="text-right">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.slice(0, 5).map((player) => (
                <tr key={player.rank} className="group">
                  <td>
                    <div className="flex items-center gap-2">
                      {player.rank === 1 ? (
                        <span className="font-display text-yellow-400 font-bold">👑 1</span>
                      ) : player.rank === 2 ? (
                        <span className="font-display text-slate-300 font-bold">🥈 2</span>
                      ) : player.rank === 3 ? (
                        <span className="font-display text-amber-600 font-bold">🥉 3</span>
                      ) : (
                        <span className="font-display text-slate-500 font-bold">#{player.rank}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xs font-display font-bold text-white">
                        {player.username[0]}
                      </div>
                      <span className="font-heading font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {player.username}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-slate-400 text-sm">{player.game}</span>
                  </td>
                  <td className="hidden md:table-cell text-right">
                    <span className="font-display text-xs text-red-400 font-bold">{player.kills.toLocaleString()}</span>
                  </td>
                  <td className="hidden md:table-cell text-right">
                    <span className="font-display text-xs text-cyan-400 font-bold">{player.wins}</span>
                  </td>
                  <td className="text-right">
                    <span className="font-display text-sm font-bold gradient-text-gold">{formatCurrency(player.earnings)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function RecentWinners() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-heading text-sm text-red-400 tracking-widest uppercase mb-1">Latest Results</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
            RECENT <span className="gradient-text-fire">WINNERS</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_RECENT_WINNERS.map((winner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-2">👑</div>
              <div className="font-display font-bold text-base text-white mb-1">{winner.username}</div>
              <div className="text-xs text-slate-400 mb-3 font-heading">{winner.tournament}</div>
              <div className="font-display font-black text-xl gradient-text-gold">{formatCurrency(winner.prize)}</div>
              <div className="text-xs text-yellow-400 font-heading mt-1">1st Place</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { username: "NightShade_X", game: "BGMI", text: "Won ₹50K in my first big tournament! The platform is super smooth and payments are instant.", rating: 5 },
    { username: "ShadowKing99", game: "Free Fire", text: "Best esports platform in India. Transparent results, fast withdrawals, no drama.", rating: 5 },
    { username: "ProSniper_Z", game: "Valorant", text: "Finally a platform that takes competitive gaming seriously. Room IDs on time, great support.", rating: 5 },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
            WHAT PLAYERS <span className="gradient-text">SAY</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center font-display font-bold text-sm text-white">
                  {t.username[0]}
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm">{t.username}</p>
                  <p className="text-xs text-slate-400">{t.game} Player</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscordCTA() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="rgb-border glass-card rounded-2xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
            JOIN OUR <span className="gradient-text">DISCORD</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Get match announcements, room IDs, tips from pro players, and real-time tournament updates. 50,000+ members and growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="btn-primary relative px-8 py-3.5 rounded-xl text-sm font-heading font-bold tracking-wider inline-flex items-center gap-2 justify-center">
              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">JOIN DISCORD — FREE</span>
            </a>
            <Link href="/tournaments" className="btn-secondary px-8 py-3.5 rounded-xl text-sm font-heading font-bold tracking-wider inline-flex items-center gap-2 justify-center">
              Browse Tournaments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedTournaments />
      <HowItWorks />
      <TopPlayers />
      <RecentWinners />
      <Testimonials />
      <DiscordCTA />
    </>
  );
}
