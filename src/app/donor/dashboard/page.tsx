"use client"

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import WalletLogo from "../../../../public/wallet.svg"
import GreenHeartLogo from "../../../../public/heart-green.svg"
import TrophyLogo from "../../../../public/trophy.svg"

import { useUserStore } from "@/hooks/userStore";
import DonorDashboard_SummaryOfDonor from "@/components/ui/donor-dashboard/summary_of_donor_block";
import DonorDashboard_StartNewDonation from "@/components/ui/donor-dashboard/start_new_donation_block";
import DonorDashboard_RecentDistributionTable from "@/components/ui/donor-dashboard/recent_distribution_table";
import DonorDashboard_DonorNavbar from "@/components/ui/donor-dashboard/donor_navbar";

type DashboardSummary = {
  totalDonated: number;
  activeImpact: number;
  currentRank: string;
};

type DashboardDistribution = {
  id: string;
  date: string;
  programName: string;
  amount: number;
  status: "Pending" | "Distributed";
};

type DonorDashboardPayload = {
  summary: DashboardSummary;
  recentDistributions: DashboardDistribution[];
  quickSelectAmounts: number[];
};

const FALLBACK_DASHBOARD_DATA: DonorDashboardPayload = {
  summary: {
    totalDonated: 0,
    activeImpact: 0,
    currentRank: "Bronze Donor",
  },
  recentDistributions: [],
  quickSelectAmounts: [1000000, 5000000, 10000000],
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateIso: string) => {
  const date = new Date(dateIso);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DonorDashboardPage(){
    const { data: session } = useSession();
    const username = useUserStore((state) => state.user?.username) || session?.user?.name || "Donor";
    const [dashboardData, setDashboardData] = useState<DonorDashboardPayload>(FALLBACK_DASHBOARD_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch("/api/donations?view=dashboard", {
            method: "GET",
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch donor dashboard data");
          }

          const payload = await response.json();
          setDashboardData(payload.data || FALLBACK_DASHBOARD_DATA);
        } catch (error) {
          console.error("Error loading donor dashboard data:", error);
          setDashboardData(FALLBACK_DASHBOARD_DATA);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardData();
    }, []);

    const tableRows = useMemo(
      () =>
        dashboardData.recentDistributions.map((distribution) => ({
          id: distribution.id,
          date: formatDate(distribution.date),
          programName: distribution.programName,
          amount: formatCurrency(distribution.amount),
          status: distribution.status,
        })),
      [dashboardData.recentDistributions]
    );

    return (
      <div className="bg-[#F3F5F7] text-[#111827]">
        <DonorDashboard_DonorNavbar />

        <main className="w-full max-w-[1400px] mx-auto px-6 pb-10 pt-8">
          <section>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
              Welcome back, <span className="text-[#07B0C8]">{username}</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Your generosity is changing lives - thank you for making a difference
            </p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <DonorDashboard_SummaryOfDonor
              logo={WalletLogo}
              alt="Wallet"
              title="Total Donated"
              caption={formatCurrency(dashboardData.summary.totalDonated)}
              color="07B0C8"
            />
            <DonorDashboard_SummaryOfDonor
              logo={GreenHeartLogo}
              alt="Green heart"
              title="Active Impact"
              caption={`${dashboardData.summary.activeImpact} Students`}
              color="10B981"
            />
            <DonorDashboard_SummaryOfDonor
              logo={TrophyLogo}
              alt="Trophy"
              title="Current Rank"
              caption={dashboardData.summary.currentRank}
              color="FCB82E"
            />
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
            <DonorDashboard_RecentDistributionTable rows={tableRows} isLoading={isLoading} />

            <DonorDashboard_StartNewDonation quickSelectAmounts={dashboardData.quickSelectAmounts} />
          </section>
        </main>
      </div>
    );
}