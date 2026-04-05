
"use client"
    
    
import React from 'react';
import Image from "next/image";

import DollarSign from "../../../../public/dollar.svg"
import SummaryOfAspect from "@/components/ui/admin-dashboard/summary_of_aspect";
import AdminDashboard_FinancialOverviewChart from '@/components/ui/admin-dashboard/financial_overview_chart';
import AdminDashboard_RecentActivityTable from '@/components/ui/admin-dashboard/recent_activity_table';

export default function AdminDashboardPage(){
    
    // init variables
    const data = [{name: 'A', uv: 400}, {name: 'B', uv: 300}];

    return (
        // main container
        <div>
            
            {/* summaries of aspects */}
            <div className="flex justify-between items-center">

                {/* summary of pool funds */}
                <SummaryOfAspect title="Total Pool Funds" value="Rp 2.458.920.000" update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="07B0C8" update_caption_color="00A63E"/>         

                {/* summary of total disbursed /payed for now */}
                <SummaryOfAspect title="Total Pool Funds" value="Rp 2.458.920.000" update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="000000" update_caption_color="00A63E"/>

                {/* summaryof pending applications */}
                <SummaryOfAspect title="Total Pool Funds" value="Rp 2.458.920.000" update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="FCB82E" update_caption_color="00A63E"/>

                {/* summary of defauhlt rate */}
                <SummaryOfAspect title="Total Pool Funds" value="Rp 2.458.920.000" update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="E7000B" update_caption_color="E7000B"/>
            
            </div>

            {/* financial overview */}
            <div>
                {/* title */}
                <div>
                    Financial Overview
                </div>

                {/* caption */}
                <div>
                    Monthly donations vs disbursements
                </div>

                {/* graph */}
                <div>
                    <AdminDashboard_FinancialOverviewChart />
                </div>
            </div>

            {/* recent activities */}
            <div>
                {/* title */}
                <div>
                    Recent Activities
                </div>

                {/* caption */}
                <div>
                    Last 5 system activities
                </div>

                {/* list of items */}
                <div>
                    <AdminDashboard_RecentActivityTable />
                </div>
            </div>

        </div>  
    );
}
