"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createWithdrawalRequest, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_USER } from "@/lib/mock-data";
import { ArrowLeft, ArrowUpRight, Shield, Clock, CheckCircle2, ChevronRight, Smartphone, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_WITHDRAW = [100, 200, 500, 1000];

type WStep = 1 | 2 | 3;

export default function WithdrawPage() {
  const [step, setStep] = useState<WStep>(1);
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const router = useRouter();

  const finalAmount = selectedPreset ?? (parseInt(amount) || 0);
  const isValid = finalAmount >= 100 && finalAmount <= MOCK_USER.wallet_balance;
  const fee = finalAmount >= 500 ? 0 : 10;
  const netAmount = finalAmount - fee;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        await createWithdrawalRequest({ userId: "demo-user", amount: finalAmount, upiId });
      }
      setRefId(`EL-WD-${Date.now().toString().slice(-8)}`);
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/wallet" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-heading text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Wallet
        </Link>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[
            { s: 1 as WStep, label: "Amount" },
            { s: 2 as WStep, label: "UPI Details" },
            { s: 3 as WStep, label: "Done" },
          ].map((item, i, arr) => (
            <div key={item.s} className={cn("flex items-center", i < arr.length - 1 && "flex-1")}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all flex-shrink-0",
                step > item.s ? "bg-green-500 text-white" : step === item.s ? "bg-purple-600 text-white glow-purple" : "bg-white/10 text-slate-500"
              )}>
                {step > item.s ? <CheckCircle2 className="w-3.5 h-3.5" /> : item.s}
              </div>
              <span className={cn("text-xs font-heading font-semibold mx-1 hidden sm:block", step === item.s ? "text-white" : step > item.s ? "text-green-400" : "text-slate-500")}>
                {item.label}
              </span>
              {i < arr.length - 1 && <div className={cn("flex-1 h-px mx-1", step > item.s ? "bg-green-500/40" : "bg-white/10")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Amount */}
          {step === 1 && (
            <motion.div key="w1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-1">
                    WITHDRAW <span className="gradient-text">FUNDS</span>
                  </h2>
                  <p className="text-slate-400 text-sm font-heading">Available: <span className="text-yellow-400 font-bold font-display">₹{MOCK_USER.wallet_balance.toLocaleString()}</span></p>
                </div>

                {/* Preset amounts */}
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_WITHDRAW.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedPreset(p); setAmount(""); }}
                      disabled={p > MOCK_USER.wallet_balance}
                      className={cn(
                        "py-3 rounded-xl border-2 font-display font-bold text-base transition-all",
                        selectedPreset === p ? "border-purple-500/70 bg-purple/15 text-purple-300" : "border-white/10 bg-black/20 text-white hover:border-white/25",
                        p > MOCK_USER.wallet_balance && "opacity-30 cursor-not-allowed"
                      )}
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-bold text-slate-400 text-lg">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }}
                      placeholder={`100 – ${MOCK_USER.wallet_balance}`}
                      min={100}
                      max={MOCK_USER.wallet_balance}
                      className="gaming-input w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Fee breakdown */}
                {finalAmount > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 p-4 bg-black/30 rounded-xl border border-white/5">
                    {[
                      { label: "Withdrawal Amount", value: `₹${finalAmount}` },
                      { label: "Processing Fee", value: fee > 0 ? `-₹${fee}` : "FREE", color: fee > 0 ? "text-red-400" : "text-green-400" },
                      { label: "You'll Receive", value: `₹${netAmount}`, bold: true, color: "text-yellow-400" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm py-0.5">
                        <span className={cn("font-heading text-slate-400")}>{row.label}</span>
                        <span className={cn("font-heading font-bold", row.color ?? "text-white", row.bold && "text-base")}>{row.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {fee > 0 && finalAmount > 0 && (
                  <p className="text-xs text-slate-500 font-heading flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Withdraw ₹500+ for free. ₹10 fee for smaller amounts.
                  </p>
                )}

                {finalAmount > MOCK_USER.wallet_balance && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-heading">
                    <AlertTriangle className="w-4 h-4" /> Exceeds available balance
                  </div>
                )}

                <button
                  onClick={() => isValid && setStep(2)}
                  disabled={!isValid}
                  className="btn-primary relative w-full py-3.5 rounded-xl font-heading font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    CONTINUE <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: UPI Details */}
          {step === 2 && (
            <motion.div key="w2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-1">UPI <span className="gradient-text">DETAILS</span></h2>
                  <p className="text-slate-400 text-sm font-heading">Enter your UPI ID to receive ₹{netAmount}</p>
                </div>

                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">UPI ID <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi / 9876543210@paytm"
                      className="gaming-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Account Holder Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    placeholder="Full name as on UPI"
                    className="gaming-input w-full px-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Confirmation box */}
                {upiId && upiName && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-purple/5 border border-purple/20 rounded-xl">
                    <p className="text-xs text-slate-400 font-heading mb-2">TRANSFER SUMMARY</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-heading">To UPI</span>
                        <span className="text-white font-heading font-bold font-mono">{upiId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-heading">Account Name</span>
                        <span className="text-white font-heading">{upiName}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-1 border-t border-white/5 mt-1">
                        <span className="text-slate-400 font-heading">Amount</span>
                        <span className="text-yellow-400 font-display font-bold">₹{netAmount}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-start gap-2.5 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300 font-heading leading-relaxed">
                    Ensure your UPI ID is correct. Wrong details may result in failed transfer. Processed within <strong>2-4 hours</strong>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary px-4 py-3 rounded-xl font-heading font-bold text-sm flex-shrink-0">← Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={!upiId.trim() || !upiName.trim() || submitting}
                    className="btn-primary relative flex-1 py-3 rounded-xl font-heading font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="relative z-10 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4" /> Confirm Withdrawal
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div key="w3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="glass-card rounded-2xl p-8 text-center border border-purple/30">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-20 h-20 bg-purple/20 border-2 border-purple/40 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-purple-400" />
                </motion.div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">REQUEST <span className="gradient-text">SUBMITTED!</span></h2>
                <p className="text-slate-400 font-heading text-sm mb-6">
                  Your withdrawal of ₹{netAmount} will be credited to <strong className="text-white font-mono">{upiId}</strong> within 2-4 hours.
                </p>
                <div className="bg-black/40 border border-purple/25 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-500 font-heading mb-1">Reference Number</p>
                  <p className="font-display font-bold text-xl text-purple-400">{refId}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/wallet" className="btn-secondary flex-1 py-3 rounded-xl font-heading font-bold text-sm text-center">View Wallet</Link>
                  <Link href="/tournaments" className="btn-primary relative flex-1 py-3 rounded-xl font-heading font-bold text-sm text-center"><span className="relative z-10">Browse Tournaments</span></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
