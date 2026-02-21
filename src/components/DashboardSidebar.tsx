"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Megaphone,
    FileCheck,
    BarChart3,
    Wallet,
    Settings,
    LogOut,
    ChevronRight,
    Sparkles,
    Zap
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";

const defaultNavItems = [
    { label: "Analytics", href: "/dashboard/brand/analytics", icon: BarChart3, color: "#6366f1" },
    { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: Megaphone, color: "#818cf8" },
    { label: "Submissions", href: "/dashboard/brand/submissions", icon: FileCheck, color: "#db2777" },
    { label: "Finance", href: "/dashboard/brand/wallet", icon: Wallet, color: "#f472b6" },
];

import { LucideIcon } from "lucide-react";

export function DashboardSidebar({ customNavItems }: { customNavItems?: { label: string; href: string; icon: LucideIcon; color: string }[] }) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const navItems = customNavItems || defaultNavItems;

    return (
        <aside className="w-80 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col sticky top-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="p-10 flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-secondary p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                        <Zap className="text-white fill-current" size={24} />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter italic">UCG</h1>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary">Live Core</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-2 mt-4 relative">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "bg-white/[0.08] text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                                    : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-all duration-500",
                                    isActive ? "bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-white/5 group-hover:bg-white/10"
                                )}>
                                    <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="absolute right-0 w-1 h-8 bg-primary rounded-l-full shadow-[0_0_20px_rgba(99,102,241,1)]"
                                />
                            )}

                            <ChevronRight
                                size={14}
                                className={cn(
                                    "transition-all duration-300 relative z-10",
                                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-40 group-hover:translate-x-0"
                                )}
                            />
                        </Link>
                    )
                })}
            </nav>

            <div className="p-8 border-t border-white/5 relative bg-white/[0.02]">
                <div className="glass-panel p-6 rounded-[28px] border border-white/5 mb-8 group cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-black text-white uppercase tracking-wider mb-0.5">Studio Plus</div>
                            <div className="text-[10px] text-slate-500 font-bold">Priority Rendering</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-4 px-6 py-4 w-full text-slate-500 hover:text-white transition-colors font-bold text-sm"
                >
                    <LogOut size={20} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}
