"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadPaymentProof, createDepositTransaction, isSupabaseConfigured } from "@/lib/supabase";
import { ArrowLeft, Zap, Copy, CheckCircle2, Clock, Shield, Phone, QrCode, Wallet, Info, ChevronRight, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [
  { amount: 100, bonus: 0, label: "Starter" },
  { amount: 200, bonus: 0, label: "Basic" },
  { amount: 500, bonus: 5, label: "Popular" },
  { amount: 1000, bonus: 10, label: "Pro" },
  { amount: 2000, bonus: 15, label: "Elite" },
  { amount: 5000, bonus: 20, label: "Champion" },
];

const UPI_ID = "elitelobby@upi";
const UPI_NAME = "EliteLobby Gaming";

const UPI_APPS = [
  { name: "PhonePe", color: "#5f259f", emoji: "📱" },
  { name: "GPay", color: "#1a73e8", emoji: "💳" },
  { name: "Paytm", color: "#00b9f1", emoji: "💰" },
  { name: "BHIM", color: "#ff6b00", emoji: "🏦" },
];

type Step = 1 | 2 | 3 | 4;

function StepIndicator({ current, step, label }: { current: Step; step: Step; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={cn("flex items-center gap-1.5", step < 4 && "flex-1")}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all flex-shrink-0",
        done ? "bg-green-500 text-white" : active ? "bg-purple-600 text-white glow-purple" : "bg-white/10 text-slate-500"
      )}>
        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
      </div>
      <span className={cn("text-xs font-heading font-semibold hidden sm:block", active ? "text-white" : done ? "text-green-400" : "text-slate-500")}>
        {label}
      </span>
      {step < 4 && <div className={cn("flex-1 h-px mx-1", done ? "bg-green-500/40" : "bg-white/10")} />}
    </div>
  );
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [left]);
  const mins = Math.floor(left / 60);
  const secs = left % 60;
  const pct = (left / seconds) * 100;
  return (
    <div className="flex flex-col items-center">
      <div className={cn("font-display font-bold text-2xl transition-colors", left < 60 ? "text-red-400" : "text-cyan-400")}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
      <p className="text-xs text-slate-500 font-heading">time remaining</p>
      <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: left < 60 ? "#ef4444" : "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
        />
      </div>
    </div>
  );
}

