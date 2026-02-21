"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Megaphone, FileCheck, Wallet, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

const creatorNavItems = [
    { label: "Overview", href: "/dashboard/creator", icon: LayoutDashboard, color: "#6366f1" },
    { label: "Find Campaigns", href: "/dashboard/creator/campaigns", icon: Megaphone, color: "#818cf8" },
    { label: "My Applications", href: "/dashboard/creator/submissions", icon: FileCheck, color: "#db2777" },
    { label: "My Wallet", href: "/dashboard/creator/wallet", icon: Wallet, color: "#f472b6" },
    { label: "Settings", href: "/dashboard/creator/settings", icon: Settings, color: "#64748b" },
];

export default function CreatorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for loading to complete
        if (loading) return;

        // If no user, redirect to login
        if (!user) {
            router.push("/login");
            return;
        }

        // CRITICAL: Wait for profile.role to be loaded before checking access
        if (!profile || !profile.role) {
            // Still loading profile data, wait...
            return;
        }

        // Now check if user has correct role
        if (profile.role !== "CREATOR") {
            console.warn("Unauthorized access to Creator Dashboard");
            router.replace("/dashboard");
        }
    }, [user, profile, loading, router]);

    // Show loading spinner while waiting
    if (loading || !profile || !profile.role) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Guard: Only render if user has correct role
    if (!user || profile.role !== "CREATOR") return null;

    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-200">
            <DashboardSidebar customNavItems={creatorNavItems} />

            <div className="flex-1 flex flex-col relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />

                <header className="h-20 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-0.5">Creator Console</span>
                        <div className="text-sm font-semibold text-white/90">
                            Welcome back, <span className="text-secondary">{profile?.displayName || user.email}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            <Bell size={20} />
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-bold text-white">{profile?.displayName || "Creator"}</div>
                                <div className="text-[10px] text-slate-500">Gold Status</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary via-purple-500 to-primary p-[1px] shadow-[0_0_20px_rgba(219,39,119,0.3)]">
                                <div className="w-full h-full rounded-[11px] bg-[#020617] flex items-center justify-center text-white font-black text-lg">
                                    {profile?.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
