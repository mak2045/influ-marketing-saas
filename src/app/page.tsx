"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, ShieldCheck, Star } from "lucide-react";
import NoSSR from "@/components/NoSSR";

export default function Home() {
  const { user, profile, signOut } = useAuth();

  return (
    <NoSSR>
      <div className="flex min-h-screen flex-col bg-[#020617] text-white selection:bg-primary/30 selection:text-white overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black tracking-tighter flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                U
              </div>
              <span>PLATFORM</span>
            </motion.div>

            <div className="hidden md:flex gap-8 items-center">
              <Link href="/campaigns" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Marketplace</Link>
              <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Creators</Link>
              <Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Pricing</Link>
            </div>

            <div className="flex gap-6 items-center">
              {user ? (
                <div className="flex items-center gap-6">
                  {profile?.role === "BRAND" || profile?.role === "ADMIN" ? (
                    <Link href="/dashboard/brand/campaigns/new" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Post Campaign</Link>
                  ) : (
                    <Link href="/dashboard/creator/campaigns" className="text-sm font-bold text-secondary hover:text-secondary/80 transition-colors">Find Campaigns</Link>
                  )}
                  <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Dashboard</Link>
                  <button onClick={() => signOut()} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all">Sign Out</button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white px-2">Log In</Link>
                  <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative flex-1 flex flex-col items-center justify-center px-8 pt-32 pb-20 text-center max-w-6xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
              <Sparkles size={14} /> The Future of Content Marketing
            </div>

            <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              CINEMATIC <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary text-glow">CREATOR ENERGY</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Connect with world-class UGC creators. High-performance video assets
              designed to scale your brand with <span className="text-white">cinematic quality</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
              <Link href="/campaigns" className="group relative px-10 py-5 bg-primary text-white rounded-2xl text-lg font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.5)] overflow-hidden">
                <div className="relative z-10 flex items-center gap-2">
                  Start Your Campaign <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {!user && (
                <Link href="/login" className="px-10 py-5 glass-panel rounded-2xl text-lg font-black hover:bg-white/5 transition-all border border-white/10 flex items-center gap-2">
                  <Play size={20} className="fill-white" /> View Showreel
                </Link>
              )}
            </div>
          </motion.div>

          {/* Floating Stat badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12 w-full"
          >
            <div className="space-y-1">
              <div className="text-3xl font-black">500+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Premium Brands</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">12k+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Creators</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-secondary">98%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Success Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black">$2.4M</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paid to Creators</div>
            </div>
          </motion.div>
        </main>

        {/* Features Grid */}
        <section className="relative z-10 py-32 px-10 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-yellow-400" />}
              title="Lightning Fast"
              desc="Get your campaign live and receiving applications in under 5 minutes."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-green-400" />}
              title="Secure Flow"
              desc="Payments locked in escrow until you approve the final content."
            />
            <FeatureCard
              icon={<Star className="text-purple-400" />}
              title="Elite Talent"
              desc="Work with creators who understand high-end brand aesthetics."
            />
          </div>
        </section>

        {/* Visual Noise Pattern for film grain effect */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </NoSSR>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl glass-panel border border-white/5 space-y-4 group"
    >
      <div className="p-3 w-fit rounded-2xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
