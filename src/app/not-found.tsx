"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Ghost, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] text-white selection:bg-primary/30 selection:text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <Sparkles size={14} /> System Error: 404
        </div>

        <div className="relative mb-12">
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-20"
            >
                <Ghost size={120} className="text-white/10 mx-auto" />
            </motion.div>
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 -z-10" />
        </div>

        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-none italic uppercase">
            Lost in <br />
            <span className="text-glow text-primary">Transmission</span>
        </h1>

        <p className="text-slate-400 max-w-md mx-auto text-lg font-medium leading-relaxed mb-12 uppercase tracking-wide">
            The coordinates you requested do not exist in the cinematic grid.
            Redirecting to home base recommended.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <Link
            href="/"
            className="group relative px-10 py-5 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
                <Home size={18} /> Return Home
            </span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-10 py-5 glass-panel rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all border border-white/10 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Previous Layer
          </button>
        </div>
      </motion.div>

      {/* Visual Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
