"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { sendPasswordReset } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await sendPasswordReset(email);
            setSuccess(true);
        } catch (error: any) {
            console.error("Password reset failed:", error);
            setError(error.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="glass-panel p-10 md:p-14 rounded-[40px] border border-white/5 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform">
                                <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                                    <Zap className="text-white fill-current" size={24} />
                                </div>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter italic">UCP</span>
                        </Link>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase mb-3">
                            Reset <span className="text-primary text-glow">Password</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            {success ? "Check your email" : "Enter your email address"}
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white mb-2">Email Sent!</h3>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                        We've sent a password reset link to <span className="text-white font-bold">{email}</span>.
                                        Check your inbox and follow the instructions.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/login"
                                className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all"
                            >
                                <ArrowLeft size={18} />
                                <span className="uppercase tracking-widest text-sm">Back to Login</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="operator@nexus.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-700"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-10 pt-10 border-t border-white/5">
                                <p className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                                    Remember your password? <Link href="/login" className="text-primary hover:text-glow">Sign In</Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
