"use client";

import { trpc } from "@/utils/trpc";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Rocket, Plus, Settings, DollarSign, Target, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Campaign {
    id: string;
    title: string;
    objective: string;
    budget: number;
    clip_duration?: string;
    platforms?: string[];
    payment_model: string;
    status: string;
}

export default function CreatorCampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: campaignData, isLoading } = trpc.campaign.getById.useQuery({ id: id as string }, { enabled: !!id });
    const campaign = campaignData as Campaign | undefined;
    const router = useRouter();

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
    );

    if (!campaign) return <div className="p-20 text-center">Campaign not found</div>;

    return (
        <div className="max-w-5xl mx-auto pb-40">
            {/* Breadcrumb / Action */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={() => router.back()}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={18} />
                    Back to Feed
                </button>

                <div className="flex items-center gap-4">
                    <span className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest">
                        High Priority
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <Clock size={14} /> Mission Ends in 4d
                    </div>
                </div>
            </div>

            <main className="grid lg:grid-cols-[1fr_380px] gap-12">
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase mb-6 leading-tight">
                            {campaign.title}
                        </h1>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-3 glass-panel rounded-2xl flex items-center gap-3">
                                <DollarSign className="text-green-500" size={20} />
                                <span className="text-xl font-black text-white">${campaign.budget}</span>
                            </div>
                            <div className="px-6 py-3 glass-panel rounded-2xl flex items-center gap-3">
                                <Target className="text-secondary" size={20} />
                                <span className="text-lg font-black text-white">{campaign.payment_model}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass-panel p-10 rounded-[32px] border border-white/5">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-6">Briefing Narrative</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                            {campaign.objective}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Targeted Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(campaign.platforms) ? campaign.platforms.map((p: string) => (
                                    <span key={p} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white font-bold text-xs">
                                        {p}
                                    </span>
                                )) : "All Platforms"}
                            </div>
                        </div>
                        <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Clip Requirements</h4>
                            <div className="text-white font-bold text-sm">
                                Duration: <span className="text-primary italic">{campaign.clip_duration || "15-30s"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="glass-panel p-8 rounded-[40px] border border-secondary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-2xl font-black text-white italic uppercase mb-6 relative z-10">Deploy Mission</h3>
                        <p className="text-slate-500 font-bold text-xs leading-relaxed mb-8 relative z-10">
                            Upload your cinematic sequence for brand review. Ensure all mission parameters are met.
                        </p>

                        <Link
                            href={`/campaigns/${id}/apply`}
                            className="w-full py-5 bg-secondary text-white font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(219,39,119,0.3)] hover:shadow-[0_0_50px_rgba(219,39,119,0.5)] transition-all relative z-10"
                        >
                            <span>Initialize Apply</span>
                            <Rocket size={18} />
                        </Link>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-black text-white uppercase tracking-wider mb-1">Standard Guidelines</div>
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                Avoid copyrighted music. Ensure lighting meets the premium aesthetic standards.
                            </p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
