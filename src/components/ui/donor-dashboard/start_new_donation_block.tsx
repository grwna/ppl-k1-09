
"use client";

import { useDonationStore } from "@/hooks/donationStore";
import Link from "next/link";

type DonorDashboardStartNewDonationProps = {
    quickSelectAmounts: number[];
};

const formatCurrencyCompact = (amount: number) => {
    if (amount % 1000000 === 0) {
        return `Rp${amount / 1000000} Juta`;
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function DonorDashboard_StartNewDonation({ quickSelectAmounts }: DonorDashboardStartNewDonationProps) {

    const donationAmount = useDonationStore((state) => state.donation?.amount);
    const setAmount = useDonationStore((state) => state.setAmount);
    
    return (
        <aside className="h-full rounded-xl bg-[#07B0C8] p-4 shadow-[0_8px_16px_rgba(2,132,199,0.22)] md:p-5">
            <h2 className="text-lg font-bold leading-tight text-white">Start New Donation</h2>

            <p className="mt-3 max-w-[38ch] text-[13px] leading-relaxed text-[#DDF6FB]">
                Your contribution helps students achieve their educational dreams without the burden of interest.
            </p>

            <div className="mt-4">
                <p className="text-[12.5px] font-medium text-white">Donation Amount</p>

                <input
                    value={donationAmount || ""}
                    onChange={(e) => setAmount(Number(e.target.value || 0))}
                    inputMode="numeric"
                    className="mt-2 h-11 w-full rounded-md border border-white/25 bg-[#10AEC4] px-4 text-[13px] text-white placeholder:text-[#B8E8F0] focus:outline-none focus:ring-2 focus:ring-white/45"
                    placeholder="Rp 0"
                />

                <p className="mt-3 text-[12px] text-[#DDF6FB]">Quick select:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {quickSelectAmounts.map((amount) => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => setAmount(amount)}
                            className="rounded-md border border-white/30 bg-[#12AFC5] px-3 py-1.5 text-[11.5px] font-medium text-white transition hover:bg-[#14BDD6]"
                        >
                            {formatCurrencyCompact(amount)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <Link
                    href="/donor/donate-form"
                    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-[13px] font-medium text-[#0E8FA3] transition hover:bg-[#ECFEFF]"
                >
                    Make Donation
                </Link>
            </div>
        </aside>
    );
}
