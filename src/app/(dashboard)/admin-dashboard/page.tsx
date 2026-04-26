"use client"

import React from 'react';
import { DollarSign, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

import SummaryOfAspect from "@/components/ui/admin-dashboard/summary_of_aspect";
import AdminDashboard_FinancialOverviewChart from '@/components/ui/admin-dashboard/financial_overview_chart';
import AdminDashboard_RecentActivityTable from '@/components/ui/admin-dashboard/recent_activity_table';

export default function AdminDashboardPage(){
    return (
        <div className="flex flex-col gap-6 p-6">

            {/* summaries of aspects */}
            <div className="grid grid-cols-4 gap-4">

                <SummaryOfAspect
                    title="Total Pool Funds"
                    value="Rp 2.458.920.000"
                    update_caption="+12.5% from last month"
                    icon={DollarSign}
                    icon_bg_color="#07B0C8"
                    value_color="#07B0C8"
                    update_caption_color="#00A63E"
                />

                <SummaryOfAspect
                    title="Total Disbursed"
                    value="Rp 1.845.600.000"
                    update_caption="+8.2% from last month"
                    icon={TrendingUp}
                    icon_bg_color="#1e293b"
                    value_color="#1e293b"
                    update_caption_color="#00A63E"
                />

                <SummaryOfAspect
                    title="Pending Applications"
                    value="47"
                    update_caption="12 new this week"
                    icon={Clock}
                    icon_bg_color="#FCB82E"
                    value_color="#FCB82E"
                    update_caption_color="#00A63E"
                />

                <SummaryOfAspect
                    title="Default Rate"
                    value="2.8%"
                    update_caption="-0.4% from last month"
                    icon={AlertTriangle}
                    icon_bg_color="#E7000B"
                    value_color="#E7000B"
                    update_caption_color="#E7000B"
                />

            </div>

            {/* financial overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800">Financial Overview</h2>
                <p className="text-sm text-gray-400 mt-0.5 mb-4">Monthly donations vs disbursements</p>
                <AdminDashboard_FinancialOverviewChart />
            </div>

            {/* recent activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                <p className="text-sm text-gray-400 mt-0.5 mb-4">Last 5 system activities</p>
                <AdminDashboard_RecentActivityTable />
            </div>

        </div>
    );
}
