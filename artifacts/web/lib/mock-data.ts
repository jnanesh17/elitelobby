// Fixed base time — using a stable reference so SSR and client hydration produce
// identical date strings and avoid React hydration mismatches.
const _BASE = new Date("2026-05-28T20:00:00.000Z").getTime();
const _T = (offsetMs: number) => new Date(_BASE + offsetMs).toISOString();

export const MOCK_TOURNAMENTS = [
  {
    id: "ff-br",
    title: "Free Fire Battle Royale",
    game: "Free Fire",
    game_mode: "Battle Royale",
    entry_fee: 50,
    prize_pool: 1000,
    max_slots: 48,
    filled_slots: 26,
    match_time: _T(2 * 3600000),
    map_name: "Random",
    status: "upcoming",
    banner_url: null,
    rules: "Random map each match. Choose your mode:\n• Solo — ₹50 entry, win ₹500\n• Duo (per team) — ₹70 entry, win ₹750\n• Squad (per team) — ₹100 entry, win ₹1,000\nTop placement + kill points determine winners. No hacking or cheating. Results are final.",
  },
  {
    id: "ff-cs",
    title: "Free Fire Clash Squad",
    game: "Free Fire",
    game_mode: "Clash Squad",
    entry_fee: 100,
    prize_pool: 1800,
    max_slots: 8,
    filled_slots: 4,
    match_time: _T(4 * 3600000),
    map_name: "Host Pick",
    status: "upcoming",
    banner_url: null,
    rules: "4v4 Clash Squad. Map is randomly selected by the host — Bermuda, Kalahari, or Purgatory. Stake ₹100–₹1,000 per player. Winner gets 1.8× their stake. Best of 5 rounds. No revive in final round.",
  },
];

export const MOCK_BGMI_TOURNAMENTS = [
  {
    id: "bgmi-t1",
    title: "BGMI Pro League Season 1",
    game: "BGMI",
    game_mode: "Squad",
    entry_fee: 100,
    prize_pool: 15000,
    max_slots: 25,
    filled_slots: 0,
    match_time: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    map_name: "Erangel",
    status: "upcoming",
    banner_url: null,
    rules: "Standard BGMI tournament rules.",
  },
  {
    id: "bgmi-t2",
    title: "BGMI Solo Ranked Cup",
    game: "BGMI",
    game_mode: "Solo",
    entry_fee: 50,
    prize_pool: 8000,
    max_slots: 48,
    filled_slots: 0,
    match_time: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
    map_name: "Miramar",
    status: "upcoming",
    banner_url: null,
    rules: "Solo survival. Top 5 win prizes.",
  },
  {
    id: "bgmi-t3",
    title: "BGMI Duo Clash",
    game: "BGMI",
    game_mode: "Duo",
    entry_fee: 80,
    prize_pool: 10000,
    max_slots: 24,
    filled_slots: 0,
    match_time: new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
    map_name: "Vikendi",
    status: "upcoming",
    banner_url: null,
    rules: "Duo format. Most placement + kills wins.",
  },
];

export const MOCK_COD_TOURNAMENTS = [
  {
    id: "cod-t1",
    title: "COD Mobile Battle Royale",
    game: "COD Mobile",
    game_mode: "Squad",
    entry_fee: 120,
    prize_pool: 20000,
    max_slots: 25,
    filled_slots: 0,
    match_time: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    map_name: "Isolated",
    status: "upcoming",
    banner_url: null,
    rules: "Standard COD Mobile BR rules.",
  },
  {
    id: "cod-t2",
    title: "COD Mobile Multiplayer Cup",
    game: "COD Mobile",
    game_mode: "Squad",
    entry_fee: 75,
    prize_pool: 12000,
    max_slots: 16,
    filled_slots: 0,
    match_time: new Date(Date.now() + 12 * 24 * 3600000).toISOString(),
    map_name: "Nuketown",
    status: "upcoming",
    banner_url: null,
    rules: "5v5 multiplayer format. Best of 3.",
  },
  {
    id: "cod-t3",
    title: "COD Mobile Solo Ranked",
    game: "COD Mobile",
    game_mode: "Solo",
    entry_fee: 50,
    prize_pool: 6000,
    max_slots: 32,
    filled_slots: 0,
    match_time: new Date(Date.now() + 9 * 24 * 3600000).toISOString(),
    map_name: "Crash",
    status: "upcoming",
    banner_url: null,
    rules: "Solo ranked format. Top 3 win prizes.",
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, username: "NightShade_X", game: "BGMI", wins: 47, kills: 2840, earnings: 185000, avatar: null, trend: "up" },
  { rank: 2, username: "ShadowKing99", game: "Free Fire", wins: 42, kills: 2210, earnings: 162000, avatar: null, trend: "up" },
  { rank: 3, username: "ProSniper_Z", game: "Valorant", wins: 38, kills: 1890, earnings: 143000, avatar: null, trend: "down" },
  { rank: 4, username: "EliteForce77", game: "BGMI", wins: 35, kills: 1740, earnings: 128500, avatar: null, trend: "up" },
  { rank: 5, username: "GhostRider_M", game: "COD Mobile", wins: 31, kills: 1620, earnings: 115000, avatar: null, trend: "same" },
  { rank: 6, username: "ThunderBolt_S", game: "Free Fire", wins: 28, kills: 1510, earnings: 98000, avatar: null, trend: "down" },
  { rank: 7, username: "NeonAssassin", game: "PUBG Mobile", wins: 26, kills: 1440, earnings: 87500, avatar: null, trend: "up" },
  { rank: 8, username: "RedViper_99", game: "Valorant", wins: 24, kills: 1380, earnings: 76000, avatar: null, trend: "up" },
  { rank: 9, username: "CyberHawk_V2", game: "BGMI", wins: 22, kills: 1290, earnings: 65000, avatar: null, trend: "down" },
  { rank: 10, username: "StormRaider_K", game: "Free Fire", wins: 20, kills: 1200, earnings: 54500, avatar: null, trend: "same" },
];

