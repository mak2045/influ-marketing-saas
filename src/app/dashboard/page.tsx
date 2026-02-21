"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirector() {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        // role is null while profile is loading
        // Wait silently — getProfile auto-creates with CREATOR if missing
        if (role === null) return;

        // Redirect based on resolved role
        if (role === "BRAND") {
            router.replace("/dashboard/brand");
        } else if (role === "CREATOR") {
            router.replace("/dashboard/creator");
        }
    }, [user, role, loading, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020617]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}
