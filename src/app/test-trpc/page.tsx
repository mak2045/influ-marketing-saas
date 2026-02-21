"use client";

import { trpc } from "@/utils/trpc";

export default function TestPage() {
    const testQuery = trpc.test.useQuery();
    const profileQuery = trpc.user.getProfile.useQuery(
        { uid: "test-user-123" },
        { enabled: true }
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold mb-8">tRPC Router Tests</h1>

                {/* Test Endpoint */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="text-2xl font-bold">1. Test Endpoint</h2>
                    <div>
                        <span className="text-slate-400 text-sm">Status:</span>
                        <div className="text-xl font-bold">
                            {testQuery.isLoading ? (
                                <span className="text-yellow-500">Loading...</span>
                            ) : testQuery.error ? (
                                <span className="text-red-500">Error</span>
                            ) : (
                                <span className="text-green-500">Success ✓</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-400 text-sm">Response:</span>
                        <div className="mt-2 p-4 bg-black/50 rounded-xl font-mono text-sm">
                            {testQuery.isLoading ? "..." : testQuery.error ? (
                                <span className="text-red-400">{testQuery.error.message}</span>
                            ) : (
                                <span className="text-green-400">"{testQuery.data}"</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Router */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="text-2xl font-bold">2. User Router (getProfile)</h2>
                    <div>
                        <span className="text-slate-400 text-sm">Status:</span>
                        <div className="text-xl font-bold">
                            {profileQuery.isLoading ? (
                                <span className="text-yellow-500">Loading...</span>
                            ) : profileQuery.error ? (
                                <span className="text-red-500">Error</span>
                            ) : (
                                <span className="text-green-500">Success ✓</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-400 text-sm">Response:</span>
                        <div className="mt-2 p-4 bg-black/50 rounded-xl font-mono text-sm">
                            {profileQuery.isLoading ? "..." : profileQuery.error ? (
                                <span className="text-red-400">{profileQuery.error.message}</span>
                            ) : (
                                <span className="text-green-400">{JSON.stringify(profileQuery.data, null, 2)}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm">
                    <p className="font-bold mb-2">Expected Results:</p>
                    <ul className="space-y-1 text-slate-300">
                        <li>✓ Test: "ok"</li>
                        <li>✓ User: {`{ uid: "test-user-123" }`}</li>
                        <li>✓ Both return 200 OK</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
