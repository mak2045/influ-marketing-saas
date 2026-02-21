"use client";

import { trpc } from "@/utils/trpc";
import { useAuth } from "@/context/AuthContext";
import {
    Search,
    Filter,
    Calendar,
    DollarSign,
    ArrowRight,
    Sparkles,
    Zap,
    Target,
    Layers
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function CreatorCampaignFeed() {
    const { user } = useAuth();
    const { data: campaigns, isLoading } = trpc.campaign.list.useQuery();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCampaigns = campaigns?.filter((c: { title: string; brandName?: string }) => {
        return c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.brandName || "").toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex-1 w-full">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-6 italic uppercase">
                        Opportunity <span className="text-secondary text-glow">Feed</span>
                    </h1>
                    <div className="glass-panel p-3 rounded-2xl flex items-center gap-3">
                        <Search className="text-slate-500 ml-3" size={20} />
                        <input
                            type="text"
                            placeholder="Find your next breakthrough project..."
                            className="bg-transparent border-none text-white focus:outline-none flex-1 font-bold text-sm py-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                            <Filter size={18} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 pl-10 border-l border-white/5">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{campaigns?.length || 0}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">$12.4k</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pool</div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredCampaigns?.map((campaign: { id: string; title: string; budget: number; brandName?: string }, index: number) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="glass-panel h-full flex flex-col hover:border-secondary/30 transition-all duration-500 group-hover:-translate-y-2">
                                <div className="absolute top-0 right-0 p-6">
                                    {index % 3 === 0 && (
                                        <div className="p-2 rounded-lg bg-secondary/20 shadow-[0_0_15px_rgba(219,39,119,0.3)]">
                                            <Sparkles size={14} className="text-secondary" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 pb-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Zap size={14} className="text-primary" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {campaign.brandName || "Premium Partner"}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-secondary transition-colors">
                                        {campaign.title}
                                    </h2>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 font-black text-sm">
                                            <DollarSign size={14} />
                                            {campaign.budget}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                            <Layers size={14} />
                                            {index + 5} Open Slots
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto border-t border-white/5 p-6 flex items-center justify-between group-hover:bg-secondary/5 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                        <Calendar size={14} />
                                        <span>7 Days Left</span>
                                    </div>
                                    <Link
                                        href={`/dashboard/creator/campaigns/${campaign.id}`}
                                        className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group-hover:text-secondary transition-colors"
                                    >
                                        <span>View Details</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
