"use client";

import { FileCheck, Sparkles, Rocket, Clock, Search, Filter, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function SubmissionsPage() {
    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
                        Asset <span className="text-secondary text-glow">Review</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Content Evaluation Center</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3">
                        <Search size={16} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-transparent border-none text-xs text-white focus:outline-none w-32"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="glass-panel rounded-[40px] border border-white/5 overflow-hidden">
                <div className="p-24 text-center flex flex-col items-center">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full bg-[#020617] border-2 border-secondary/30 flex items-center justify-center text-secondary">
                            <Play size={40} className="fill-secondary ml-1" />
                        </div>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-4 italic uppercase">Review Layer Offline</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm font-bold leading-relaxed mb-10 uppercase tracking-widest">
                        The video processing and approval engine is currently initializing.
                        Live review flow deployment scheduled for next update.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-secondary"
                                    animate={{ width: ["0%", "85%"] }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Core Engine</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    animate={{ width: ["0%", "40%"] }}
                                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                />
                            </div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">UI Layer</span>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="px-10 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Storage Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Processing Node: Syncing</span>
                        </div>
                    </div>
                    <div className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                        System.log: Waiting for transmission...
                    </div>
                </div>
            </div>
        </div>
    );
}
