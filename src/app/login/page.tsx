"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, LogIn, ChevronRight, Grape } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, googleSignIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Check your credentials.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            // Role is fetched from DB post-login, 
            // but for a new user, you might eventually need a role selection step.
            // For now, removing UI toggle as requested.
            await googleSignIn("CREATOR"); // Default or handled by backend/existing account
            router.push("/dashboard");
        } catch (error) {
            console.error("Google sign in failed:", error);
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
                            Mission <span className="text-primary text-glow">Access</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authenticate to proceed</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Terminal Email</label>
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

                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-700"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-3"
                        >
                            <span>Initiate Login</span>
                            <ChevronRight size={18} />
                        </button>
                    </form>

                    {/* Footer Actions */}
                    <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-sm transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Enterprise Google Auth</span>
                        </button>

                        <p className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest">
                            New operator? <Link href="/signup" className="text-primary hover:text-glow">Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
