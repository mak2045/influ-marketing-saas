"use client";

import { useAuth } from "@/context/AuthContext";
import { Megaphone, FileCheck, Wallet, Star, Sparkles, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function CreatorDashboardOverview() {
    const { user, profile } = useAuth();

    const stats = [
        {
            label: "Active Missions",
            value: "5",
            icon: FileCheck,
            color: "text-indigo-400",
            accent: "bg-indigo-500",
            trend: "+2",
            trendUp: true
        },
        {
            label: "Open Briefs",
            value: "24",
            icon: Megaphone,
            color: "text-secondary",
            accent: "bg-secondary",
            trend: "New",
            trendUp: true
        },
        {
            label: "Pending Payout",
            value: "$450",
            icon: Wallet,
            color: "text-emerald-400",
            accent: "bg-emerald-500",
            trend: "+$120",
            trendUp: true
        },
        {
            label: "Creator Rank",
            value: "4.9",
            icon: Star,
            color: "text-amber-400",
            accent: "bg-amber-500",
            trend: "Top 5%",
            trendUp: true
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
        >
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                        <span className="text-slate-500 font-medium not-italic">CREATOR /</span> CONSOLE
                    </h2>
                    <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">Ready for deployment. High-fidelity assets requested.</p>
                </div>
                <Link
                    href="/dashboard/creator/campaigns"
                    className="group relative px-8 py-4 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(219,39,119,0.3)] overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Sparkles size={16} /> Scan For Briefs
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2.5 rounded-xl bg-white/[0.03] border border-white/5", stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Feed Section */}
            <motion.div variants={itemVariants} className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 -z-10" />
                <div className="glass-panel rounded-[40px] border border-white/5 overflow-hidden">
                    <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Activity size={20} className="text-secondary" />
                            <h3 className="font-black text-white uppercase tracking-widest text-sm italic">Transmission Feed</h3>
                        </div>
                        <Link href="/dashboard/creator/campaigns" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                            Browse Market <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-24 h-24 rounded-full bg-[#020617] border-2 border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                <Megaphone size={40} />
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-white mb-3 tracking-tight italic uppercase">New Signals Detected</h4>
                        <p className="text-slate-400 font-medium text-sm mb-10 max-w-sm leading-relaxed uppercase tracking-widest">
                            Brands are deploying new campaign briefs in your frequency.
                        </p>

                        <Link
                            href="/dashboard/creator/campaigns"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black transition-all uppercase tracking-widest text-xs"
                        >
                            <span>Open Frequency</span>
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
