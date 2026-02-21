"use client";

import { trpc } from "@/utils/trpc";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Target, FileVideo, FileText, CheckCircle2 } from "lucide-react";

interface Campaign {
    id: string;
    title: string;
    objective: string;
    budget: number;
    clip_duration?: string;
    brandName?: string;
    status: string;
}

export default function ApplyToCampaign() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const submitMutation = trpc.application.submit.useMutation();
    const { data: campaignData } = trpc.campaign.getById.useQuery({ id: id as string }, { enabled: !!id });
    const campaign = campaignData as Campaign | undefined;

    const [formData, setFormData] = useState({
        videoUrl: "",
        notes: "",
        portfolioLinks: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !id) return;

        try {
            await submitMutation.mutateAsync({
                campaignId: id,
                creatorId: user.uid,
                videoUrl: formData.videoUrl,
                notes: formData.notes,
                portfolioLinks: formData.portfolioLinks.split(",").map(s => s.trim()).filter(Boolean),
            });
            setIsSubmitted(true);
            setTimeout(() => router.push(`/dashboard/creator/campaigns`), 2000);
        } catch (error) {
            console.error("Failed to submit application:", error);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center container mx-auto px-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-16 rounded-[40px] text-center max-w-xl"
                >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <CheckCircle2 size={48} className="text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tight mb-4">Mission Deployed</h2>
                    <p className="text-slate-400 font-bold text-lg mb-0 leading-relaxed">
                        Your submission is now live. The brand has been notified of your engagement.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!campaign) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-40 px-10">
            {/* Header */}
            <div className="flex items-center gap-6 mb-16">
                <button
                    onClick={() => router.back()}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                        Engage <span className="text-secondary text-glow">Mission</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Target: {campaign.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="glass-panel p-10 space-y-10 rounded-[40px]">
                    <div className="flex items-center gap-10 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="text-center">
                            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Budget</div>
                            <div className="text-2xl font-black text-white">${campaign.budget}</div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="text-center">
                            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Format</div>
                            <div className="text-2xl font-black text-white">{campaign.clip_duration || "15-30s"}</div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                                <FileVideo size={14} /> 1. Video Deployment URL
                            </label>
                            <input
                                required
                                type="url"
                                placeholder="vimeo.com/mission-clip"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:border-secondary transition-all placeholder:text-slate-700 shadow-inner"
                                value={formData.videoUrl}
                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                                <FileText size={14} /> 2. Strategy Notes (Optional)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Explain your creative execution strategy..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-secondary transition-all placeholder:text-slate-700"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                                <Target size={14} /> 3. Verified Portfolio
                            </label>
                            <input
                                type="text"
                                placeholder="instagram.com/user, tiktok.com/@user"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-secondary transition-all placeholder:text-slate-700"
                                value={formData.portfolioLinks}
                                onChange={e => setFormData({ ...formData, portfolioLinks: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitMutation.isPending}
                            className="w-full py-6 bg-secondary text-white font-black rounded-[24px] uppercase tracking-widest shadow-[0_0_40px_rgba(219,39,119,0.3)] hover:shadow-[0_0_60px_rgba(219,39,119,0.5)] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10">{submitMutation.isPending ? "DEPlyOING..." : "DEPLOY APPLICATION"}</span>
                            <Rocket className="relative z-10" size={20} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
