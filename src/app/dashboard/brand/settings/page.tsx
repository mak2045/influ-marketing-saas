"use client";

import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <div className="bg-white border rounded-xl shadow-sm divide-y">
                <div className="p-6">
                    <h3 className="font-medium mb-1">Brand Profile</h3>
                    <p className="text-sm text-gray-500 mb-6">Manage your public brand information.</p>

                    <div className="grid gap-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
                            <input type="text" className="mt-1 block w-full px-3 py-2 border rounded-md" defaultValue={user?.email?.split('@')[0]} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" disabled className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-50" defaultValue={user?.email || ""} />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="font-medium mb-1">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">Deleting your account is permanent and cannot be undone.</p>
                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
