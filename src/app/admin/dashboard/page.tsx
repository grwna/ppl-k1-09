"use client";

import { useEffect, useState } from "react";
import React from "react";

import DollarSign from "../../../../public/dollar.svg"
import SummaryOfAspect from "@/components/ui/admin-dashboard/summary_of_aspect";
import AdminDashboard_FinancialOverviewChart from "@/components/ui/admin-dashboard/financial_overview_chart";
import AdminDashboard_RecentActivityTable from "@/components/ui/admin-dashboard/recent_activity_table";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";
import { useAdminDashboardStore } from "@/hooks/adminDashboardStore";
import LoadingPageComponent from "@/components/ui/loading";
import ErrorComponent from "@/components/ui/error";

export default function AdminDashboardPage() {
  const statistics = useAdminDashboardStore((state) => (state.statistics))
  // const analytics = useAdminDashboardStore((state) => (state.analytics)) // handled on the FinancialOverviewChart.tsx file
  // const pendingLogs = useAdminDashboardStore((state) => (state.pending_logs))
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const result = await response.json();

      if (response.ok) {
        const store = useAdminDashboardStore.getState();

        store.setAnalytics(result.data.analytics);
        store.setStatistics(result.data.statistics);
        store.setPendingLogs(result.data.pending_logs); 
      } else {
        setError(result.error || "Gagal memuat data");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center w-full h-fit"><LoadingPageComponent /></div>;
  if (error) return <div className="flex justify-center items-center w-full h-fit"><ErrorComponent message={error} /></div>;

  return (
    // main container
    <div className="flex flex-col justify-center items-center w-full h-fit bg-[#F9FAFB]">

        {/* navbar */}
        <div className="flex justify-center items-center w-full h-fit">
            <AdminDashboard_AdminNavbar />
        </div>
        
        {/* main content container */}
        <div className="flex flex-col justify-center items-center w-full h-fit p-4">

          {/* summaries of aspects */}
          <div className="flex justify-between items-center w-full h-fit p-2">

              {/* summary of pool funds */}
              <SummaryOfAspect title="Total Pool Funds" value={`Rp ${Number(statistics?.totalDonationAmount)}`} update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="07B0C8" update_caption_color="00A63E"/>         

              {/* summary of total disbursed /payed for now */}
              <SummaryOfAspect title="Total Disbursed" value={`Rp ${Number(statistics?.totalDisbursed)}`} update_caption="+8.2% from last month" logo={DollarSign} alt="Dollar Sign" value_color="000000" update_caption_color="00A63E"/>

              {/* summaryof pending applications */}
              <SummaryOfAspect title="Total Pending" value={Number(statistics?.pendingLoans)} update_caption="12 new this week" logo={DollarSign} alt="Dollar Sign" value_color="FCB82E" update_caption_color="00A63E"/>

              {/* summary of defauhlt rate */}
              <SummaryOfAspect title="Default Rate" value={`${Number(statistics?.defaultRate)}`} update_caption="-0.4% from last month" logo={DollarSign} alt="Dollar Sign" value_color="E7000B" update_caption_color="E7000B"/>
          
          </div>

          {/* financial overview */}
          <div className="flex flex-col justify-center items-start w-full h-fit p-4 m-2 shadow-xl bg-white rounded-2xl">
              {/* title */}
              <div className="flex justify-start items-center w-full h-fit text-xl font-bold">
                  Financial Overview
              </div>

              {/* caption */}
              <div className="flex justify-start items-center w-full h-fit font-medium ">
                  Monthly donations vs disbursements
              </div>

              {/* graph */}
              <div className="flex justify-center items-center w-full">
                  <AdminDashboard_FinancialOverviewChart />
              </div>
          </div>

          {/* recent activities */}
          <div className="flex flex-col justify-center items-start w-full h-fit p-4 m-2 shadow-xl bg-white rounded-2xl">
              {/* title */}
              <div className="flex justify-start items-center w-full h-fit font-bold text-lg">
                  Pending Loan Activities
              </div>

              {/* caption */}
              <div className="flex justify-start items-center w-full h-fit text-sm font-medium">
                  Last 5 pending loan activities
              </div>

              {/* list of items */}
              <div className="flex justify-center items-center w-full h-fit">
                  <AdminDashboard_RecentActivityTable />
              </div>
          </div>

        </div>

    </div>  
  );
}