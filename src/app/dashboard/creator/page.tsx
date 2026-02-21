"use client";

import { useAuth } from "@/context/AuthContext";
import { trpc } from "@/utils/trpc";
import { Megaphone, FileCheck, Wallet, Star } from "lucide-react";
import Link from "next/link";

export default function CreatorDashboardOverview() {
    const { user } = useAuth();

    const stats = [
        { label: "Available Campaigns", value: "24", icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Applications", value: "5", icon: FileCheck, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Payouts", value: "$450", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
        { label: "Creator Rating", value: "4.9", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back, Creator!</h2>
                    <p className="text-gray-500">Ready to create some amazing content?</p>
                </div>
                <Link
                    href="/dashboard/creator/campaigns"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                >
                    Find Campaigns
                </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Recommended for You</h3>
                    <Link href="/dashboard/creator/campaigns" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-400 mb-4">
                        <Megaphone size={24} />
                    </div>
                    <h4 className="text-lg font-medium mb-1">New campaigns available</h4>
                    <p className="text-gray-500 text-sm mb-6">Check out the latest live briefs from top brands.</p>
                    <Link
                        href="/dashboard/creator/campaigns"
                        className="text-sm font-semibold text-blue-600"
                    >
                        Browse feed &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
