
"use client"
    
    
import React from "react";
import Image from "next/image";
import localFont from "next/font/local";

import DollarSign from "../../../../public/dollar.svg"
import SummaryOfAspect from "@/components/ui/admin-dashboard/summary_of_aspect";
import AdminDashboard_FinancialOverviewChart from "@/components/ui/admin-dashboard/financial_overview_chart";
import AdminDashboard_RecentActivityTable from "@/components/ui/admin-dashboard/recent_activity_table";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";

const plusJakartaSansFont = localFont({
  src: '../../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

export default function AdminDashboardPage(){
    
    // init variables

    return (
        // main container
        <div className={`${plusJakartaSansFont.className} flex flex-col justify-center items-center w-full h-fit bg-[#F9FAFB]`}>

            {/* navbar */}
            <div className="flex justify-center items-center w-full h-fit">
                <AdminDashboard_AdminNavbar />
            </div>
            
            {/* summaries of aspects */}
            <div className="flex justify-between items-center w-full h-fit p-2">

                {/* summary of pool funds */}
                <SummaryOfAspect title="Total Pool Funds" value="2.458.920.000" update_caption="+12.5% from last month" logo={DollarSign} alt="Dollar Sign" value_color="07B0C8" update_caption_color="00A63E"/>         

                {/* summary of total disbursed /payed for now */}
                <SummaryOfAspect title="Total Disbursed" value="1.845.600.000" update_caption="+8.2% from last month" logo={DollarSign} alt="Dollar Sign" value_color="000000" update_caption_color="00A63E"/>

                {/* summaryof pending applications */}
                <SummaryOfAspect title="Total Pool Funds" value="47" update_caption="12 new this week" logo={DollarSign} alt="Dollar Sign" value_color="FCB82E" update_caption_color="00A63E"/>

                {/* summary of defauhlt rate */}
                <SummaryOfAspect title="Default Rate" value="2.8%" update_caption="-0.4% from last month" logo={DollarSign} alt="Dollar Sign" value_color="E7000B" update_caption_color="E7000B"/>
            
            </div>

            {/* financial overview */}
            <div className="flex flex-col justify-center items-start w-full h-fit p-2 m-2 shadow-xl bg-white rounded-2xl">
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
            <div className="flex flex-col justify-center items-start w-full h-fit p-2 m-2 shadow-xl bg-white rounded-2xl">
                {/* title */}
                <div className="flex justify-start items-center w-full h-fit font-bold text-lg">
                    Recent Activities
                </div>

                {/* caption */}
                <div className="flex justify-start items-center w-full h-fit text-sm font-medium">
                    Last 5 system activities
                </div>

                {/* list of items */}
                <div className="flex justify-center items-center w-full h-fit">
                    <AdminDashboard_RecentActivityTable />
                </div>
            </div>

        </div>  
    );
}