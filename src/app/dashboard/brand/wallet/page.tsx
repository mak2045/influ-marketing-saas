"use client";

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Wallet & Payments</h2>
            <div className="bg-white p-12 text-center border rounded-xl shadow-sm">
                <p className="text-gray-500">Manage your funds and view payment history.</p>
                <div className="mt-6 flex flex-col items-center">
                    <div className="text-3xl font-bold mb-2">$0.00</div>
                    <div className="text-sm text-gray-400 mb-6">Available Balance</div>
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">Add Funds</button>
                </div>
            </div>
        </div>
    );
}
