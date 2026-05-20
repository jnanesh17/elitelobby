"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Mail, Lock, User, Gamepad2, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", game_id: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center glow-purple">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">ELITELOBBY</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white mb-1">CREATE ACCOUNT</h1>
          <p className="text-slate-400 text-sm">Join the elite squad and start winning</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all ${
                  step >= s ? "bg-purple-600 text-white glow-purple" : "bg-white/10 text-slate-400"
                }`}>{s}</div>
                <div className={`h-px flex-1 transition-colors ${step > s ? "bg-purple-500/50" : "bg-white/10"}`} />
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="CyberWarrior99" className="gaming-input w-full pl-10 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="gaming-input w-full pl-10 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Game UID</label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.game_id} onChange={(e) => update("game_id", e.target.value)} placeholder="FF123456789" className="gaming-input w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 font-heading">Your in-game player UID. Used to verify match results.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { if (form.username && form.email) setStep(2); }}
                  className="btn-primary w-full py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm relative"
                  disabled={!form.username || !form.email}
                >
                  <span className="relative z-10">CONTINUE →</span>
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 6 characters" className="gaming-input w-full pl-10 pr-10 py-3 rounded-xl text-sm" required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-heading font-semibold text-xs tracking-widest text-slate-300 uppercase block mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPass ? "text" : "password"} value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="Re-enter password" className="gaming-input w-full pl-10 pr-4 py-3 rounded-xl text-sm" required />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm font-heading">{error}</div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary px-5 py-3.5 rounded-xl font-heading font-bold text-sm">← BACK</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5 rounded-xl font-heading font-bold tracking-wider text-sm relative flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? (
                      <span className="relative z-10 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        CREATING...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2"><UserPlus className="w-4 h-4" /> CREATE ACCOUNT</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
