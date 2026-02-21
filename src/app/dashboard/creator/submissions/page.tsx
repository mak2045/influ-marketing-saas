"use client";

import { trpc } from "@/utils/trpc";
import { useAuth } from "@/context/AuthContext";
import {
    FileCheck,
    ExternalLink,
    Video,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface Application {
    id: string;
    campaignId: string;
    videoUrl: string;
    status: string;
    createdAt: string;
}

export default function CreatorSubmissionsPage() {
    const { user } = useAuth();
    const { data: applications, isLoading } = trpc.application.myApplications.useQuery(
        { creatorId: user?.uid || "" },
        { enabled: !!user }
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
                        My <span className="text-secondary text-glow">Applications</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Transmission History</p>
                </div>
            </div>

            {/* List Table */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Target Mission</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Type</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Submitted</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {applications?.map((app: Application) => (
                                <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="text-lg font-black text-white mb-1 group-hover:text-secondary transition-colors italic uppercase">
                                            Campaign {app.campaignId.slice(-4)}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {app.id}</div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Video size={16} className="text-secondary" />
                                            <span className="font-bold text-sm">Cinematic Clip</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border",
                                            app.status === "PENDING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                            app.status === "APPROVED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                            "bg-red-500/10 border-red-500/20 text-red-500"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                app.status === "PENDING" ? "bg-amber-500 animate-pulse" :
                                                app.status === "APPROVED" ? "bg-emerald-500" : "bg-red-500"
                                            )} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-xs text-slate-500 font-bold uppercase">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={app.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white/5 hover:bg-secondary/20 text-slate-400 hover:text-secondary border border-white/5 rounded-xl transition-all"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {applications?.length === 0 && (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
                            <FileCheck size={40} className="text-slate-700" />
                            <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 italic uppercase">No Transmissions</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm font-bold leading-relaxed mb-10 uppercase tracking-widest">
                            You haven&apos;t deployed any mission applications yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