export default function DepositPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const finalAmount = selectedAmount ?? (parseInt(customAmount) || 0);
  const bonusInfo = PRESET_AMOUNTS.find(p => p.amount === finalAmount);
  const bonusAmount = bonusInfo ? Math.round(finalAmount * bonusInfo.bonus / 100) : 0;
  const totalCredit = finalAmount + bonusAmount;

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent("EliteLobby Wallet Top-up")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&bgcolor=0a0a14&color=a855f7&qzone=2&format=png`;

  async function copyUpi() {
    await navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  }

  async function handleSubmit() {
    if (!utrNumber.trim()) return;
    setSubmitting(true);
    try {
      let screenshotUrl: string | null = null;
      // Upload to Supabase Storage if configured
      if (file && isSupabaseConfigured) {
        screenshotUrl = await uploadPaymentProof(file, "demo-user");
      }
      // Create transaction record if Supabase configured
      if (isSupabaseConfigured) {
        await createDepositTransaction({
          userId: "demo-user",
          amount: finalAmount,
          utrNumber: utrNumber.trim(),
          screenshotUrl,
          note: note.trim() || undefined,
        });
      }
      // Generate reference number
      const ref = `EL-DEP-${Date.now().toString().slice(-8)}`;
      setReferenceId(ref);
      setStep(4);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link href="/wallet" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-heading text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Wallet
        </Link>

        {/* Step progress */}
        <div className="flex items-center mb-8">
          <StepIndicator current={step} step={1} label="Amount" />
          <StepIndicator current={step} step={2} label="Pay" />
          <StepIndicator current={step} step={3} label="Proof" />
          <StepIndicator current={step} step={4} label="Done" />
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: SELECT AMOUNT ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display font-bold text-xl text-white mb-1">
                  ADD <span className="gradient-text-gold">FUNDS</span>
                </h2>
                <p className="text-slate-400 text-sm font-heading mb-5">Select the amount you want to deposit</p>

                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.amount}
                      onClick={() => { setSelectedAmount(preset.amount); setCustomAmount(""); }}
                      className={cn(
                        "relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200",
                        selectedAmount === preset.amount
                          ? "border-yellow-500/70 bg-yellow-500/10"
                          : "border-white/10 bg-black/20 hover:border-white/25"
                      )}
                    >
                      {preset.bonus > 0 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-heading font-bold rounded-full px-2 py-0.5 whitespace-nowrap">
                          +{preset.bonus}% Bonus
                        </div>
                      )}
                      {selectedAmount === preset.amount && (
                        <CheckCircle2 className="absolute top-2 right-2 w-3.5 h-3.5 text-yellow-400" />
                      )}
                      <span className={cn("text-xs font-heading font-semibold mb-1 mt-1", selectedAmount === preset.amount ? "text-yellow-400" : "text-slate-500")}>
                        {preset.label}
                      </span>
                      <span className={cn("font-display font-black text-xl", selectedAmount === preset.amount ? "text-yellow-400" : "text-white")}>
                        ₹{preset.amount}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-bold text-slate-400 text-lg">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                      placeholder="Enter amount (min ₹100)"
                      min={100}
                      max={50000}
                      className="gaming-input w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-heading mt-1.5">Minimum ₹100 · Maximum ₹50,000 per transaction</p>
                </div>

                {/* Bonus summary */}
                {finalAmount >= 500 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-500/10 border border-green-500/25 rounded-xl flex items-center gap-3"
                  >
                    <Gift className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-heading font-semibold text-white">
                        You'll receive ₹{totalCredit.toLocaleString()}!
                      </p>
                      <p className="text-xs text-green-400 font-heading">
                        ₹{finalAmount} + ₹{bonusAmount} bonus credited to your wallet
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={() => finalAmount >= 100 && setStep(2)}
                  disabled={finalAmount < 100}
                  className="btn-gold w-full py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CONTINUE TO PAYMENT <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-heading">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-400" /> Secured</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-400" /> Instant Credit</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 24/7 Support</span>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: MAKE PAYMENT ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-xs font-heading">Pay Exactly</p>
                    <p className="font-display font-black text-3xl gradient-text-gold">₹{finalAmount.toLocaleString()}</p>
                  </div>
                  <CountdownTimer seconds={600} />
                </div>

                {/* QR Code */}
                <div className="inline-block p-4 rounded-2xl border-2 border-purple/30 bg-black/40 mb-4">
                  <img
                    src={qrUrl}
                    alt="UPI QR Code"
                    width={220}
                    height={220}
                    className="rounded-xl"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>

                <p className="text-slate-400 text-xs font-heading mb-3">Scan with any UPI app</p>

                {/* UPI ID */}
                <div className="flex items-center justify-between bg-black/40 border border-purple/25 rounded-xl px-4 py-3 mb-4">
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-heading">UPI ID</p>
                    <p className="font-heading font-bold text-purple-300 text-base">{UPI_ID}</p>
                  </div>
                  <button
                    onClick={copyUpi}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-heading font-bold transition-all",
                      copiedUpi
                        ? "border-green-500/40 text-green-400 bg-green-500/10"
                        : "border-purple/30 text-purple-400 hover:border-purple/60"
                    )}
                  >
                    {copiedUpi ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>

                {/* UPI Apps */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {UPI_APPS.map((app) => (
                    <a
                      key={app.name}
                      href={upiLink}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-white/10 hover:border-white/25 bg-black/20 transition-all group"
                    >
                      <span className="text-2xl">{app.emoji}</span>
                      <span className="text-xs text-slate-400 group-hover:text-white font-heading transition-colors">{app.name}</span>
                    </a>
                  ))}
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-left mb-5">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300 font-heading leading-relaxed">
                    Pay <strong className="text-yellow-400">exactly ₹{finalAmount}</strong> — no rounding. After payment, save the screenshot and note your UTR/transaction ID for the next step.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary px-4 py-3 rounded-xl font-heading font-bold text-sm flex-shrink-0">
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-primary relative flex-1 py-3 rounded-xl font-heading font-bold text-sm"
                  >
                    <span className="relative z-10">I've Paid — Upload Proof →</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: UPLOAD PROOF ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-1">
                    UPLOAD <span className="gradient-text">PROOF</span>
                  </h2>
                  <p className="text-slate-400 text-sm font-heading">Share your payment screenshot for verification</p>
                </div>

                {/* Payment summary */}
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-purple/15">
                  <p className="text-slate-400 text-sm font-heading">Amount Paid</p>
                  <p className="font-display font-bold text-yellow-400">₹{finalAmount.toLocaleString()}</p>
                </div>

                {/* File upload */}
                <FileUpload
                  onFileSelect={setFile}
                  label="Payment Screenshot"
                  maxSizeMB={10}
                />

                {/* UTR number */}
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">
                    UTR / Transaction ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12-digit UTR number (e.g. 012345678901)"
                    className="gaming-input w-full px-4 py-3 rounded-xl text-sm font-mono"
                    required
                  />
                  <p className="text-xs text-slate-500 font-heading mt-1.5">
                    Find this in your UPI app under transaction details
                  </p>
                </div>

                {/* Optional note */}
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any additional info for admin..."
                    rows={2}
                    className="gaming-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-purple/5 border border-purple/20 rounded-xl">
                  <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-400 font-heading leading-relaxed">
                    Your payment will be verified by our team within <strong className="text-white">30 minutes</strong> during business hours (9 AM – 11 PM IST). Funds will be credited automatically once approved.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary px-4 py-3 rounded-xl font-heading font-bold text-sm flex-shrink-0">
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!utrNumber.trim() || submitting}
                    className="btn-gold flex-1 py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Submit for Review</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="glass-card rounded-2xl p-8 border border-green-500/25">
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-20 h-20 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>

                <h2 className="font-display font-bold text-2xl text-white mb-2">
                  SUBMITTED <span className="text-green-400">SUCCESSFULLY!</span>
                </h2>
                <p className="text-slate-400 font-heading text-sm mb-6 leading-relaxed">
                  Your deposit of ₹{finalAmount.toLocaleString()} is under review.
                  {bonusAmount > 0 && ` You'll receive ₹${totalCredit.toLocaleString()} (includes ₹${bonusAmount} bonus) once approved.`}
                </p>

                {/* Reference number */}
                <div className="bg-black/40 border border-purple/25 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-500 font-heading mb-1">Reference Number</p>
                  <p className="font-display font-bold text-xl text-purple-400">{referenceId}</p>
                  <p className="text-xs text-slate-500 font-heading mt-2">Save this for support inquiries</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  {[
                    { icon: <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />, label: "Processing Time", value: "~30 min" },
                    { icon: <Shield className="w-4 h-4 text-green-400 mx-auto mb-1" />, label: "Status", value: "Under Review" },
                    { icon: <Wallet className="w-4 h-4 text-cyan-400 mx-auto mb-1" />, label: "Will Credit", value: `₹${totalCredit}` },
                  ].map((item) => (
                    <div key={item.label} className="bg-black/20 rounded-xl p-3 border border-white/5">
                      {item.icon}
                      <p className="text-xs text-slate-500 font-heading">{item.label}</p>
                      <p className="font-heading font-bold text-white text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/wallet" className="btn-secondary flex-1 py-3 rounded-xl font-heading font-bold text-sm text-center">
                    View Wallet
                  </Link>
                  <Link href="/tournaments" className="btn-primary relative flex-1 py-3 rounded-xl font-heading font-bold text-sm text-center">
                    <span className="relative z-10">Browse Tournaments</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
