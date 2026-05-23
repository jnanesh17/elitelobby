"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { createClient } from "@/lib/supabase";

export type NotificationType =
  | "deposit_approved"
  | "deposit_rejected"
  | "tournament_starting"
  | "room_id_released"
  | "prize_credited"
  | "announcement"
  | "withdrawal_processed";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  dismissed: boolean;
  created_at: string;
  meta?: Record<string, unknown>;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "read" | "dismissed" | "created_at">) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const DEMO_SEQUENCE: Array<Omit<AppNotification, "id" | "read" | "dismissed" | "created_at">> = [
  {
    type: "tournament_starting",
    title: "Match Starting Soon!",
    message: "BGMI Pro League starts in 5 minutes. Get ready!",
    meta: { tournament: "BGMI Pro League", minutes: 5 },
  },
  {
    type: "deposit_approved",
    title: "Deposit Approved ✓",
    message: "Your ₹500 deposit has been verified and credited to your wallet.",
    meta: { amount: 500, bonus: 25 },
  },
  {
    type: "room_id_released",
    title: "Room ID Available!",
    message: "Room ID for Free Fire Grand Series is now live. Tap to reveal.",
    meta: { tournament: "Free Fire Grand Series" },
  },
  {
    type: "prize_credited",
    title: "Prize Money Credited! 🏆",
    message: "Congratulations! ₹1,500 has been credited for finishing 2nd in COD Mobile Mayhem.",
    meta: { amount: 1500, position: 2, tournament: "COD Mobile Mayhem" },
  },
  {
    type: "announcement",
    title: "New Tournament Added",
    message: "Valorant Champions Cup — ₹2,50,000 prize pool. Registration open now!",
    meta: {},
  },
];

const SEED_NOTIFICATIONS: Array<Omit<AppNotification, "id" | "read" | "dismissed" | "created_at">> = [
  {
    type: "deposit_approved",
    title: "Deposit Approved",
    message: "Your ₹500 top-up was approved and credited to your wallet.",
    meta: { amount: 500 },
  },
  {
    type: "prize_credited",
    title: "Prize Credited",
    message: "You earned ₹1,500 for finishing 2nd in Free Fire Solo Blitz!",
    meta: { amount: 1500 },
  },
  {
    type: "announcement",
    title: "Server Maintenance",
    message: "Scheduled maintenance on May 23 from 2–4 AM IST. Plan accordingly.",
    meta: {},
  },
];

function makeId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedTime(secondsAgo: number) {
  return new Date(Date.now() - secondsAgo * 1000).toISOString();
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const base = Date.now();
    return SEED_NOTIFICATIONS.map((n, i) => ({
      ...n,
      id: `seed-${base}-${i}`,
      read: i === 2,
      dismissed: false,
      created_at: seedTime((i + 1) * 3600),
    }));
  });

  const demoIndexRef = useRef(0);
  const toastQueueRef = useRef<AppNotification[]>([]);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "read" | "dismissed" | "created_at">): string => {
      const id = makeId();
      const full: AppNotification = {
        ...n,
        id,
        read: false,
        dismissed: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [full, ...prev]);
      toastQueueRef.current.push(full);
      return id;
    },
    []
  );

  // Drain toast queue — exposed via context for the toast component
  const drainToast = useCallback((): AppNotification | null => {
    return toastQueueRef.current.shift() ?? null;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: true })));
  }, []);

  // Demo: fire real-time notifications at intervals
  useEffect(() => {
    const delays = [8000, 20000, 38000, 60000, 90000];
    const timers = delays.map((delay, i) =>
      setTimeout(() => {
        const demo = DEMO_SEQUENCE[i % DEMO_SEQUENCE.length];
        if (demo) addNotification(demo);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [addNotification]);

  // Supabase Realtime subscription (when configured)
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transactions", filter: "user_id=eq.demo-user" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (row.status === "approved") {
            addNotification({
              type: "deposit_approved",
              title: "Deposit Approved ✓",
              message: `₹${row.amount} has been credited to your wallet.`,
              meta: { amount: row.amount as number },
            });
          } else if (row.status === "rejected") {
            addNotification({
              type: "deposit_rejected",
              title: "Deposit Rejected",
              message: "Your deposit could not be verified. Contact support for help.",
              meta: {},
            });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [addNotification]);

  const unreadCount = notifications.filter((n) => !n.read && !n.dismissed).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, dismiss, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