export const MOCK_RECENT_WINNERS = [
  { username: "NightShade_X", tournament: "BGMI Pro League", prize: 2500, position: 1, game: "BGMI" },
  { username: "ShadowKing99", tournament: "Free Fire Grand Series", prize: 2500, position: 1, game: "Free Fire" },
  { username: "ProSniper_Z", tournament: "Valorant Ranked Cup", prize: 2500, position: 1, game: "Valorant" },
  { username: "EliteForce77", tournament: "COD Mobile Mayhem", prize: 2500, position: 1, game: "COD Mobile" },
];

export const MOCK_STATS = {
  totalPlayers: 142580,
  totalPrizePool: 12500000,
  tournamentsThisMonth: 284,
  activeTournaments: 7,
};

export const MOCK_USER = {
  id: "demo-user",
  username: "DemoPlayer",
  game_id: "FF123456789",
  wallet_balance: 1250,
  total_winnings: 8500,
  kills: 342,
  rank_points: 4820,
  rank: "Gold",
  tournaments_played: 18,
  tournaments_won: 3,
};

export const MOCK_NOTIFICATIONS = [
  { id: "n1", title: "Room ID Released", message: "Room ID for BGMI Pro League is now available!", read: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: "n2", title: "Payment Approved", message: "Your ₹100 deposit has been approved.", read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "n3", title: "Match Result", message: "You finished 3rd in Free Fire Solo Blitz! ₹500 credited.", read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export const MOCK_TRANSACTIONS = [
  { id: "tx1", type: "deposit", amount: 500, status: "completed", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "tx2", type: "entry_fee", amount: -50, status: "completed", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "tx3", type: "winning", amount: 1500, status: "completed", created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: "tx4", type: "entry_fee", amount: -100, status: "completed", created_at: new Date(Date.now() - 21600000).toISOString() },
];

export const MOCK_REGISTRATIONS = [
  { id: "r1",  tournament_id: "ff-br", username: "NightShade_X",   game_uid: "FF-88241",   email: "night@example.com",   fee_paid: 50,  registered_at: new Date(Date.now() - 5 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r2",  tournament_id: "ff-br", username: "ShadowKing99",   game_uid: "FF-72910",   email: "shadow@example.com",  fee_paid: 50,  registered_at: new Date(Date.now() - 4 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r3",  tournament_id: "ff-br", username: "CyberHawk_V2",   game_uid: "FF-10023",   email: "cyber@example.com",   fee_paid: 100, registered_at: new Date(Date.now() - 3 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r4",  tournament_id: "ff-br", username: "StormRaider_K",  game_uid: "FF-33891",   email: "storm@example.com",   fee_paid: 70,  registered_at: new Date(Date.now() - 2 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r5",  tournament_id: "ff-br", username: "ProSniper_Z",    game_uid: "FF-55001",   email: "pro@example.com",     fee_paid: 50,  registered_at: new Date(Date.now() - 90 * 60000).toISOString(),   payment_status: "confirmed" },
  { id: "r6",  tournament_id: "ff-br", username: "EliteForce77",   game_uid: "FF-20938",   email: "elite@example.com",   fee_paid: 100, registered_at: new Date(Date.now() - 60 * 60000).toISOString(),   payment_status: "confirmed" },

  { id: "r7",  tournament_id: "ff-cs", username: "GhostRider_M",   game_uid: "FF-91004",   email: "ghost@example.com",   fee_paid: 200,  registered_at: new Date(Date.now() - 3 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r8",  tournament_id: "ff-cs", username: "ThunderBolt_S",  game_uid: "FF-77321",   email: "thunder@example.com", fee_paid: 200,  registered_at: new Date(Date.now() - 2 * 3600000).toISOString(),  payment_status: "confirmed" },
  { id: "r9",  tournament_id: "ff-cs", username: "NeonAssassin",   game_uid: "FF-48871",   email: "neon@example.com",    fee_paid: 500,  registered_at: new Date(Date.now() - 80 * 60000).toISOString(),   payment_status: "confirmed" },
  { id: "r10", tournament_id: "ff-cs", username: "RedViper_99",    game_uid: "FF-30012",   email: "red@example.com",     fee_paid: 500,  registered_at: new Date(Date.now() - 45 * 60000).toISOString(),   payment_status: "confirmed" },
];
