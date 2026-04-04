"use client"


import WalletLogo from "../../../../public/wallet.svg"
import GreenHeartLogo from "../../../../public/heart-green.svg"
import TrophyLogo from "../../../../public/trophy.svg"

import { useUserStore } from "@/hooks/userStore";
import DonorDashboard_SummaryOfDonor from "@/components/ui/donor-dashboard/summary_of_donor_block";
import DonorDashboard_StartNewDonation from "@/components/ui/donor-dashboard/start_new_donation_block";
import DonorDashboard_RecentDistributionTable from "@/components/ui/donor-dashboard/recent_distribution_table";

export default function DonorDashboardPage(){
    
    // init variables
    const username = useUserStore((state) => (state.user?.username))

    return (
      // main container
      <div>
        {/* title */}
        <div>
          Welvome back, {username}
        </div>

        {/* caption */}
        <div>
          Your generosity is changing lives - thank you for making a difference
        </div>

        {/* summary of aspects */}
        <div className="flex justify-between items-center">
          {/* total donated */}
          <DonorDashboard_SummaryOfDonor logo={WalletLogo} alt="Wallet" title="Total Donated" caption="Rp 25,750,000" color="07B0C8"/>

          {/* total donated */}
          <DonorDashboard_SummaryOfDonor logo={GreenHeartLogo} alt="Green heart" title="Active Impact" caption="12 Students" color="10B981"/>

          {/* total donated */}
          <DonorDashboard_SummaryOfDonor logo={TrophyLogo} alt="Trophy" title="Current Rank" caption="Gold Donor" color="FCB82E"/>

        </div>

        {/* recent distribution + start new donation container */}
        <div className="flex justify-between items-center">

          {/* recent distribution */}
          <div className="flex h-full w-[75%] justify-center items-center">
            <DonorDashboard_RecentDistributionTable />
          </div>

          {/* start new donation */}
          <div className="flex h-full w-[25%] justify-center items-center">
            <DonorDashboard_StartNewDonation />
          </div>

        </div>
        
      </div>  
    );
}