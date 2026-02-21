"use client";

import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Megaphone, Zap, Target, DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

// Define type for campaign based on backend schema
interface Campaign {
    id: string;
    title: string;
    objective: string;
    budget: number;
    brandName?: string;
    status: string;
    payment_model: string;
}

export default function CampaignList() {
    const { data: campaigns, isLoading } = trpc.campaign.list.useQuery();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCampaigns = campaigns?.filter((c: Campaign) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.objective.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
                <div className="container mx-auto px-10 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                    >
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Opportunity Engine</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-6 italic"
                    >
                        LIVE <span className="text-glow text-primary">CAMPAIGNS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Discover high-tier brand opportunities. Submit your best work and define the next era of content.
                    </motion.p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="container mx-auto px-10 -mt-10 relative z-20">
                <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns, brands, or objectives..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white font-bold transition-all flex items-center gap-3">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <main className="container mx-auto px-10 mt-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCampaigns?.map((campaign: Campaign, index: number) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="glass-panel h-full flex flex-col relative overflow-hidden group-hover:border-white/20 transition-all duration-500">
                                <div className="p-8 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-[10px] font-black uppercase tracking-wider text-primary">
                                            {campaign.payment_model}
                                        </div>
                                        <div className="text-2xl font-black text-white/90">
                                            <Target className="text-secondary inline-block mr-2" size={20} />
                                            ${campaign.budget}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                                        {campaign.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm line-clamp-3 font-medium leading-relaxed mb-8">
                                        {campaign.objective}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={14} className="text-secondary" />
                                            {campaign.brandName || "Premium Brand"}
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                        <div className="flex items-center gap-1.5 uppercase tracking-widest text-[9px]">
                                            {campaign.status}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/campaigns/${campaign.id}`}
                                    className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between group-hover:bg-primary transition-all duration-300"
                                >
                                    <span className="text-white font-black text-sm uppercase tracking-widest">Deploy Submission</span>
                                    <ArrowRight className="text-white" size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCampaigns?.length === 0 && (
                    <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[40px]">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Megaphone size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 italic">NO MATCHING FREQUENCIES</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Adjust your filters and try again</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function Sparkles({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
