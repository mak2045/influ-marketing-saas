"use client";

import { trpc } from "@/utils/trpc";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit2, Trash2, Send, Clock, Target, Rocket, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandCampaignList() {
    const { user } = useAuth();
    const { data: campaigns, isLoading, refetch } = trpc.campaign.listByBrand.useQuery(
        { brandId: user?.uid || "" },
        { enabled: !!user }
    );

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
                        Campaign <span className="text-primary text-glow">HQ</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Command & Control Center</p>
                </div>
                <Link
                    href="/dashboard/brand/campaigns/new"
                    className="group relative px-8 py-4 bg-primary text-white font-black rounded-2xl flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Plus size={20} className="relative z-10" />
                    <span className="relative z-10 uppercase tracking-widest text-sm">Deploy New Mission</span>
                </Link>
            </div>

            {/* List Table */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Objective</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Allocation</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Deployed</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {campaigns?.map((campaign: { id: string; title: string; objective: string; status: string; budget: number; payment_model: string; createdAt: string }) => (
                                <tr key={campaign.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="text-lg font-black text-white mb-1 group-hover:text-primary transition-colors">{campaign.title}</div>
                                        <div className="text-xs text-slate-500 font-medium line-clamp-1 max-w-sm">{campaign.objective}</div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <Target size={14} className="text-secondary" />
                                            <span className="text-white font-black text-lg">${campaign.budget}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{campaign.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-sm text-slate-400 font-bold">
                                        {new Date(campaign.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <button className="p-3 bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary border border-white/5 rounded-xl transition-all">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-3 bg-white/5 hover:bg-secondary/20 text-slate-400 hover:text-secondary border border-white/5 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {campaigns?.length === 0 && (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
                            <Rocket size={40} className="text-slate-700" />
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 italic">NO ACTIVE MISSIONS</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm font-bold leading-relaxed mb-10">
                            The fleet is idle. Deploy your first campaign to start receiving creator transmissions.
                        </p>
                        <Link
                            href="/dashboard/brand/campaigns/new"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black transition-all"
                        >
                            <span>Initialize First Mission</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
