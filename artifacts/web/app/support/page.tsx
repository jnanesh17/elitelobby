"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, ChevronDown, ChevronUp, Send, AlertTriangle, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I join a tournament?", a: "Register an account, add funds to your wallet, and click 'Register Now' on any active tournament." },
  { q: "When will I receive the Room ID?", a: "Room ID is released 15 minutes before match start time. You'll receive a notification and can view it in the tournament detail page." },
  { q: "How are winnings credited?", a: "Winnings are credited to your wallet within 24 hours after results are declared by admin." },
  { q: "What payment methods are supported?", a: "We support all UPI apps (GPay, PhonePe, Paytm), and QR code payments. Deposits are instant." },
  { q: "Can I get a refund if a tournament is cancelled?", a: "Yes, full entry fee refund is credited to your wallet if a tournament is cancelled by admin." },
  { q: "How do I report a cheater?", a: "Use the 'Report Player' form below with their Game UID and a screenshot. Our team reviews within 24 hours." },
  { q: "What is the minimum withdrawal amount?", a: "Minimum withdrawal is ₹100. Withdrawals are processed within 2-4 hours via UPI." },
  { q: "How do I update my Game UID?", a: "Go to Dashboard > Settings > Game ID section to update your in-game player UID." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className={cn("glass-card rounded-xl overflow-hidden transition-all", open === i && "border-purple/40")}>
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-5 py-4 text-left flex items-center justify-between gap-3">
            <span className="font-heading font-semibold text-white text-sm">{faq.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 pb-4"
            >
              <p className="text-sm text-slate-400 font-heading leading-relaxed">{faq.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "", category: "general" });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"faq" | "ticket" | "report">("faq");

  async function handleTicket(e: React.FormEvent) {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="font-heading text-sm text-purple-400 tracking-widest uppercase mb-1">We're here to help</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            SUPPORT <span className="gradient-text">CENTER</span>
          </h1>
          <p className="text-slate-400 font-heading text-sm">Average response time: under 2 hours</p>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <MessageCircle className="w-6 h-6" />, label: "Discord Support", sub: "Fastest response", color: "text-indigo-400", href: "#" },
            { icon: <Shield className="w-6 h-6" />, label: "Submit Ticket", sub: "Within 2 hours", color: "text-purple-400", onClick: () => setActiveTab("ticket") },
            { icon: <AlertTriangle className="w-6 h-6" />, label: "Report Player", sub: "Anti-cheat team", color: "text-red-400", onClick: () => setActiveTab("report") },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} className="glass-card rounded-xl p-5 text-left hover:border-purple/40 transition-all group">
              <div className={cn("mb-3", item.color)}>{item.icon}</div>
              <p className="font-heading font-bold text-white text-sm group-hover:text-purple-300 transition-colors">{item.label}</p>
              <p className="text-xs text-slate-500 font-heading">{item.sub}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-black/30 rounded-xl p-1 mb-6">
          {[
            { key: "faq", label: "FAQ" },
            { key: "ticket", label: "Submit Ticket" },
            { key: "report", label: "Report Player" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-xs font-heading font-bold tracking-wide transition-all",
                activeTab === tab.key ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === "faq" && (
            <div>
              <h3 className="font-heading font-bold text-white mb-4">Frequently Asked Questions</h3>
              <FAQ />
            </div>
          )}

          {activeTab === "ticket" && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-bold text-white mb-5">Submit a Support Ticket</h3>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">TICKET SUBMITTED!</h3>
                  <p className="text-slate-400 font-heading text-sm">We'll respond within 2 hours. Ticket #EL-{Math.floor(Math.random() * 9000) + 1000}</p>
                </div>
              ) : (
                <form onSubmit={handleTicket} className="space-y-4">
                  <div>
                    <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {["general", "payment", "tournament", "account", "bug"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setTicketForm(f => ({ ...f, category: cat }))}
                          className={cn("px-3 py-1.5 rounded-lg text-xs font-heading font-semibold border transition-all capitalize",
                            ticketForm.category === cat ? "bg-purple/20 border-purple/50 text-purple-300" : "border-white/10 text-slate-400"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Subject</label>
                    <input type="text" value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of issue" className="gaming-input w-full px-4 py-3 rounded-xl text-sm" required />
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Message</label>
                    <textarea value={ticketForm.message} onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue in detail..." rows={5} className="gaming-input w-full px-4 py-3 rounded-xl text-sm resize-none" required />
                  </div>
                  <button type="submit" className="btn-primary relative px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2">
                    <Send className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Submit Ticket</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "report" && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-bold text-white mb-2">Report a Player</h3>
              <p className="text-sm text-slate-400 font-heading mb-5">Our anti-cheat team reviews all reports within 24 hours.</p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Reported Player UID</label>
                  <input type="text" placeholder="In-game UID (e.g. FF123456789)" className="gaming-input w-full px-4 py-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Reason</label>
                  <div className="flex flex-wrap gap-2">
                    {["Cheating / Hacking", "Teaming in Solo", "Abusive Behavior", "Account Sharing", "Fraudulent Transaction"].map((r) => (
                      <button key={r} type="button" className="px-3 py-1.5 rounded-lg text-xs font-heading font-semibold border border-white/10 text-slate-400 hover:border-red-500/40 hover:text-red-400 transition-all">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Details</label>
                  <textarea placeholder="Describe what happened..." rows={4} className="gaming-input w-full px-4 py-3 rounded-xl text-sm resize-none" />
                </div>
                <button type="submit" className="btn-danger px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Submit Report
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
