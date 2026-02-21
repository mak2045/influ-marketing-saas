"use client";

import { trpc } from "@/utils/trpc";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Layout, Zap, Rocket, Plus, Settings, DollarSign, Target, ArrowLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function NewCampaignPage() {
    const { user } = useAuth();
    const router = useRouter();
    const createCampaign = trpc.campaign.create.useMutation();

    const [formData, setFormData] = useState({
        title: "",
        objective: "",
        platforms: [] as string[],
        clip_duration: "15-30s",
        budget: 100,
        payment_model: "FIXED" as "FIXED" | "PERFORMANCE",
        guidelines: "",
        dos: "",
        donts: "",
    });

    const [step, setStep] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await createCampaign.mutateAsync({
                ...formData,
                brandId: user.uid,
                guidelines: formData.guidelines || "Standard mission guidelines apply.",
                dos: formData.dos || "Be creative and professional.",
                donts: formData.donts || "Avoid low lighting or copyrighted music.",
            });
            router.push("/dashboard/brand/campaigns");
        } catch (error) {
            console.error("Failed to create campaign:", error);
        }
    };

    const togglePlatform = (p: string) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(p)
                ? prev.platforms.filter(x => x !== p)
                : [...prev.platforms, p]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Mission Header */}
            <div className="flex items-center gap-6 mb-12">
                <button
                    onClick={() => router.back()}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                        Initialize <span className="text-primary text-glow">Mission</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> Stage: {step} of 3
                        </div>
                        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary shadow-[0_0_10px_rgba(99,102,241,1)]"
                                animate={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel p-10 space-y-8"
                    >
                        <div>
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">1. Mission Objective</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Cinematic Autumn Collection Showcase"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-600"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Detailed Narrative</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Define the creative vision, key messaging, and emotional impact..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-primary transition-all placeholder:text-slate-600"
                                value={formData.objective}
                                onChange={e => setFormData({ ...formData, objective: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all"
                            >
                                Advance to Logistics
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel p-10 space-y-8"
                    >
                        <div>
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 block">2. Deployment Targets</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["TikTok", "Instagram", "YouTube", "Direct"].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => togglePlatform(p)}
                                        className={cn(
                                            "py-4 rounded-xl border font-bold text-sm transition-all",
                                            formData.platforms.includes(p)
                                                ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                                : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 block">Resource Allocation (Budget)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-5 text-3xl font-black text-white focus:outline-none focus:border-primary transition-all"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-5 bg-white/5 text-slate-400 font-bold rounded-2xl uppercase tracking-widest hover:text-white transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="flex-[2] py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all"
                            >
                                Final Review
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel p-10 space-y-8"
                    >
                        <div className="flex items-center gap-4 p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                            <Rocket size={32} className="text-primary" />
                            <div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">System Ready</h3>
                                <p className="text-xs text-slate-400 font-medium">Verify mission parameters before full deployment.</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex justify-between p-4 border-b border-white/5">
                                <span className="text-slate-500 font-bold text-sm uppercase">Objective</span>
                                <span className="text-white font-black">{formData.title}</span>
                            </div>
                            <div className="flex justify-between p-4 border-b border-white/5">
                                <span className="text-slate-500 font-bold text-sm uppercase">Budget</span>
                                <span className="text-secondary font-black">${formData.budget}</span>
                            </div>
                            <div className="flex justify-between p-4 border-b border-white/5">
                                <span className="text-slate-500 font-bold text-sm uppercase">Targets</span>
                                <span className="text-white font-bold">{formData.platforms.join(", ")}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 py-5 bg-white/5 text-slate-400 font-bold rounded-2xl uppercase tracking-widest hover:text-white transition-all"
                            >
                                Modify
                            </button>
                            <button
                                type="submit"
                                disabled={createCampaign.isPending}
                                className="flex-[2] py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(99,102,241,0.4)] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">{createCampaign.isPending ? "DEPlyOING..." : "DEPLOY MISSION"}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}
