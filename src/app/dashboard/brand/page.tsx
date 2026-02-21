"use client";

import { useAuth } from "@/context/AuthContext";
import { trpc } from "@/utils/trpc";
import { Plus, Users, Layout, Video, TrendingUp, Activity, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function BrandDashboardOverview() {
    const { user } = useAuth();
    const { data: profile } = trpc.user.getProfile.useQuery(
        { uid: user?.uid || "" },
        { enabled: !!user }
    );

    const stats = [
        {
            label: "Live Campaigns",
            value: "3",
            icon: Layout,
            color: "text-indigo-400",
            accent: "bg-indigo-500",
            trend: "+1",
            trendUp: true
        },
        {
            label: "Pending Applications",
            value: "42",
            icon: Users,
            color: "text-pink-400",
            accent: "bg-pink-500",
            trend: "+12",
            trendUp: true
        },
        {
            label: "Clip Submissions",
            value: "18",
            icon: Video,
            color: "text-emerald-400",
            accent: "bg-emerald-500",
            trend: "+5",
            trendUp: true
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                    <h2 className="text-4xl font-black tracking-tighter text-white">
                        <span className="text-slate-500 font-medium">CONSOLE /</span> OVERVIEW
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">Systems nominal. Management of your cinematic assets is active.</p>
                </div>
                <Link
                    href="/dashboard/brand/campaigns/new"
                    className="group relative px-6 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus size={16} /> Deploy New Brief
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-500" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative glass-panel p-8 rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2.5 rounded-xl bg-white/[0.03] border border-white/5", stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                    <TrendingUp size={10} /> {stat.trend}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                            </div>
                            {/* Animated Mini Progress Bar */}
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 + i * 0.1 }}
                                    className={cn("h-full rounded-full", stat.accent)}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Console Section */}
            <motion.div variants={itemVariants} className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 -z-10" />
                <div className="glass-panel rounded-[40px] border border-white/5 overflow-hidden">
                    <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Activity size={20} className="text-primary" />
                            <h3 className="font-black text-white uppercase tracking-widest text-sm">Active Grid Monitor</h3>
                        </div>
                        <Link href="/dashboard/brand/campaigns" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                            Access Full Database <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-24 h-24 rounded-full bg-[#020617] border-2 border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                <Sparkles size={40} className="animate-wiggle" />
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-white mb-3 tracking-tight italic">Grid Status: Idle</h4>
                        <p className="text-slate-400 font-medium text-sm mb-10 max-w-sm leading-relaxed uppercase tracking-widest">
                            No campaigns present in the synchronization layer.
                        </p>

                        <Link
                            href="/dashboard/brand/campaigns/new"
                            className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-secondary uppercase tracking-[0.3em] transition-all group/link"
                        >
                            Initialize System &rarr; <div className="w-0 group-hover/link:w-4 transition-all h-px bg-secondary" />
                        </Link>
                    </div>

                    {/* Console Visualizers */}
                    <div className="px-10 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-1 h-3 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                        <div className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                            Auth: 0xFD239 // Buffer: 100% // Mode: Cinematic
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
