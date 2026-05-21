import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotificationsProvider } from "@/lib/notifications-context";
import { NotificationToastContainer } from "@/components/ui/notification-toast";

export const metadata: Metadata = {
  title: "EliteLobby — Esports Tournament Platform",
  description: "Join paid tournaments, compete against the best, and win real cash prizes. India's #1 esports tournament platform.",
  keywords: ["esports", "tournament", "BGMI", "Free Fire", "Valorant", "online gaming", "cash prizes"],
  openGraph: {
    title: "EliteLobby",
    description: "Compete. Win. Dominate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <NotificationsProvider>
          <div className="grid-bg" />
          <Navbar />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
          <NotificationToastContainer />
        </NotificationsProvider>
      </body>
    </html>
  );
}
