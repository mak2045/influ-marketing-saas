"use client";

import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Target, DollarSign, Calendar, Clock, Sparkles, Zap, ChevronRight, Rocket } from "lucide-react";

interface Campaign {
    id: string;
    title: string;
    objective: string;
    budget: number;
    clip_duration?: string;
    platforms?: string[];
    createdAt: string;
    status: string;
}

export default function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: campaignData, isLoading } = trpc.campaign.getById.useQuery({ id: id as string }, { enabled: !!id });
    const campaign = campaignData as Campaign | undefined;
    const router = useRouter();

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
            </div>
        </div>
    );

    if (!campaign) return <div className="p-20 text-center">Campaign not found</div>;

    return (
        <div className="min-h-screen pb-40">
            {/* Context Header */}
            <div className="container mx-auto px-10 pt-10">
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Feed
                </button>
            </div>

            <main className="container mx-auto px-10 mt-12 grid lg:grid-cols-[1fr_400px] gap-20">
                {/* Main Content */}
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-[10px] font-black uppercase tracking-wider text-primary">
                                {campaign.status}
                            </span>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Deployed {new Date(campaign.createdAt as string).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter italic mb-8 uppercase leading-tight">
                            {campaign.title}
                        </h1>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="glass-panel p-6 rounded-3xl border border-white/5">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Budget Allocation</div>
                                <div className="text-2xl font-black text-white flex items-center gap-2">
                                    <DollarSign className="text-primary" size={20} />
                                    {campaign.budget}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/5">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Content Format</div>
                                <div className="text-2xl font-black text-white flex items-center gap-2">
                                    <Zap className="text-secondary" size={20} />
                                    {campaign.clip_duration || "15-30s"}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/5">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Target Platforms</div>
                                <div className="text-lg font-black text-white truncate">
                                    {Array.isArray(campaign.platforms) ? campaign.platforms.join(", ") : "Multi-Platform"}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-invert max-w-none"
                    >
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-6">Mission Objective</h2>
                        <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {campaign.objective}
                        </p>
                    </motion.div>
                </div>

                {/* Sidebar Card */}
                <aside className="relative">
                    <div className="sticky top-10">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10" />
                        <div className="glass-panel p-10 rounded-[40px] border border-white/10">
                            <h3 className="text-2xl font-black text-white italic uppercase mb-8">Ready to Engage?</h3>
                            <ul className="space-y-6 mb-12">
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                                        <ChevronRight size={14} />
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold leading-relaxed">
                                        Submit high-fidelity cinematic clips aligned with the mission objective.
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                                        <ChevronRight size={14} />
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold leading-relaxed">
                                        Guaranteed review within 48 hours of submission deployment.
                                    </p>
                                </li>
                            </ul>

                            <Link
                                href={`/campaigns/${id}/apply`}
                                className="group w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.4)] relative"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">Deploy Application</span>
                                <Rocket className="relative z-10" size={18} />
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-3 p-6 glass-panel rounded-3xl border border-white/5 opacity-60">
                            <Sparkles size={16} className="text-secondary" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Premium Opportunity</span>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
